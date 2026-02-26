import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosToken from '../../hooks/useAxiosToken';
import { useAlert } from '../../context/AlertContext';

export default function ProfileScreen(): React.ReactElement {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { dispatch, auth } = useAuth();
  const router = useRouter();
  const axiosToken = useAxiosToken();
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  // =======================
  // UPDATE PROFILE
  // =======================
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      const response = await axiosToken.patch('/users/account', {
        name: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      dispatch({
        type: 'UPDATE_AUTH',
        payload: {
          ...auth,
          name: data.name,
          email: data.email,
          phone: data.phone,
        },
      });
      setIsEditMode(false);
      showAlert('Success', 'Profile updated successfully', { type: 'success' });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to update profile';
      showAlert('Error', msg, { type: 'error' });
    },
  });

  // =======================
  // CHANGE PASSWORD
  // =======================
  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosToken.patch('/users/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      return response.data;
    },
    onSuccess: () => {
      showAlert('Success', 'Password changed successfully', { type: 'success' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsPasswordMode(false);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to change password';
      showAlert('Error', msg, { type: 'error' });
    },
  });

  useEffect(() => {
    if (auth) {
      setEditForm(auth);
    }
  }, [auth]);

  const handleSaveProfile = () => {
    if (!editForm?.name || !editForm?.email) {
      showAlert('Error', 'Name and email are required', { type: 'error' });
      return;
    }
    updateProfileMutation.mutate(editForm);
  };

  const handleSavePassword = () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      showAlert('Error', 'All password fields are required', { type: 'error' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showAlert('Error', 'New passwords do not match', { type: 'error' });
      return;
    }

    changePasswordMutation.mutate();
  };

  const handleLogout = () => {
    showAlert('Logout', 'Are you sure you want to logout?', {
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      buttonText: 'Logout',
      primaryButtonColor: '#ef4444',
      onPress: async () => {
        dispatch({ type: 'REMOVE_AUTH' });
        router.replace('/(auth)/login');
      },
    });
  };

  // =======================
  // MAIN UI
  // =======================
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-outline" size={40} color="#000000" />
        </View>
        <Text style={styles.profileName}>{auth?.name || 'User'}</Text>
        <Text style={styles.profileEmail}>{auth?.email || 'N/A'}</Text>
      </View>

      {/* ================= Profile Info ================= */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          {!isEditMode && !isPasswordMode && (
            <Pressable onPress={() => setIsEditMode(true)}>
              <Text style={styles.editLink}>Edit</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.infoCard}>
          {isEditMode ? (
            <>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={editForm?.name || ''}
                  onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                  placeholder="Enter your name"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={editForm?.email || ''}
                  onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                  placeholder="Enter your email"
                  placeholderTextColor="#666"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={editForm?.phone || ''}
                  onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
                  placeholder="Enter your phone"
                  placeholderTextColor="#666"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.buttonGroup}>
                <Pressable style={styles.saveButton} onPress={handleSaveProfile}>
                  {updateProfileMutation.isPending ? (
                    <ActivityIndicator size="small" color="#FFC107" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </Pressable>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => {
                    setEditForm(auth);
                    setIsEditMode(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
              </View>
            </>
          ) : isPasswordMode ? (
            <>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Current Password</Text>
                <TextInput
                  style={styles.input}
                  value={passwordForm.currentPassword}
                  onChangeText={(text) =>
                    setPasswordForm({ ...passwordForm, currentPassword: text })
                  }
                  placeholder="Enter current password"
                  placeholderTextColor="#666"
                  secureTextEntry
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  style={styles.input}
                  value={passwordForm.newPassword}
                  onChangeText={(text) =>
                    setPasswordForm({ ...passwordForm, newPassword: text })
                  }
                  placeholder="Enter new password"
                  placeholderTextColor="#666"
                  secureTextEntry
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                  style={styles.input}
                  value={passwordForm.confirmPassword}
                  onChangeText={(text) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: text })
                  }
                  placeholder="Confirm new password"
                  placeholderTextColor="#666"
                  secureTextEntry
                />
              </View>

              <View style={styles.buttonGroup}>
                <Pressable style={styles.saveButton} onPress={handleSavePassword}>
                  {changePasswordMutation.isPending ? (
                    <ActivityIndicator size="small" color="#FFC107" />
                  ) : (
                    <Text style={styles.saveButtonText}>Update Password</Text>
                  )}
                </Pressable>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => {
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                    setIsPasswordMode(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{auth?.name || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{auth?.email || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{auth?.phone || 'N/A'}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* ================= Account Settings ================= */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>

        <View style={styles.settingsCard}>
          <Pressable
            style={styles.settingItem}
            onPress={() => {
              setIsPasswordMode(true);
              setIsEditMode(false);
            }}
          >
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Change Password</Text>
              <Text style={styles.settingDesc}>Update your security password</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#FFC107" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notification Settings</Text>
              <Text style={styles.settingDesc}>Manage your notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#FFC107" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
              <Text style={styles.settingDesc}>Read our privacy terms</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#FFC107" />
          </Pressable>
        </View>
      </View>

      {/* ================= Logout ================= */}
      <View style={styles.section}>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </View>

      {/* Delete Account Button */}
      <View style={styles.section}>
        <Pressable
          style={styles.deleteButton}
          onPress={() => router.push('/delete-account')}
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
          <Text style={styles.deleteText}>Delete Account & Data</Text>
        </Pressable>
      </View>

      <View style={styles.footerSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { justifyContent: 'center', alignItems: 'center' },
  scrollContentContainer: { paddingTop: 30 },
  header: {
    backgroundColor: '#000000',
    paddingVertical: 30,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FFC107',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileName: { fontSize: 22, fontWeight: 'bold', color: '#FFC107', marginBottom: 4 },
  profileEmail: { fontSize: 13, color: '#CCCCCC' },
  section: { paddingHorizontal: 16, paddingVertical: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#000000' },
  editLink: { color: '#FFC107', fontSize: 14, fontWeight: '600' },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  fieldGroup: { marginBottom: 16 },
  label: { color: '#000000', fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    padding: 10,
    color: '#000000',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  buttonGroup: { flexDirection: 'row', gap: 8, marginTop: 16 },
  saveButton: {
    flex: 1,
    backgroundColor: '#000000',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButtonText: { color: '#FFC107', fontSize: 14, fontWeight: 'bold' },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  cancelButtonText: { color: '#000000', fontSize: 14, fontWeight: 'bold' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  infoLabel: { fontSize: 13, color: '#666666', fontWeight: '600' },
  infoValue: { fontSize: 14, color: '#000000', fontWeight: '500' },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  settingItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingContent: { flex: 1 },
  settingTitle: { fontSize: 14, fontWeight: '600', color: '#000000', marginBottom: 2 },
  settingDesc: { fontSize: 12, color: '#666666' },
  divider: { height: 1, backgroundColor: '#E5E5E5' },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
    gap: 8,
  },
  deleteText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerSpacing: { height: 30 },
});
