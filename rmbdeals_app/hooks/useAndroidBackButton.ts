import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useRouter } from 'expo-router';

export function useAndroidBackButton() {
    const router = useRouter();

    useEffect(() => {
        const onBackPress = () => {
            if (router.canGoBack()) {
                router.back();
                return true;
            }
            return false;
        };

        const counter = BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => counter.remove();
    }, [router]);
}
