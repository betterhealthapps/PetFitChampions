import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: '@petfit_user',
  PET: '@petfit_pet',
  HEALTH_LOGS: '@petfit_health_logs',
  GEMS: '@petfit_gems',
  ENERGY: '@petfit_energy',
  LAST_ENERGY_UPDATE: '@petfit_last_energy_update',
  BATTLE_STATS: '@petfit_battle_stats',
  OWNED_ITEMS: '@petfit_owned_items',
  EQUIPPED_COSMETICS: '@petfit_equipped_cosmetics',
  LEARNED_TRICKS: '@petfit_learned_tricks',
  PET_SLOTS: '@petfit_pet_slots',
  LEADERBOARD_DATA: '@petfit_leaderboard',
  WEEKLY_STREAK: '@petfit_weekly_streak',
  PROFILE_DATA: '@petfit_profile',
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

// Shop - Owned Items
export const saveOwnedItems = async (items) => {
  try {
    await AsyncStorage.setItem(KEYS.OWNED_ITEMS, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving owned items:', error);
  }
};

export const getOwnedItems = async () => {
  try {
    const items = await AsyncStorage.getItem(KEYS.OWNED_ITEMS);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error getting owned items:', error);
    return [];
  }
};

// Shop - Equipped Cosmetics
export const saveEquippedCosmetics = async (cosmetics) => {
  try {
    await AsyncStorage.setItem(KEYS.EQUIPPED_COSMETICS, JSON.stringify(cosmetics));
  } catch (error) {
    console.error('Error saving equipped cosmetics:', error);
  }
};

export const getEquippedCosmetics = async () => {
  try {
    const cosmetics = await AsyncStorage.getItem(KEYS.EQUIPPED_COSMETICS);
    return cosmetics ? JSON.parse(cosmetics) : {
      hat: null,
      accessory: null,
      skin: null,
    };
  } catch (error) {
    console.error('Error getting equipped cosmetics:', error);
    return {
      hat: null,
      accessory: null,
      skin: null,
    };
  }
};

// Shop - Learned Tricks
export const saveLearnedTricks = async (tricks) => {
  try {
    await AsyncStorage.setItem(KEYS.LEARNED_TRICKS, JSON.stringify(tricks));
  } catch (error) {
    console.error('Error saving learned tricks:', error);
  }
};

export const getLearnedTricks = async () => {
  try {
    const tricks = await AsyncStorage.getItem(KEYS.LEARNED_TRICKS);
    return tricks ? JSON.parse(tricks) : [];
  } catch (error) {
    console.error('Error getting learned tricks:', error);
    return [];
  }
};

// Shop - Pet Slots
export const savePetSlots = async (slots) => {
  try {
    await AsyncStorage.setItem(KEYS.PET_SLOTS, JSON.stringify(slots));
  } catch (error) {
    console.error('Error saving pet slots:', error);
  }
};

export const getPetSlots = async () => {
  try {
    const slots = await AsyncStorage.getItem(KEYS.PET_SLOTS);
    return slots ? JSON.parse(slots) : 1;
  } catch (error) {
    console.error('Error getting pet slots:', error);
    return 1;
  }
};

// Leaderboard
export const saveLeaderboardData = async (data) => {
  try {
    await AsyncStorage.setItem(KEYS.LEADERBOARD_DATA, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving leaderboard data:', error);
  }
};

export const getLeaderboardData = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.LEADERBOARD_DATA);
    return data ? JSON.parse(data) : {
      totalXP: 0,
      weeklyXP: 0,
      currentStreak: 0,
      bestStreak: 0,
      lastActiveDate: null,
      weekStartDate: null,
    };
  } catch (error) {
    console.error('Error getting leaderboard data:', error);
    return {
      totalXP: 0,
      weeklyXP: 0,
      currentStreak: 0,
      bestStreak: 0,
      lastActiveDate: null,
      weekStartDate: null,
    };
  }
};

export const updateLeaderboardStats = async (xpGained) => {
  try {
    const data = await getLeaderboardData();
    const today = getTodayKey();
    const now = new Date();
    const currentWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const weekStartKey = currentWeekStart.toISOString().split('T')[0];

    if (!data.weekStartDate || data.weekStartDate !== weekStartKey) {
      data.weeklyXP = 0;
      data.weekStartDate = weekStartKey;
    }

    data.totalXP += xpGained;
    data.weeklyXP += xpGained;

    if (data.lastActiveDate === today) {
    } else {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = yesterday.toISOString().split('T')[0];

      if (data.lastActiveDate === yesterdayKey) {
        data.currentStreak += 1;
      } else if (data.lastActiveDate !== today) {
        data.currentStreak = 1;
      }

      data.bestStreak = Math.max(data.bestStreak, data.currentStreak);
      data.lastActiveDate = today;
    }

    await saveLeaderboardData(data);
    return data;
  } catch (error) {
    console.error('Error updating leaderboard stats:', error);
  }
};

export const saveProfileData = async (profileData) => {
  try {
    await AsyncStorage.setItem(KEYS.PROFILE_DATA, JSON.stringify(profileData));
  } catch (error) {
    console.error('Error saving profile data:', error);
  }
};

export const getProfileData = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.PROFILE_DATA);
    return data ? JSON.parse(data) : {
      displayName: '',
      bio: '',
      phoneNumber: '',
      photoURL: null,
      socialMedia: {
        instagram: '',
        twitter: '',
        facebook: '',
      },
    };
  } catch (error) {
    console.error('Error getting profile data:', error);
    return {
      displayName: '',
      bio: '',
      phoneNumber: '',
      photoURL: null,
      socialMedia: {
        instagram: '',
        twitter: '',
        facebook: '',
      },
    };
  }
};
