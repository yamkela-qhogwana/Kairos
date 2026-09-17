import { Platform } from 'react-native';

// Android emulator maps 10.0.2.2 to the host machine's localhost.
// iOS simulator can reach the host directly via localhost.
// For a real device on the same Wi-Fi, replace this with your machine's LAN IP (e.g. http://192.168.1.23:5080).
export const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5080' : 'http://localhost:5080';
