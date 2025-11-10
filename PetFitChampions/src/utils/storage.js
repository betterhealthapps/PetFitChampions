import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: '@petfit_user',
  PET: '@petfit_pet',
  HEALTH_LOGS: '@petfit_health_logs',
  GEMS: '@petfit_gems',
  ENERGY: '@petfit_energy',
  LAST_ENERGY_UPDATE: '@petfit_last_energy_update',
  BATTLE_STATS: '@petfit_battle_stats',
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

// Energy storage
export const saveEnergy = async (energy) => {
  try {
    await AsyncStorage.setItem(KEYS.ENERGY, JSON.stringify(energy));
  } catch (error) {
    console.error('Error saving energy:', error);
  }
};

export const getEnergy = async () => {
  try {
    const energy = await AsyncStorage.getItem(KEYS.ENERGY);
    return energy ? JSON.parse(energy) : 100;
  } catch (error) {
    console.error('Error getting energy:', error);
    return 100;
  }
};

export const saveLastEnergyUpdate = async (timestamp) => {
  try {
    await AsyncStorage.setItem(KEYS.LAST_ENERGY_UPDATE, JSON.stringify(timestamp));
  } catch (error) {
    console.error('Error saving last energy update:', error);
  }
};

export const getLastEnergyUpdate = async () => {
  try {
    const timestamp = await AsyncStorage.getItem(KEYS.LAST_ENERGY_UPDATE);
    return timestamp ? JSON.parse(timestamp) : null;
  } catch (error) {
    console.error('Error getting last energy update:', error);
    return null;
  }
};

// Battle stats storage
export const saveBattleStats = async (stats) => {
  try {
    await AsyncStorage.setItem(KEYS.BATTLE_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving battle stats:', error);
  }
};

export const getBattleStats = async () => {
  try {
    const stats = await AsyncStorage.getItem(KEYS.BATTLE_STATS);
    return stats ? JSON.parse(stats) : {
      pvp: { wins: 0, losses: 0 },
      bot: { 
        easy: { wins: 0, losses: 0 }, 
        medium: { wins: 0, losses: 0 }, 
        hard: { wins: 0, losses: 0 } 
      },
      runner: { highScore: 0, dailyGems: 0 }
    };
  } catch (error) {
    console.error('Error getting battle stats:', error);
    return {
      pvp: { wins: 0, losses: 0 },
      bot: { 
        easy: { wins: 0, losses: 0 }, 
        medium: { wins: 0, losses: 0 }, 
        hard: { wins: 0, losses: 0 } 
      },
      runner: { highScore: 0, dailyGems: 0 }
    };
  }
};

// Get today's date as string (YYYY-MM-DD)
export const getTodayKey = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};
