import { Platform } from 'react-native';
import Constants from 'expo-constants';

// For web, use process.env directly
// For native, use Constants.expoConfig?.extra
const getEnvVariable = (name: string) => {
  if (Platform.OS === 'web') {
    return process.env[name];
  }
  return Constants.expoConfig?.extra?.[name];
};

export default {
  firebase: {
    apiKey: getEnvVariable('EXPO_PUBLIC_FIREBASE_API_KEY'),
    authDomain: getEnvVariable('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnvVariable('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
    storageBucket: getEnvVariable('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnvVariable('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnvVariable('EXPO_PUBLIC_FIREBASE_APP_ID'),
    measurementId: getEnvVariable('EXPO_PUBLIC_MEASUREMENT_ID')
  }
};