import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker'; 
import { useNavigation } from '@react-navigation/native'; // 1. Import navigation hooks
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';// Ensure this relative path correctly points to your App.tsx location
import { Colors } from '../theme/colors';

export default function LandingScreen() {
  // 2. Consume the native navigation pipeline engine context
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // Animated timing anchors for smooth entrance layout reveal
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const slideAnim = useRef(new Animated.Value(25)).current; 

  useEffect(() => {
    // Smoothly fade up titles and buttons over 600ms on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true, // Executes smoothly on the native UI thread
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handlePickImage = async () => {
    console.log("🚀 Upload button was physically pressed!");
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });
      
      console.log("📸 Picker API Result:", result);

      if (result.assets && result.assets[0].uri) {
        // 3. Route directly to your Preview Screen stack portal, passing the URI
        navigation.navigate('Preview', { imageUri: result.assets[0].uri });
      }
    } catch (error) {
      console.log("❌ Picker Error Context:", error);
    }
  };

  return (
    <ImageBackground 
      source={require('../assests/images/dabulla.jpg')} 
      style={styles.background}
    >
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.95)', '#000000']}
        locations={[0, 0.4, 0.8, 1.0]} 
        style={styles.overlay}
      >
        {/* Wrap main copy block in an Animated container */}
        <Animated.View style={[
          styles.titleContainer, 
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <Text style={styles.title}>LankaLens</Text>
          <Text style={styles.subtitle}>History through a different lens.</Text>
        </Animated.View>

        {/* Wrap control tray buttons in an Animated container */}
        <Animated.View style={[
          styles.actionRow, 
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          {/* Camera Button */}
          {/* 4. Trigger direct stack push navigation forward into Camera view mode */}
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={() => navigation.navigate('Camera')}
          >
            <Image 
              source={require('../assests/images/camera.png')} 
              style={styles.buttonImage} 
            />
            <Text style={styles.buttonLabel}>Open Camera</Text>
          </TouchableOpacity>

          {/* Upload Button */}
          <TouchableOpacity style={styles.iconButton} onPress={handlePickImage}>
            <Image 
              source={require('../assests/images/upload.png')} 
              style={styles.buttonImage} 
            />
            <Text style={styles.buttonLabel}>Upload Photo</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, justifyContent: 'space-between', padding: 24 },
  titleContainer: { marginTop: 140 },
  
  title: {
    fontFamily: 'PlayfairDisplay-Bold', 
    fontSize: 60, 
    color: Colors.primaryYellow, 
    letterSpacing: 1
    // 💥 REMOVED fontWeight: 'bold'
  },
  
  subtitle: { 
    fontFamily: 'PlayfairDisplay-Italic', 
    fontSize: 14, 
    color: Colors.textMain, 
    marginTop: 4
    // 💥 REMOVED fontStyle: 'italic' AND fontWeight: '600'
  },
  
  actionRow: { flexDirection: 'row', justifyContent: 'center', gap: 32, marginBottom: 60 },
  iconButton: { alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: 16, borderRadius: 50, width: 110, height: 110, justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  buttonImage: { width: 32, height: 32, marginBottom: 6, resizeMode: 'contain' },
  buttonLabel: { fontSize: 8, color: Colors.textMain, textAlign: 'center', fontWeight: '600' },
});