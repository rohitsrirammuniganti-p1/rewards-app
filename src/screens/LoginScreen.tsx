import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (e) {
      setError('Login failed. Please try again.');
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login('demo@example.com', 'demo');
    } catch (e) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appIcon}>💳</Text>
          <Text style={styles.appName}>Rewards Optimizer</Text>
          <Text style={styles.appTagline}>Find your best card for every purchase</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={{ marginTop: 16 }}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              secureTextEntry
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Logging in...' : 'Log In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo Section */}
        <View style={styles.demoSection}>
          <Text style={styles.demoLabel}>First time here?</Text>
          <TouchableOpacity
            style={styles.demoButton}
            onPress={handleDemoLogin}
            disabled={loading}
          >
            <Text style={styles.demoButtonText}>Try Demo (no password needed)</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            💡 This is a demo. Your card data is stored locally on your phone.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flexGrow: 1, padding: 20, justifyContent: 'space-between' },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  appIcon: { fontSize: 64, marginBottom: 16 },
  appName: { fontSize: 32, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
  appTagline: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },
  formContainer: { marginBottom: 24 },
  label: { fontSize: 12, fontWeight: '600', color: '#1a1a1a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  errorText: { color: '#d32f2f', marginTop: 12, fontSize: 13 },
  buttonContainer: { marginTop: 24 },
  loginButton: {
    backgroundColor: '#0a5cbf',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginButtonDisabled: { backgroundColor: '#ccc' },
  loginButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  demoSection: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#eee' },
  demoLabel: { fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 10 },
  demoButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#0a5cbf',
    borderRadius: 8,
    alignItems: 'center',
  },
  demoButtonText: { color: '#0a5cbf', fontWeight: '600', fontSize: 14 },
  footer: { paddingTop: 12, borderTopWidth: 1, borderTopColor: '#eee' },
  footerText: { fontSize: 12, color: '#666', textAlign: 'center', lineHeight: 18 },
});