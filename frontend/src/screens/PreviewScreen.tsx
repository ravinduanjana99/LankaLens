import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Animated } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'; 
import { Colors } from '../theme/colors'; 

export default function PreviewScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Preview'>>();
  
  const { imageUri } = route.params;

  // Instantiating a native-driven opacity timing variable
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Graceful 400ms fade-in transition when entering preview mode
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true, 
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Absolute Header Overlay Layer */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Image 
          source={require('../assests/images/backarrow.png')}
          style={styles.backImage}
        />
      </TouchableOpacity>

      {/* Main Preview Container Area */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      </View>

      {/* Structured Static Footer Control Panel Block */}
      <View style={styles.footerContainer}>
        <TouchableOpacity 
          style={styles.processBtn} 
          onPress={() => navigation.navigate('Processing', { imageUri })}
        >
          <Text style={styles.processText}>Process Image</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  
  // Back Navigation Button Styling Overlay
  backBtn: { position: 'absolute', top: 50, left: 20, zIndex: 10, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  backImage: { width: 22, height: 22, resizeMode: 'contain' }, 
  
  // Flexbox Layout isolation bounds to make layouts clean on any display height
  imageContainer: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center', paddingTop: 100, paddingBottom: 20 },
  previewImage: { width: '100%', height: '100%', borderRadius: 16, resizeMode: 'cover' },
  
  // Consistent bottom footer padding anchor
  footerContainer: { paddingHorizontal: 24, paddingBottom: 40 },
  processBtn: { backgroundColor: Colors.primaryYellow, height: 54, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  
  processText: {
    fontFamily: 'Robo-Bold', // 🔥 Applied static bold font asset cleanly
    color: '#000000', 
    fontSize: 16 
    // 💥 REMOVED: fontWeight: 'bold' to fix Android fallback rendering issues
  },
});