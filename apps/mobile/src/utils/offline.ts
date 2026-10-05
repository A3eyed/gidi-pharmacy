import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'gidi.offline.';

export async function readOffline<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function writeOffline(key: string, value: unknown) {
  try {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // A full disk should not block the online path.
  }
}
