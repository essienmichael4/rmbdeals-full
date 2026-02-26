import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { useAndroidBackButton } from '../../hooks/useAndroidBackButton';
import useAuth from '../../hooks/useAuth';
import useAxiosToken from '../../hooks/useAxiosToken';

export default function DeleteAccountScreen() {
    const router = useRouter();
    useAndroidBackButton();
    const { auth, dispatch } = useAuth();
    const axios_instance_token = useAxiosToken();

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleDeleteAccount = async () => {
        if (!isConfirmed || confirmText.toLowerCase() !== 'delete my account') {
            Alert.alert('Error', 'Please type "delete my account" to confirm deletion');
            return;
        }

        setDeleteLoading(true);
        try {
            // Delete account with password verification
            await axios_instance_token.delete(`/users/delete/${auth?.id}`, {
                data: {
                    password: deletePassword,
                }
            });

            // Clear auth and navigate to login
            dispatch({ type: 'REMOVE_AUTH' });
            setDeleteModalVisible(false);
            setConfirmText('');
            setIsConfirmed(false);
            setDeletePassword('');
            Alert.alert(
                'Account Deleted',
                'Your account and all associated data have been successfully deleted.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/(auth)/login')
                    }
                ]
            );
        } catch (error: any) {
            console.error('Delete account error:', error);
            const message = error.response?.data?.message || 'Failed to delete account. Please try again.';
            Alert.alert('Error', message);
        } finally {
            setDeleteLoading(false);
        }
    };

    const openDeleteAccountModal = () => {
        setDeleteModalVisible(true);
    };

    const handleConfirmTextChange = (text: string) => {
        setConfirmText(text);
        setIsConfirmed(text.toLowerCase() === 'delete my account');
    };

    const SectionHeader = ({ title }: { title: string }) => (
        <Text style={styles.sectionTitle}>{title}</Text>
    );

    const SectionContent = ({ children }: { children: React.ReactNode }) => (
        <View style={styles.sectionContent}>{children}</View>
    );

    const BulletItem = ({ text }: { text: string }) => (
        <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>{text}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[colors.white, colors.gray]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Delete Account & Data</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    {/* Info Box */}
                    <View style={styles.infoBox}>
                        <MaterialIcons name="info" size={20} color={colors.primary} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoTitle}>RMB Deals Mobile</Text>
                            <Text style={styles.infoText}>Developer: RMB Deals Team</Text>
                        </View>
                    </View>

                    {/* Introduction */}
                    <SectionContent>
                        <Text style={styles.introText}>
                            We respect your privacy and your right to control your personal data. This page explains how you can request deletion of your account and associated data.
                        </Text>
                    </SectionContent>

                    {/* How to Request Section */}
                    <SectionHeader title="How to Request Account Deletion" />
                    <SectionContent>
                        <Text style={styles.descriptionText}>
                            You can request account deletion using any one of the following methods:
                        </Text>

                        {/* Option 1 */}
                        <View style={styles.optionBox}>
                            <View style={styles.optionHeader}>
                                <View style={styles.optionBadge}>
                                    <Text style={styles.badgeText}>1</Text>
                                </View>
                                <View style={styles.optionHeaderContent}>
                                    <Text style={styles.optionMainTitle}>In‑App Request (Recommended)</Text>
                                </View>
                            </View>
                            <View style={styles.optionSteps}>
                                <BulletItem text="Open the RMB Deals Mobile app" />
                                <BulletItem text="Go to Profile → Settings → Delete Account" />
                                <BulletItem text="Confirm your request" />
                            </View>
                        </View>

                        {/* Option 2 */}
                        <View style={styles.optionBox}>
                            <View style={styles.optionHeader}>
                                <View style={styles.optionBadge}>
                                    <Text style={styles.badgeText}>2</Text>
                                </View>
                                <View style={styles.optionHeaderContent}>
                                    <Text style={styles.optionMainTitle}>Email Request</Text>
                                </View>
                            </View>
                            <View style={styles.optionSteps}>
                                <Text style={styles.optionSubtitle}>Send an email from your registered email address to:</Text>
                                <View style={styles.emailBox}>
                                    <Text style={styles.emailAddress}>support@rmbdeals.com</Text>
                                </View>
                                <Text style={styles.optionSubtitle}>Use the subject line:</Text>
                                <View style={styles.subjectBox}>
                                    <Text style={styles.subjectText}>Account Deletion Request – RMB Deals Mobile</Text>
                                </View>
                                <Text style={styles.optionSubtitle}>Include:</Text>
                                <BulletItem text="Your full name" />
                                <BulletItem text="Registered email or phone number" />
                                <BulletItem text="Reason for deletion (optional)" />
                            </View>
                        </View>
                    </SectionContent>

                    {/* What Data Is Deleted Section */}
                    <SectionHeader title="What Data Is Deleted" />
                    <SectionContent>
                        <Text style={styles.descriptionText}>
                            When your account deletion request is processed, the following data will be permanently deleted:
                        </Text>
                        <BulletItem text="User profile information (name, email, phone number)" />
                        <BulletItem text="Login credentials and authentication tokens" />
                        <BulletItem text="Order history linked to your account" />
                        <BulletItem text="Saved addresses and preferences" />
                    </SectionContent>

                    {/* Data That May Be Retained Section */}
                    <SectionHeader title="Data That May Be Retained" />
                    <SectionContent>
                        <Text style={styles.descriptionText}>
                            Some data may be retained only where legally required or for legitimate business purposes:
                        </Text>
                        <BulletItem text="Transaction records (for accounting, tax, or legal compliance)" />
                        <BulletItem text="Audit logs related to fraud prevention or security" />

                        <View style={styles.retentionInfo}>
                            <Text style={styles.retentionTitle}>This retained data is:</Text>
                            <BulletItem text="Access‑restricted" />
                            <BulletItem text="Not used for marketing" />
                            <BulletItem text="Automatically deleted after the required retention period" />
                        </View>
                    </SectionContent>

                    {/* Confirmation Section */}
                    <SectionHeader title="Confirmation" />
                    <SectionContent>
                        <Text style={styles.bulletText}>
                            Once your deletion request is completed, you will receive a confirmation message. After deletion:
                        </Text>
                        <BulletItem text="Your account cannot be recovered" />
                        <BulletItem text="You will no longer be able to access the app using the deleted account" />
                    </SectionContent>

                    {/* Contact Section */}
                    <SectionHeader title="Contact Us" />
                    <SectionContent>
                        <Text style={styles.contactText}>
                            If you have questions about data deletion or privacy, contact us at:
                        </Text>
                        <View style={styles.contactBox}>
                            <MaterialIcons name="email" size={20} color={colors.primary} />
                            <Text style={styles.contactEmail}>support@rmbdeals.com</Text>
                        </View>
                    </SectionContent>

                    {/* Delete Account Button */}
                    <TouchableOpacity
                        onPress={openDeleteAccountModal}
                        style={styles.deleteButton}
                    >
                        <MaterialIcons name="delete-forever" size={20} color="white" />
                        <Text style={styles.deleteButtonText}>Request Account Deletion</Text>
                    </TouchableOpacity>

                    {/* Last Updated */}
                    <Text style={styles.lastUpdated}>Last updated: February 2026</Text>
                </ScrollView>
            </LinearGradient>

            {/* Delete Account Confirmation Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => {
                    setDeleteModalVisible(false);
                    setConfirmText('');
                    setIsConfirmed(false);
                }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.centeredView}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalView}>
                            {/* Alert Icon */}
                            <View style={styles.iconContainer}>
                                <View style={styles.iconWrapper}>
                                    <MaterialIcons name="warning" size={24} color={colors.error} />
                                </View>
                            </View>

                            <Text style={styles.confirmModalTitle}>Confirm Account Deletion</Text>
                            <Text style={styles.confirmModalDescription}>
                                This action cannot be undone. All your data will be permanently deleted.
                            </Text>

                            <ScrollView showsVerticalScrollIndicator={false} style={styles.confirmContent}>
                                {/* Confirmation Text Label */}
                                <Text style={styles.confirmLabel}>
                                    Type <Text style={styles.boldText}>"delete my account"</Text> to confirm:
                                </Text>

                                {/* Confirmation Text Input */}
                                <TextInput
                                    style={[styles.confirmInput, isConfirmed && styles.confirmInputSuccess]}
                                    value={confirmText}
                                    onChangeText={handleConfirmTextChange}
                                    placeholder="Type to confirm..."
                                    placeholderTextColor="#9CA3AF"
                                    editable={!deleteLoading}
                                />

                                {/* Password Input */}
                                <Text style={styles.confirmLabel}>Enter your password:</Text>
                                <TextInput
                                    style={styles.confirmInput}
                                    value={deletePassword}
                                    onChangeText={setDeletePassword}
                                    placeholder="Your password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry
                                    editable={!deleteLoading}
                                />

                                {/* Confirmation Status */}
                                {isConfirmed && (
                                    <View style={styles.confirmationStatus}>
                                        <MaterialIcons name="check-circle" size={18} color="#16A34A" />
                                        <Text style={styles.confirmationStatusText}>Ready to delete</Text>
                                    </View>
                                )}

                                {/* Modal Buttons */}
                                <View style={styles.confirmModalButtons}>
                                    <TouchableOpacity
                                        style={[styles.confirmButton, styles.confirmButtonCancel]}
                                        onPress={() => {
                                            setDeleteModalVisible(false);
                                            setConfirmText('');
                                            setIsConfirmed(false);
                                        }}
                                        disabled={deleteLoading}
                                    >
                                        <Text style={styles.confirmButtonCancelText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.confirmButton,
                                            styles.confirmButtonDelete,
                                            !isConfirmed && styles.confirmButtonDeleteDisabled
                                        ]}
                                        onPress={handleDeleteAccount}
                                        disabled={!isConfirmed || deleteLoading}
                                    >
                                        <Text style={styles.confirmButtonDeleteText}>
                                            {deleteLoading ? 'Deleting...' : 'Delete Account'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    gradient: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        paddingBottom: spacing.xxl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxl,
        paddingBottom: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
        flex: 1,
        textAlign: 'center',
        letterSpacing: -0.3,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        marginHorizontal: spacing.lg,
        marginTop: spacing.lg,
        marginBottom: spacing.lg,
        padding: spacing.md,
        borderRadius: 12,
        alignItems: 'flex-start',
        gap: spacing.md,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    infoText: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.primary,
        paddingHorizontal: spacing.lg,
        marginTop: spacing.lg,
        marginBottom: spacing.md,
        letterSpacing: -0.3,
    },
    sectionContent: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    introText: {
        fontSize: 15,
        lineHeight: 24,
        color: colors.textPrimary,
        fontWeight: '500',
        marginBottom: spacing.md,
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 22,
        color: colors.textSecondary,
        fontWeight: '500',
        marginBottom: spacing.md,
    },
    optionBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        elevation: 2,
    },
    optionHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
        gap: spacing.md,
    },
    optionBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    badgeText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
    },
    optionHeaderContent: {
        flex: 1,
    },
    optionMainTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
        letterSpacing: -0.2,
    },
    optionSteps: {
        marginTop: spacing.sm,
        gap: spacing.md,
    },
    optionSubtitle: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textPrimary,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    emailBox: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: spacing.sm,
    },
    emailAddress: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
        textDecorationLine: 'underline',
    },
    subjectBox: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: spacing.sm,
    },
    subjectText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary,
        lineHeight: 20,
    },
    bulletItem: {
        flexDirection: 'row',
        marginBottom: spacing.md,
        gap: spacing.sm,
        alignItems: 'flex-start',
    },
    bulletDot: {
        fontSize: 18,
        color: colors.primary,
        fontWeight: '700',
        marginTop: -4,
        marginRight: 4,
    },
    bulletText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 22,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    retentionInfo: {
        marginTop: spacing.md,
    },
    retentionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    contactText: {
        fontSize: 14,
        lineHeight: 22,
        color: colors.textSecondary,
        fontWeight: '500',
        marginBottom: spacing.md,
    },
    contactBox: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: spacing.md,
        alignItems: 'center',
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    contactEmail: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
        textDecorationLine: 'underline',
    },
    deleteButton: {
        flexDirection: 'row',
        backgroundColor: colors.error,
        marginHorizontal: spacing.lg,
        marginTop: spacing.xl,
        marginBottom: spacing.lg,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        gap: spacing.sm,
    },
    deleteButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: 'white',
        letterSpacing: 0.3,
    },
    lastUpdated: {
        textAlign: 'center',
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
        marginBottom: spacing.lg,
        marginHorizontal: spacing.lg,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        width: '90%',
        alignItems: 'stretch',
        elevation: 5,
        maxHeight: '80%',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmModalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
        letterSpacing: -0.3,
    },
    confirmModalDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.lg,
        lineHeight: 22,
        fontWeight: '500',
    },
    confirmContent: {
        marginVertical: spacing.md,
    },
    confirmLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    boldText: {
        fontWeight: '700',
        color: colors.textPrimary,
    },
    confirmInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        fontSize: 14,
        color: colors.textPrimary,
        marginBottom: spacing.md,
        backgroundColor: '#FFFFFF',
    },
    confirmInputSuccess: {
        borderColor: '#16A34A',
        backgroundColor: '#F0FDF4',
    },
    confirmationStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DCFCE7',
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        marginBottom: spacing.lg,
        gap: spacing.sm,
    },
    confirmationStatusText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#16A34A',
    },
    confirmModalButtons: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.lg,
    },
    confirmButton: {
        flex: 1,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    confirmButtonCancel: {
        backgroundColor: '#E5E7EB',
    },
    confirmButtonCancelText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    confirmButtonDelete: {
        backgroundColor: colors.error,
    },
    confirmButtonDeleteDisabled: {
        backgroundColor: '#D1D5DB',
        opacity: 0.6,
    },
    confirmButtonDeleteText: {
        fontSize: 14,
        fontWeight: '700',
        color: 'white',
    },
});
