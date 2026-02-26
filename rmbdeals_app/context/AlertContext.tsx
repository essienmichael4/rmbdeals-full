import React, { createContext, useContext, useState, ReactNode } from 'react';
import CustomAlert, { AlertType } from '../components/CustomAlert';

interface AlertOptions {
    type?: AlertType;
    onPress?: () => void;
    buttonText?: string;
    showCancelButton?: boolean;
    cancelButtonText?: string;
    onCancelPress?: () => void;
    primaryButtonColor?: string;
}

interface AlertContextType {
    showAlert: (title: string, message: string, options?: AlertOptions) => void;
    hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState<AlertType>('success');
    const [buttonText, setButtonText] = useState('OK');
    const [onPress, setOnPress] = useState<(() => void) | undefined>(undefined);

    // New state for cancel button and styling
    const [showCancelButton, setShowCancelButton] = useState(false);
    const [cancelButtonText, setCancelButtonText] = useState('Cancel');
    const [onCancelPress, setOnCancelPress] = useState<(() => void) | undefined>(undefined);
    const [primaryButtonColor, setPrimaryButtonColor] = useState<string | undefined>(undefined);

    const showAlert = (
        alertTitle: string,
        alertMessage: string,
        options?: AlertOptions
    ) => {
        setTitle(alertTitle);
        setMessage(alertMessage);
        setType(options?.type || 'success');
        setButtonText(options?.buttonText || 'OK');
        setOnPress(() => options?.onPress);

        // Set new options
        setShowCancelButton(options?.showCancelButton || false);
        setCancelButtonText(options?.cancelButtonText || 'Cancel');
        setOnCancelPress(() => options?.onCancelPress);
        setPrimaryButtonColor(options?.primaryButtonColor);

        setVisible(true);
    };

    const hideAlert = () => {
        setVisible(false);
        // Reset state after animation
        setTimeout(() => {
            setOnPress(undefined);
            setOnCancelPress(undefined);
        }, 300);
    };

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            <CustomAlert
                visible={visible}
                title={title}
                message={message}
                type={type}
                onClose={hideAlert}
                primaryButtonText={buttonText}
                onPrimaryButtonPress={onPress}
                showCancelButton={showCancelButton}
                cancelButtonText={cancelButtonText}
                onCancelButtonPress={onCancelPress}
                primaryButtonColor={primaryButtonColor}
            />
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};
