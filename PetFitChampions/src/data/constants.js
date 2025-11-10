// XP Conversion rates for health activities
export const XP_RATES = {
  STEPS: 200,           // 10k steps = 200 XP
  SLEEP: 150,           // 8hrs sleep = 150 XP
  HEALTHY_MEALS: 150,   // 3 healthy meals = 150 XP
  MEDITATION: 100,      // 10min meditation = 100 XP
  JOURNAL: 100,         // Journal entry = 100 XP
  MOOD_CHECKINS: 150,   // 3 mood check-ins = 150 XP
  BREATHING: 50,        // Breathing exercise = 50 XP
  DAILY_BONUS: 200,     // Complete all daily tasks = +200 bonus XP
};

// Leveling system thresholds
export const LEVEL_XP_REQUIREMENTS = (level) => {
  if (level <= 10) return 1000;
  if (level <= 25) return 1500;
  return 2500;
};

// Evolution tiers
export const EVOLUTION_TIERS = {
  TIER_1: { minLevel: 1, maxLevel: 15, name: 'Basic' },
  TIER_2: { minLevel: 16, maxLevel: 35, name: 'Advanced', cost: 150 },
  TIER_3: { minLevel: 36, maxLevel: 60, name: 'Master', cost: 500 },
};

// Mood emojis
export const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😠', label: 'Angry' },
  { emoji: '😴', label: 'Tired' },
];

// Meal quality options
export const MEAL_QUALITY = {
  HEALTHY: 'healthy',
  OK: 'ok',
  UNHEALTHY: 'unhealthy',
};

// Activity types for tracking
export const ACTIVITY_TYPES = {
  STEPS: 'steps',
  SLEEP: 'sleep',
  MOOD: 'mood',
  MEDITATION: 'meditation',
  JOURNAL: 'journal',
  WATER: 'water',
  MEALS: 'meals',
  BREATHING: 'breathing',
};
