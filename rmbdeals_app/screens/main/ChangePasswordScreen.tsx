import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { MainTabParamList } from '../../types';
import useAxiosToken from '../../hooks/useAxiosToken';
import { useRouter } from 'expo-router';

type ChangePasswordScreenProps = StackScreenProps<MainTabParamList, 'ChangePassword'>;

export default function ChangePasswordScreen({
  navigation,
}: ChangePasswordScreenProps): React.ReactElement {
  const router = useRouter();
  const axios_instance_token = useAxiosToken();
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }

    if (!newPassword) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return;
    }

    setLoading(true);
    try {
      await axios_instance_token.put('/users/change-password', {
        currentPassword,
        newPassword
      });

      Alert.alert('Success', 'Password changed successfully');
      router.back();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to change password. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
      <View style={styles.header}>
        <Ionicons name="lock-closed-outline" size={48} color="#FFC107" />
        <Text style={styles.title}>Change Password</Text>
        <Text style={styles.subtitle}>Keep your account secure</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Current Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter your current password"
              placeholderTextColor="#666"
              secureTextEntry={!showCurrentPassword}
            />
            <Pressable
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showCurrentPassword ? 'eye' : 'eye-off'}
                size={20}
                color="#666"
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter your new password"
              placeholderTextColor="#666"
              secureTextEntry={!showNewPassword}
            />
            <Pressable
              onPress={() => setShowNewPassword(!showNewPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showNewPassword ? 'eye' : 'eye-off'}
                size={20}
                color="#666"
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your new password"
              placeholderTextColor="#666"
              secureTextEntry={!showConfirmPassword}
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye' : 'eye-off'}
                size={20}
                color="#666"
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.passwordRequirements}>
          <Text style={styles.requirementTitle}>Password Requirements:</Text>
          <View style={styles.requirement}>
            <Ionicons
              name={newPassword.length >= 6 ? 'checkmark-circle' : 'ellipse-outline'}
              size={16}
              color={newPassword.length >= 6 ? '#4CAF50' : '#666'}
            />
            <Text style={styles.requirementText}>At least 6 characters</Text>
          </View>
          <View style={styles.requirement}>
            <Ionicons
              name={newPassword === confirmPassword && newPassword ? 'checkmark-circle' : 'ellipse-outline'}
              size={16}
              color={newPassword === confirmPassword && newPassword ? '#4CAF50' : '#666'}
            />
            <Text style={styles.requirementText}>Passwords match</Text>
          </View>
          <View style={styles.requirement}>
            <Ionicons
              name={newPassword && newPassword !== currentPassword ? 'checkmark-circle' : 'ellipse-outline'}
              size={16}
              color={newPassword && newPassword !== currentPassword ? '#4CAF50' : '#666'}
            />
            <Text style={styles.requirementText}>Different from current password</Text>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              (loading || !currentPassword || !newPassword || !confirmPassword) && styles.submitButtonDisabled,
              pressed && { opacity: 0.8 },
            ]}
            onPress={handleChangePassword}
            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Updating...' : 'Update Password'}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },  scrollContentContainer: {
    paddingTop: 30,
  },  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  form: {
    padding: 20,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000000',
  },
  eyeIcon: {
    padding: 8,
  },
  passwordRequirements: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  requirementTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  requirementText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  buttonGroup: {
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});
