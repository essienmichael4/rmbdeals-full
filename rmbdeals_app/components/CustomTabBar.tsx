import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: CustomTabBarProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const tabs = [
    { name: 'Home', icon: 'home', route: 'dashboard' },
    { name: 'Buy', icon: 'cart', route: 'buy' },
    { name: 'Orders', icon: 'list', route: 'orders' },
    { name: 'Profile', icon: 'person', route: 'profile' },
  ];

  // Slide in animation on mount
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  // Filter visible tabs
  const visibleTabs = tabs.filter(tab =>
    state.routes.some((route: any) => route.name === tab.route)
  );

  const currentIndex = state.index;

  const handleTabPress = (route: any, isFocused: boolean, index: number) => {
    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const { options } = descriptors[route.key];
    const onPress = navigation.emit({
      type: 'tabPress',
      target: route.key,
      preventDefault: false,
    });

    if (!isFocused && !onPress.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [120, 0],
              }),
            },
          ],
          opacity: slideAnim,
        },
      ]}
    >
      {/* Layer 3 - Back layer (White) */}
      <View style={[styles.tabBarLayer, styles.layer3]}>
        <View style={styles.tabsRow}>
          {visibleTabs.map((tab, idx) => (
            <View key={`layer3-${tab.route}`} style={styles.tabItem}>
              <Ionicons
                name={`${tab.icon}-outline` as any}
                size={20}
                color="#999"
              />
            </View>
          ))}
        </View>
      </View>

      {/* Layer 2 - Middle layer (Gold) */}
      <View style={[styles.tabBarLayer, styles.layer2]}>
        <View style={styles.tabsRow}>
          {visibleTabs.map((tab, idx) => (
            <View key={`layer2-${tab.route}`} style={styles.tabItem}>
              <Ionicons
                name={`${tab.icon}-outline` as any}
                size={20}
                color="#FFD700"
              />
            </View>
          ))}
        </View>
      </View>

      {/* Layer 1 - Front layer (Black) - Interactive */}
      <Animated.View
        style={[
          styles.tabBarLayer,
          styles.layer1,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.tabsRow}>
          {visibleTabs.map((tab, idx) => {
            const isFocused = currentIndex === idx;
            const route = state.routes[idx];

            return (
              <Pressable
                key={`layer1-${tab.route}`}
                onPress={() => handleTabPress(route, isFocused, idx)}
                style={[styles.tabItem, isFocused && styles.tabItemFocused]}
              >
                <Ionicons
                  name={(isFocused ? tab.icon : `${tab.icon}-outline`) as any}
                  size={20}
                  color={isFocused ? '#FFC107' : '#FFFFFF'}
                />
                {isFocused && (
                  <Text style={styles.tabLabel}>{tab.name}</Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 100,
    backgroundColor: 'transparent',
    paddingBottom: 16,
    paddingHorizontal: 12,
    justifyContent: 'flex-end',
  },
  tabBarLayer: {
    position: 'absolute',
    bottom: 65,
    left: 12,
    right: 12,
    height: 75,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 35,
  },
  layer1: {
    backgroundColor: '#000000',
    zIndex: 30,
    transform: [{ translateY: 0 }],
  },
  layer2: {
    backgroundColor: '#FFC107',
    zIndex: 20,
    marginHorizontal: 8,
    transform: [{ translateY: 8 }],
  },
  layer3: {
    backgroundColor: '#FFFFFF',
    zIndex: 10,
    marginHorizontal: 16,
    transform: [{ translateY: 16 }],
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 12,
  },
  tabItemFocused: {
    flex: 1,
  },
  tabLabel: {
    color: '#FFC107',
    fontSize: 16,
    fontWeight: '600',
  },
});
