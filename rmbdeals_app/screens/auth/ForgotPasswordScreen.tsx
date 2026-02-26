import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types';
import { useRouter } from 'expo-router';
import { useAlert } from '../../context/AlertContext';

type ForgotPasswordScreenProps = StackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps): React.ReactElement {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const router = useRouter();
  const { showAlert } = useAlert();

  const handleResetPassword = async () => {
    if (!email.trim()) {
      showAlert('Error', 'Please enter your email address', { type: 'error' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showAlert('Error', 'Please enter a valid email address', { type: 'error' });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(() => resolve(undefined), 1500));
      await new Promise(resolve => setTimeout(() => resolve(undefined), 1500));
      setSubmitted(true);
      showAlert('Success', 'Password reset instructions have been sent to your email.', { type: 'success' });

      // Reset form after 2 seconds
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 2000);
    } catch (error) {
      showAlert('Error', 'Failed to send reset instructions. Please try again.', { type: 'error' });
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {!submitted ? (
          <>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                Don't worry! It happens. Please enter the email address associated with your account and we'll send you reset instructions.
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Please enter your email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
                <Text style={styles.helperText}>Please enter your accounts email address</Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.resetButton,
                  loading && styles.buttonDisabled,
                  pressed && !loading && { opacity: 0.8 },
                ]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFC107" />
                ) : (
                  <Text style={styles.resetButtonText}>Reset Password</Text>
                )}
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  pressed && { opacity: 0.6 },
                ]}
                onPress={() => router.back()}
                disabled={loading}
              >
                <View style={styles.backLink}>
                  <Ionicons name="arrow-back" size={18} color="#000000" />
                  <Text style={styles.backLinkText}>Back to log in</Text>
                </View>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={64} color="#10b981" />
            </View>
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successMessage}>
              We've sent password reset instructions to {email}. Please check your email and follow the link to reset your password.
            </Text>
            <Text style={styles.successSubtext}>
              Didn't receive an email? Check your spam folder or try again.
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    color: '#000000',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  helperText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  resetButton: {
    backgroundColor: '#000000',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  resetButtonText: {
    color: '#FFC107',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  backLinkText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  successSubtext: {
    fontSize: 13,
    color: '#999999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
