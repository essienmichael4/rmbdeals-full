import React from 'react';

import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import CheckoutScreen from '@screens/main/CheckoutScreen';

export default function Checkout() {
    const router = useRouter();

    useEffect(() => {
        // This is a modal screen, so it will be presented modally
    }, []);

    return <CheckoutScreen navigation={undefined as any} route={undefined as any} />;
}
