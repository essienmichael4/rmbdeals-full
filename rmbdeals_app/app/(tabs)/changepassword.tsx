import React from 'react';
import ChangePasswordScreen from '../../screens/main/ChangePasswordScreen';
import { useRouter } from 'expo-router';

export default function ChangePassword() {
  const router = useRouter();

  return <ChangePasswordScreen navigation={undefined as any} route={undefined as any} />;
}
