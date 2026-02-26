import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Pressable,
    SafeAreaView,
    Image,
    ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types';
import { useRouter } from 'expo-router';

type OnboardingScreenProps = StackScreenProps<AuthStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');

interface Slide {
    id: string;
    title: string;
    description: string;
    icon?: keyof typeof Ionicons.glyphMap;
    image?: ImageSourcePropType;
}

const slides: Slide[] = [
    {
        id: '1',
        title: 'Welcome to RMB Deals',
        description: 'The secure and reliable platform for all your RMB currency transactions.',
        image: require('../../assets/rmblogo.jpeg'),
    },
    {
        id: '2',
        title: 'Fast Transactions',
        description: 'Buy or sell RMB instantly with our streamlined process and best market rates.',
        icon: 'pricetags-outline',
    },
    {
        id: '3',
        title: 'Secure & Reliable',
        description: 'Your transactions are safe with us. Track every order in real-time.',
        icon: 'shield-checkmark-outline',
    },
];

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slidesRef = useRef<FlatList>(null);
    const router = useRouter();

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.replace('/(auth)/login');
        }
    };

    const handleSkip = () => {
        router.replace('/(auth)/login');
    };

    const renderItem = ({ item }: { item: Slide }) => {
        return (
            <View style={styles.slide}>
                <View style={[styles.iconContainer, item.image ? styles.imageContainer : undefined]}>
                    {item.image ? (
                        <Image source={item.image} style={styles.slideImage} resizeMode="contain" />
                    ) : (
                        <Ionicons name={item.icon!} size={80} color="#FFC107" />
                    )}
                </View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        );
    };

    const updateCurrentSlideIndex = (e: any) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentIndex(currentIndex);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Skip Button */}
            <View style={styles.header}>
                <Pressable
                  onPress={handleSkip}
                  style={({ pressed }) => [
                    pressed && { opacity: 0.6 },
                  ]}
                >
                    <Text style={styles.skipText}>Skip</Text>
                </Pressable>
            </View>

            {/* Slides */}
            <FlatList
                ref={slidesRef}
                onMomentumScrollEnd={updateCurrentSlideIndex}
                contentContainerStyle={{ height: height * 0.75 }}
                showsHorizontalScrollIndicator={false}
                horizontal
                data={slides}
                pagingEnabled
                renderItem={renderItem}
            />

            {/* Footer */}
            <View style={styles.footer}>
                {/* Indicators */}
                <View style={styles.indicatorContainer}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                currentIndex === index && styles.indicatorActive,
                            ]}
                        />
                    ))}
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <Pressable
                        style={({ pressed }) => [
                          styles.btn,
                          pressed && { opacity: 0.8 },
                        ]}
                        onPress={handleNext}
                    >
                        <Text style={styles.btnText}>
                            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    skipText: {
        color: '#666666',
        fontSize: 16,
        fontWeight: '600',
    },
    slide: {
        width,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    iconContainer: {
        width: 160,
        height: 160,
        backgroundColor: '#000000',
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        borderWidth: 2,
        borderColor: '#FFC107',
    },
    imageContainer: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    slideImage: {
        width: 160,
        height: 160,
        borderRadius: 80,
    },
    title: {
        color: '#000000',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        color: '#666666',
        fontSize: 16,
        textAlign: 'center',
        maxWidth: '80%',
        lineHeight: 24,
    },
    footer: {
        height: height * 0.20,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    indicator: {
        height: 4,
        width: 10,
        backgroundColor: '#CCCCCC',
        marginHorizontal: 3,
        borderRadius: 2,
    },
    indicatorActive: {
        backgroundColor: '#FFC107',
        width: 25,
    },
    buttonContainer: {
        marginBottom: 20,
    },
    btn: {
        height: 50,
        borderRadius: 25,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#FFC107',
    },
});
