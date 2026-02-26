import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/authContext';
import { AlertProvider } from '../context/AlertContext';
import useAuth from '../hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

const queryClient = new QueryClient();

function RootLayoutContent() {
  const { auth, loading } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem('hasSeenOnboarding');
      setHasSeenOnboarding(!!seen);
    };
    checkOnboarding();
  }, []);

  // Show loading while checking auth and onboarding status
  if (loading || hasSeenOnboarding === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  // Determine which group to show based on auth and onboarding status
  // If not authenticated and haven't seen onboarding, show auth group (which includes onboarding)
  // If not authenticated and have seen onboarding, show auth group (login)
  // If authenticated, show tabs group
  if (auth) {
    // User is authenticated, navigate to tabs
    return <Stack screenOptions={{ headerShown: false }} />;
  } else {
    // User is not authenticated, navigate to auth group
    return <Stack screenOptions={{ headerShown: false }} />;
  }
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AlertProvider>
          <RootLayoutContent />
        </AlertProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
