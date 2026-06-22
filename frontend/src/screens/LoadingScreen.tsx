import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'; // Double up levels to escape src/screens
import { Colors } from '../theme/colors';

export default function LoadingScreen() {
  // 1. Hook into the native navigation pipeline context
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // 2. Wrap mutable animation targets in useRef to protect integrity across mounts
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true, // Offloads rotation computations entirely to the OS thread
      })
    ).start();

    // Simulate system bootstrapping / assets preloading validation window
    const timer = setTimeout(() => {
      // 3. Destructive state swap ensures you can't navigate backward here
      navigation.replace('Landing');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.loaderRing, { transform: [{ rotate: spin }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  loaderRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 5,
    borderColor: 'transparent',
    borderTopColor: Colors.accentOrange,
    borderBottomColor: Colors.accentOrange,
  },
});