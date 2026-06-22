import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'; // 1. Import router hooks
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'; // 2. Fixed two-level relative path mapping
import { uploadExploration } from '../services/api'; // 3. Import your network service module
import { Colors } from '../theme/colors'; 

export default function ProcessingScreen() {
  // 4. Hook into the routing system context managers
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Processing'>>();
  
  // Extract target file path parameter payload passed from PreviewScreen
  const { imageUri } = route.params;

  const dot1 = useRef(new Animated.Value(0.4)).current;
  const dot2 = useRef(new Animated.Value(0.4)).current;
  const dot3 = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // ---- Bouncing Dots Loop Animation ----
    const createAnimation = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.4, duration: 400, useNativeDriver: true }),
        ])
      );
    };

    Animated.parallel([
      createAnimation(dot1, 0),
      createAnimation(dot2, 200),
      createAnimation(dot3, 400),
    ]).start();

    // ---- 5. Direct Execution of Async Network Request ----
    const fireTelemetryPipeline = async () => {
      try {
        const lat = 6.9271; 
        const lon = 79.8612;
        
        const payload = await uploadExploration(imageUri, lat, lon);
        
        // Push forward cleanly into the result layout while cleaning history track records
        navigation.replace('Result', {
          data: {
            locationName: payload.location_name,
            narrationText: payload.narration_text,
            audioBase64: payload.audio_base64,
            imageUri: imageUri
          }
        });
      } catch (error) {
        Alert.alert('Analysis Failed', 'Could not establish connection with LankaLens processing node.');
        navigation.navigate('Landing');
      }
    };

    fireTelemetryPipeline();
  }, [imageUri]);

  return (
    <View style={styles.container}>
      <View style={styles.dotRow}>
        <Animated.View style={[styles.dot, { opacity: dot1 }]} />
        <Animated.View style={[styles.dot, { opacity: dot2 }]} />
        <Animated.View style={[styles.dot, { opacity: dot3 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  dotRow: { flexDirection: 'row', gap: 12 },
  dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#E2975D' },
});