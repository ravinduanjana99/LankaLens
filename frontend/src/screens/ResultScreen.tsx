import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  InteractionManager, 
  ActivityIndicator 
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs'; 
import { RootStackParamList } from '../../App'; 
import { Colors } from '../theme/colors'; 

export default function ResultScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Result'>>();
  
  const { data } = route.params;

  // --- 1. State Hooks ---
  const [isTransitionComplete, setIsTransitionComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);

  // --- 2. Reference Hooks ---
  const soundInstance = useRef<Sound | null>(null);
  const tempAudioPath = `${RNFS.CachesDirectoryPath}/narration_cache.mp3`;
  const contentFadeAnim = useRef(new Animated.Value(0)).current;
  
  // Split narrative text into an array of words stably
  const wordsArray = useRef(data.narrationText.split(' ')).current;
  
  // Clean cross-platform interval identifier reference
  const trackingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Static baseline heights for our waveform visualization bars
  const waveHeights = [12, 24, 35, 18, 30, 42, 22, 38, 15, 28, 45, 20, 26, 34, 12];
  
  // Lazy-initialize the Animated values array cleanly to keep Fast Refresh completely stable
  const waveAnims = useRef<Animated.Value[]>([]);
  if (waveAnims.current.length === 0) {
    waveAnims.current = waveHeights.map(() => new Animated.Value(1));
  }

  // --- 3. Side Effects ---

  // Waveform fluid bounce loops
  useEffect(() => {
    let animations: Animated.CompositeAnimation[] = [];

    if (isPlaying) {
      animations = waveAnims.current.map((anim, index) => {
        const duration = 350 + (index % 3) * 120;
        return Animated.loop(
          Animated.sequence([
            Animated.timing(anim, { toValue: 1.6, duration, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0.4, duration, useNativeDriver: true }),
          ])
        );
      });
      animations.forEach(anim => anim.start());
    } else {
      waveAnims.current.forEach(anim => {
        Animated.timing(anim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
      });
    }

    return () => animations.forEach(anim => anim.stop());
  }, [isPlaying]);

  // Handle Voice Text Synchronization Timers
  useEffect(() => {
    if (isPlaying) {
      const MS_PER_WORD = 285; // Average baseline read speed configuration

      trackingInterval.current = setInterval(() => {
        setCurrentWordIndex((prevIndex) => {
          if (prevIndex >= wordsArray.length - 1) {
            if (trackingInterval.current) clearInterval(trackingInterval.current);
            return prevIndex;
          }
          return prevIndex + 1;
        });
      }, MS_PER_WORD);
    } else {
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
        trackingInterval.current = null;
      }
    }

    return () => {
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
        trackingInterval.current = null;
      }
    };
  }, [isPlaying, wordsArray.length]);

  // Audio File Buffering Pipeline
  useEffect(() => {
    Sound.setCategory('Playback');

    const task = InteractionManager.runAfterInteractions(async () => {
      setIsTransitionComplete(true);
      
      Animated.timing(contentFadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true, 
      }).start();

      if (!data.audioBase64) return;

      try {
        const rawBase64Data = data.audioBase64.includes(',') 
          ? data.audioBase64.split(',')[1] 
          : data.audioBase64;

        await RNFS.writeFile(tempAudioPath, rawBase64Data, 'base64');

        soundInstance.current = new Sound(tempAudioPath, '', (error) => {
          if (error) {
            console.log('Failed to load local audio cache:', error);
          }
        });
      } catch (err) {
        console.log('Error processing audio stream:', err);
      }
    });

    return () => {
      task.cancel();
      if (soundInstance.current) soundInstance.current.release();
      RNFS.unlink(tempAudioPath).catch(() => {});
    };
  }, [data.audioBase64, contentFadeAnim, tempAudioPath]);

  const toggleAudioPlayback = () => {
    if (!soundInstance.current) return;

    if (isPlaying) {
      soundInstance.current.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      soundInstance.current.play((success) => {
        setIsPlaying(false);
        if (success) {
          setCurrentWordIndex(-1); // Reset highlight back to start at absolute track end bounds
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      {!isTransitionComplete ? (
        <View style={styles.centeredLoading}>
          <ActivityIndicator size="large" color={Colors.primaryYellow} />
        </View>
      ) : (
        <Animated.View style={[styles.mainLayout, { opacity: contentFadeAnim }]}>
          {/* Top Header Image Layout */}
          <View style={styles.imageWrapper}>
            <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Landing')}>
              <Image source={require('../assests/images/Home.png')} style={styles.homeImage} />
            </TouchableOpacity>
            <Image source={{ uri: data.imageUri }} style={styles.imageHeader} />
          </View>

          {/* Meta Location Header Text */}
          <View style={styles.metaContainer}>
            <Text style={styles.locationTitle}>{data.locationName}</Text>
          </View>

          {/* Beautifully Justified Gemini Style Highlight Scroll Pane */}
          <ScrollView 
            style={styles.transcriptScroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.transcriptText}>
              {wordsArray.map((word, index) => {
                const isWordSpoken = index <= currentWordIndex;
                return (
                  <Text 
                    key={index} 
                    style={isWordSpoken ? styles.spokenWord : styles.unspokenWord}
                  >
                    {word}{' '}
                  </Text>
                );
              })}
            </Text>
          </ScrollView>

          {/* Compact Static Footer Audio Suite Container */}
          <View style={styles.audioSuite}>
            <Text style={styles.audioLabel}>Audio Documentary</Text>
            <View style={styles.playerBar}>
              <TouchableOpacity style={styles.playButton} onPress={toggleAudioPlayback}>
                <Image 
                  source={
                    isPlaying 
                      ? require('../assests/images/pause.png') 
                      : require('../assests/images/play.png')
                  } 
                  style={[styles.playIcon, !isPlaying && styles.playIconOffset]} 
                />
              </TouchableOpacity>
              
              <View style={styles.waveformContainer}>
                {waveHeights.map((baseHeight, i) => (
                  <Animated.View 
                    key={i} 
                    style={[
                      styles.waveBar, 
                      { 
                        height: baseHeight, 
                        backgroundColor: isPlaying ? Colors.background : '#8E8E8E',
                        transform: [{ scaleY: waveAnims.current[i] }]
                      }
                    ]} 
                  />
                ))}
              </View>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  mainLayout: { flex: 1 },
  centeredLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageWrapper: { width: '100%', height: '40%', position: 'relative' },
  imageHeader: { width: '100%', height: '100%', resizeMode: 'cover' },
  homeBtn: { position: 'absolute', top: 50, left: 20, zIndex: 10, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  homeImage: { width: 22, height: 22, resizeMode: 'contain' }, 
  
  metaContainer: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 6 },
  locationTitle: { fontFamily: 'PlayfairDisplay-Bold', color: Colors.primaryYellow, fontSize: 24, textAlign: 'left', includeFontPadding: false },
  
  transcriptScroll: { flex: 1, paddingHorizontal: 24 },
  scrollContent: { paddingBottom: 130, paddingTop: 4 }, 
  
  transcriptText: { 
    fontFamily: 'PlayfairDisplay-Regular', 
    fontSize: 15, 
    lineHeight: 26, 
    textAlign: 'justify' 
  },
  spokenWord: {
    color: Colors.textMain,
  },
  unspokenWord: {
    color: 'rgba(255, 255, 255, 0.28)',
  },
  
  audioSuite: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: Colors.primaryYellow, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    paddingHorizontal: 24, 
    paddingTop: 14, 
    paddingBottom: 22, 
    elevation: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 6 
  },
  audioLabel: { color: '#000000', fontWeight: 'bold', fontSize: 13, marginBottom: 8, textAlign: 'left' },
  playerBar: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  playButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  playIcon: { width: 18, height: 18, resizeMode: 'contain', tintColor: Colors.primaryYellow },
  playIconOffset: { marginLeft: 2 },
  waveformContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 45 },
  waveBar: { width: 3, borderRadius: 2 }
});