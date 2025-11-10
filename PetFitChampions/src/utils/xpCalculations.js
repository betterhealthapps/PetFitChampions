import { XP_RATES, LEVEL_XP_REQUIREMENTS } from '../data/constants';

// Calculate XP from steps (10k steps = 200 XP, proportional)
export const calculateStepsXP = (steps) => {
  return Math.floor((steps / 10000) * XP_RATES.STEPS);
};

// Calculate XP from sleep hours (8hrs = 150 XP, proportional)
export const calculateSleepXP = (hours) => {
  return Math.floor((hours / 8) * XP_RATES.SLEEP);
};

// Calculate XP from meditation minutes (10min = 100 XP, proportional)
export const calculateMeditationXP = (minutes) => {
  return Math.floor((minutes / 10) * XP_RATES.MEDITATION);
};

// Calculate XP from meals (3 healthy meals = 150 XP)
export const calculateMealsXP = (healthyMealCount) => {
  return Math.floor((healthyMealCount / 3) * XP_RATES.HEALTHY_MEALS);
};

// Calculate XP from mood check-ins (3 check-ins = 150 XP)
export const calculateMoodXP = (checkInCount) => {
  return Math.floor((checkInCount / 3) * XP_RATES.MOOD_CHECKINS);
};

// Fixed XP values
export const getJournalXP = () => XP_RATES.JOURNAL;
export const getBreathingXP = () => XP_RATES.BREATHING;

// Calculate total XP needed for a specific level
export const getXPForLevel = (level) => {
  let totalXP = 0;
  for (let i = 1; i < level; i++) {
    totalXP += LEVEL_XP_REQUIREMENTS(i);
  }
  return totalXP;
};

// Calculate level from total XP
export const getLevelFromXP = (totalXP) => {
  let level = 1;
  let xpNeeded = 0;
  
  while (xpNeeded <= totalXP) {
    xpNeeded += LEVEL_XP_REQUIREMENTS(level);
    if (xpNeeded <= totalXP) {
      level++;
    }
  }
  
  return level;
};

// Calculate XP progress within current level
export const getXPProgressInLevel = (totalXP, currentLevel) => {
  const xpForCurrentLevel = getXPForLevel(currentLevel);
  const currentLevelXP = totalXP - xpForCurrentLevel;
  const xpNeededForNext = LEVEL_XP_REQUIREMENTS(currentLevel);
  
  return {
    current: currentLevelXP,
    needed: xpNeededForNext,
    percentage: (currentLevelXP / xpNeededForNext) * 100,
  };
};

// Check if leveling up and calculate gem rewards
export const processLevelUp = (oldXP, newXP) => {
  const oldLevel = getLevelFromXP(oldXP);
  const newLevel = getLevelFromXP(newXP);
  
  if (newLevel > oldLevel) {
    const gemsEarned = newLevel; // Gems = current level number
    return {
      leveledUp: true,
      newLevel,
      gemsEarned,
    };
  }
  
  return {
    leveledUp: false,
    newLevel: oldLevel,
    gemsEarned: 0,
  };
};
