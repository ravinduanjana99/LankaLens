import { Platform } from 'react-native';

// 10.0.2.2 is the special host IP mapped directly to your local computer by the Android Emulator
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

// 'export' makes this interface visible as a module property
export interface ProcessResponse {
  success: boolean;
  location_name: string;
  narration_text: string;
  audio_base64: string;
}

// 'export' explicitly exposes this async function to App.tsx
export const uploadExploration = async (
  imageUri: string, 
  lat: number | null, 
  lon: number | null
): Promise<ProcessResponse> => {
  const formData = new FormData();
  
  // Clean local path context format for the file wrapper
  const cleanUri = Platform.OS === 'android' ? imageUri : imageUri.replace('file://', '');
  
  formData.append('image', {
    uri: cleanUri,
    type: 'image/jpeg',
    name: 'exploration_capture.jpg',
  } as any);

  if (lat !== null && lon !== null) {
    formData.append('latitude', lat.toString());
    formData.append('longitude', lon.toString());
  }

  const response = await fetch(`${API_URL}/api/process-exploration`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (!response.ok) {
    throw new Error('Network response failed processing landmark identity');
  }

  return await response.json();
};