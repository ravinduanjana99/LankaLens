import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screen Imports
import LoadingScreen from './src/screens/LoadingScreen';
import LandingScreen from './src/screens/LandingScreen';
import CameraScreen from './src/screens/CameraScreen';
import PreviewScreen from './src/screens/PreviewScreen';
import ProcessingScreen from './src/screens/ProcessingScreen';
import ResultScreen from './src/screens/ResultScreen';

// 1. Explicit Parameter Definition for Type Safety Across Screen Portals
export type RootStackParamList = {
  Loading: undefined;
  Landing: undefined;
  Camera: undefined;
  Preview: { imageUri: string };     // Pass selected or captured image path parameter forward
  Processing: { imageUri: string };  // Tracks the target file context for the network pipeline
  Result: { data: { locationName: string; narrationText: string; audioBase64: string; imageUri: string } };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaView style={styles.rootContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* 2. Global Navigation Context Handler */}
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Loading"
          screenOptions={{
            headerShown: false,           // Hides standard white native navigation bar titles
            animation: 'slide_from_right', // 60fps hardware-accelerated card transition feel
            gestureEnabled: true,          // Allows users to swipe left edge to go back smoothly
          }}
        >
          {/* 3. Register screens to the native OS stack controller layer */}
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="Preview" component={PreviewScreen} />
          <Stack.Screen name="Processing" component={ProcessingScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: { flex: 1, backgroundColor: '#000000' }
});