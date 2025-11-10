import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: '@petfit_user',
  PET: '@petfit_pet',
  HEALTH_LOGS: '@petfit_health_logs',
  GEMS: '@petfit_gems',
};

// User storage
export const saveUser = async (userData) => {
  try {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const getUser = async () => {
  try {
    const userData = await AsyncStorage.getItem(KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const clearUser = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.USER);
  } catch (error) {
    console.error('Error clearing user:', error);
  }
};

// Pet storage
export const savePet = async (petData) => {
  try {
    await AsyncStorage.setItem(KEYS.PET, JSON.stringify(petData));
  } catch (error) {
    console.error('Error saving pet:', error);
  }
};

export const getPet = async () => {
  try {
    const petData = await AsyncStorage.getItem(KEYS.PET);
    return petData ? JSON.parse(petData) : null;
  } catch (error) {
    console.error('Error getting pet:', error);
    return null;
  }
};

// Health logs storage
export const saveHealthLogs = async (logs) => {
  try {
    await AsyncStorage.setItem(KEYS.HEALTH_LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving health logs:', error);
  }
};

export const getHealthLogs = async () => {
  try {
    const logs = await AsyncStorage.getItem(KEYS.HEALTH_LOGS);
    return logs ? JSON.parse(logs) : {};
  } catch (error) {
    console.error('Error getting health logs:', error);
    return {};
  }
};

// Gems storage
export const saveGems = async (gems) => {
  try {
    await AsyncStorage.setItem(KEYS.GEMS, JSON.stringify(gems));
  } catch (error) {
    console.error('Error saving gems:', error);
  }
};

export const getGems = async () => {
  try {
    const gems = await AsyncStorage.getItem(KEYS.GEMS);
    return gems ? JSON.parse(gems) : 0;
  } catch (error) {
    console.error('Error getting gems:', error);
    return 0;
  }
};

// Get today's date as string (YYYY-MM-DD)
export const getTodayKey = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};
