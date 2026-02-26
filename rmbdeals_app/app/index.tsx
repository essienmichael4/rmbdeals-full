import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuth from '../hooks/useAuth';

const ONBOARDING_KEY = 'hasSeenOnboarding';

export default function Index() {
    const { auth, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const handleNavigation = async () => {
            // Wait for auth to finish loading
            if (loading) {
                return;
            }

            try {
                const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);

                // First time user - show onboarding
                if (!hasSeenOnboarding && !auth) {
                    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
                    router.replace('/(auth)/onboarding');
                } 
                // Authenticated user - show dashboard
                else if (auth) {
                    router.replace('/(tabs)/dashboard');
                } 
                // Unauthenticated user - show login
                else {
                    router.replace('/(auth)/login');
                }
            } catch (error) {
                console.error('[INDEX] Navigation error:', error);
                // Default to login on error
                router.replace('/(auth)/login');
            }
        };

        handleNavigation();
    }, [auth, loading, router]);

    // Return null - navigation happens via router.replace
    return null;
}
