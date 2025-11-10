// Starter pet templates
export const STARTER_PETS = {
  VIGOR: {
    id: 'vigor',
    name: 'Vigor',
    type: 'Dog',
    emoji: '🐕',
    description: 'A loyal companion with incredible endurance',
    baseStats: {
      health: 80,
      energy: 70,
      strength: 65,
      defense: 60,
      stamina: 90,  // High Stamina
      agility: 55,
      attack: 70,
    },
  },
  ZEN: {
    id: 'zen',
    name: 'Zen',
    type: 'Cat',
    emoji: '🐱',
    description: 'A graceful feline with lightning-fast reflexes',
    baseStats: {
      health: 70,
      energy: 75,
      strength: 55,
      defense: 50,
      stamina: 60,
      agility: 95,  // High Agility
      attack: 65,
    },
  },
  ATLAS: {
    id: 'atlas',
    name: 'Atlas',
    type: 'Bear',
    emoji: '🐻',
    description: 'A powerful guardian with unmatched strength',
    baseStats: {
      health: 100,
      energy: 65,
      strength: 95,  // High Strength
      defense: 90,   // High Defense
      stamina: 70,
      agility: 45,
      attack: 85,
    },
  },
  SWIFT: {
    id: 'swift',
    name: 'Swift',
    type: 'Bird',
    emoji: '🦅',
    description: 'A soaring spirit with boundless energy',
    baseStats: {
      health: 65,
      energy: 95,   // High Energy
      strength: 50,
      defense: 45,
      stamina: 75,
      agility: 85,
      attack: 60,
    },
  },
};

// Get default starter pet (Vigor for MVP)
export const getDefaultPet = () => ({
  ...STARTER_PETS.VIGOR,
  level: 1,
  xp: 0,
  tier: 1,
  stats: { ...STARTER_PETS.VIGOR.baseStats },
});
