import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    type?: AlertType;
    onClose: () => void;
    primaryButtonText?: string;
    onPrimaryButtonPress?: () => void;
    showCancelButton?: boolean;
    cancelButtonText?: string;
    onCancelButtonPress?: () => void;
    primaryButtonColor?: string;
}

export default function CustomAlert({
    visible,
    title,
    message,
    type = 'success',
    onClose,
    primaryButtonText = 'OK',
    onPrimaryButtonPress,
    showCancelButton = false,
    cancelButtonText = 'Cancel',
    onCancelButtonPress,
    primaryButtonColor,
}: CustomAlertProps) {
    const [scaleValue] = React.useState(new Animated.Value(0));

    React.useEffect(() => {
        if (visible) {
            Animated.spring(scaleValue, {
                toValue: 1,
                useNativeDriver: true,
                damping: 15,
                stiffness: 150,
            }).start();
        } else {
            scaleValue.setValue(0);
        }
    }, [visible]);

    const getIconName = () => {
        switch (type) {
            case 'success':
                return 'checkmark-circle';
            case 'error':
                return 'alert-circle';
            case 'warning':
                return 'warning';
            case 'info':
                return 'information-circle';
            default:
                return 'checkmark-circle';
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success':
                return '#00C853'; // Green
            case 'error':
                return '#FF3D00'; // Red
            case 'warning':
                return '#FFAB00'; // Amber
            case 'info':
                return '#2962FF'; // Blue
            default:
                return '#000000';
        }
    };

    const handlePrimaryPress = () => {
        if (onPrimaryButtonPress) {
            onPrimaryButtonPress();
        }
        // Only close if it's not a confirm dialog or logic handles it?
        // Usually close on press. logic can handle async inside.
        onClose();
    };

    const handleCancelPress = () => {
        if (onCancelButtonPress) {
            onCancelButtonPress();
        }
        onClose();
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.alertContainer,
                        { transform: [{ scale: scaleValue }] },
                    ]}
                >
                    <View style={styles.iconContainer}>
                        <Ionicons name={getIconName()} size={48} color={getColor()} />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        {showCancelButton && (
                            <Pressable
                                style={({ pressed }) => [
                                    styles.button,
                                    styles.cancelButton,
                                    pressed && { opacity: 0.8 },
                                ]}
                                onPress={handleCancelPress}
                            >
                                <Text style={styles.cancelButtonText}>{cancelButtonText}</Text>
                            </Pressable>
                        )}
                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                { backgroundColor: primaryButtonColor || getColor() },
                                pressed && { opacity: 0.8 },
                            ]}
                            onPress={handlePrimaryPress}
                        >
                            <Text style={styles.buttonText}>{primaryButtonText}</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    alertContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'center',
        width: '100%',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        minWidth: 100,
        alignItems: 'center',
        flex: 1, // Make buttons flexible width
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cancelButtonText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '600',
    },
});
