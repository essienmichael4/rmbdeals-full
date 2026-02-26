import React from 'react';
import { Pressable, PressableProps, StyleSheet } from 'react-native';

interface PressableButtonProps extends PressableProps {
  children: React.ReactNode;
  style?: any;
}

/**
 * Web-compatible button component that works on both mobile and web
 * Replaces TouchableOpacity for better cross-platform support
 */
export const PressableButton: React.FC<PressableButtonProps> = ({
  children,
  style,
  onPress,
  disabled,
  ...props
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        style,
        pressed && !disabled && { opacity: 0.6 },
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
};

export default PressableButton;
