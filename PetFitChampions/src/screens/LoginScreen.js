import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, Text, Card } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>🐾 PetFit Champions</Title>
          <Text style={styles.subtitle}>Welcome back!</Text>
          
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
          />
          
          {error ? <Text style={styles.error}>{error}</Text> : null}
          
          <Button 
            mode="contained" 
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Login
          </Button>
          
          <Button 
            mode="text" 
            onPress={() => navigation.navigate('SignUp')}
            style={styles.link}
          >
            Don't have an account? Sign Up
          </Button>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    padding: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 24,
    color: '#666',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
  link: {
    marginTop: 8,
  },
  error: {
    color: '#d32f2f',
    marginBottom: 12,
    textAlign: 'center',
  },
});
