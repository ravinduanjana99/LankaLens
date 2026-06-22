import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // 1. Hook imports
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'; // 2. Fixed two-level relative path mapping
import { Colors } from '../theme/colors';

export default function CameraScreen() {
  // 3. Connect to the native stack router instance
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const triggerShutterMock = () => {
    const mockImageUri = 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=1000'; // Lotus Tower
    
    // 4. Push forward to the Preview view with the image parameters payload
    navigation.navigate('Preview', { imageUri: mockImageUri });
  };

  return (
    <View style={styles.container}>
      {/* 5. Go backward in stack seamlessly using goBack() */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Image 
          source={require('../assests/images/backarrow.png')}
          style={styles.backImage}
        />
      </TouchableOpacity>
      
      <View style={styles.cameraPlaceholder}>
        <Text style={styles.placeholderText}>[ Hardware Camera Stream Active ]</Text>
      </View>

      <View style={styles.controlTray}>
        <TouchableOpacity style={styles.shutterOuter} onPress={triggerShutterMock}>
          <View style={styles.shutterInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  backBtn: { position: 'absolute', top: 50, left: 20, zIndex: 10, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  backImage: { 
    width: 22, 
    height: 22, 
    resizeMode: 'contain',
  },
  cameraPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A1A' },
  placeholderText: { color: Colors.textMuted },
  controlTray: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' },
  shutterOuter: { width: 84, height: 84, borderRadius: 42, borderWidth: 4, borderColor: Colors.textMain, justifyContent: 'center', alignItems: 'center' },
  shutterInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.textMain },
});