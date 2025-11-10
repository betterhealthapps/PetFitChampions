import React, { createContext, useState, useEffect } from 'react';
import { saveUser, getUser, clearUser } from '../utils/storage';
import SHA256 from 'crypto-js/sha256';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on app start
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await getUser();
    if (userData) {
      // Validate that user has password hash (reject corrupted/legacy accounts)
      if (!userData.passwordHash) {
        await clearUser();
        setUser(null);
        setLoading(false);
        return;
      }
      
      const { passwordHash, ...userWithoutPassword } = userData;
      setUser(userWithoutPassword);
    }
    setLoading(false);
  };

  // Sign up function
  const signUp = async (email, password, username) => {
    // Simple validation
    if (!email || !password || !username) {
      throw new Error('All fields are required');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Hash password before storing
    const passwordHash = SHA256(password).toString();

    // Create user object with hashed password
    const newUser = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      username,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    await saveUser(newUser);
    
    // Set user without password hash
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    return userWithoutPassword;
  };

  // Login function
  const login = async (email, password) => {
    const existingUser = await getUser();
    
    if (!existingUser) {
      throw new Error('No account found. Please sign up first.');
    }
    
    // Ensure user has password hash (reject legacy users without passwords)
    if (!existingUser.passwordHash) {
      throw new Error('Account corrupted. Please sign up again.');
    }

    if (existingUser.email !== email.toLowerCase()) {
      throw new Error('Invalid email or password');
    }

    // Verify password hash
    const passwordHash = SHA256(password).toString();
    if (existingUser.passwordHash !== passwordHash) {
      throw new Error('Invalid email or password');
    }

    // Set user without password hash
    const { passwordHash: _, ...userWithoutPassword } = existingUser;
    setUser(userWithoutPassword);
    return userWithoutPassword;
  };

  // Logout function
  const logout = async () => {
    await clearUser();
    setUser(null);
  };

  const value = {
    user,
    loading,
    signUp,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
