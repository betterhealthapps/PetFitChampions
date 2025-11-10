// Starter pet templates
export const STARTER_PETS = {
  VIGOR: {
    id: 'vigor',
    name: 'Vigor',
    type: 'Dog',
    category: 'land',
    emoji: '🐕',
    runningIcon: '🐕‍🦺',
    jumpingIcon: '🐕',
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
    runnerAbility: {
      name: 'Sprint Burst',
      description: 'Temporary speed boost when jumping',
      effect: 'speedOnJump',
    },
  },
  ZEN: {
    id: 'zen',
    name: 'Zen',
    type: 'Cat',
    category: 'land',
    emoji: '🐱',
    runningIcon: '🐈',
    jumpingIcon: '🐱',
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
    runnerAbility: {
      name: 'Nine Lives',
      description: 'Extra chance to survive a hit',
      effect: 'extraLife',
    },
  },
  ATLAS: {
    id: 'atlas',
    name: 'Atlas',
    type: 'Bear',
    category: 'land',
    emoji: '🐻',
    runningIcon: '🐻‍❄️',
    jumpingIcon: '🐻',
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
    runnerAbility: {
      name: 'Tough Hide',
      description: 'Destroys small obstacles on contact',
      effect: 'destroyObstacles',
    },
  },
  SWIFT: {
    id: 'swift',
    name: 'Swift',
    type: 'Bird',
    category: 'flying',
    emoji: '🦅',
    flyingIcon: '🦚',
    glidingIcon: '🕊️',
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
    runnerAbility: {
      name: 'Glide',
      description: 'Tap to flap, release to glide',
      effect: 'flappyControl',
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

// Create a new pet from template by ID
export const createPetFromTemplate = (petId) => {
  const petKey = petId.toUpperCase();
  const template = STARTER_PETS[petKey];
  
  if (!template) {
    throw new Error(`Pet template not found: ${petId}`);
  }
  
  return {
    ...template,
    level: 1,
    xp: 0,
    tier: 1,
    stats: { ...template.baseStats },
  };
};
