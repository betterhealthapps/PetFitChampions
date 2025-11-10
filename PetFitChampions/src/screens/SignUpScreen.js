import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, Text, Card } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useContext(AuthContext);

  const handleSignUp = async () => {
    setError('');
    setLoading(true);
    
    try {
      await signUp(email, password, username);
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
          <Title style={styles.title}>🐾 Create Account</Title>
          <Text style={styles.subtitle}>Join PetFit Champions!</Text>
          
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            mode="outlined"
          />
          
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
            helperText="Minimum 6 characters"
          />
          
          {error ? <Text style={styles.error}>{error}</Text> : null}
          
          <Button 
            mode="contained" 
            onPress={handleSignUp}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Sign Up
          </Button>
          
          <Button 
            mode="text" 
            onPress={() => navigation.navigate('Login')}
            style={styles.link}
          >
            Already have an account? Login
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
