export const COSMETICS = {
  hats: [
    {
      id: 'hat_party',
      name: 'Party Hat',
      cost: 50,
      icon: '🎩',
      rarity: 'common',
      statBoosts: { energy: 2 },
      description: '+2 Energy - Perfect for celebrations!',
      position: { top: -30, left: 5 },
    },
    {
      id: 'hat_crown',
      name: 'Royal Crown',
      cost: 150,
      icon: '👑',
      rarity: 'rare',
      statBoosts: { defense: 3, health: 2 },
      description: '+3 Defense, +2 Health - Fit for royalty!',
      position: { top: -35, left: 0 },
    },
    {
      id: 'hat_wizard',
      name: 'Wizard Hat',
      cost: 100,
      icon: '🧙',
      rarity: 'uncommon',
      statBoosts: { energy: 3, agility: 1 },
      description: '+3 Energy, +1 Agility - Magical powers!',
      position: { top: -40, left: -5 },
    },
    {
      id: 'hat_halo',
      name: 'Halo',
      cost: 200,
      icon: '😇',
      rarity: 'epic',
      statBoosts: { health: 5, defense: 2 },
      description: '+5 Health, +2 Defense - Divine protection!',
      position: { top: -45, left: 0 },
    },
    {
      id: 'hat_ninja',
      name: 'Ninja Headband',
      cost: 120,
      icon: '🥷',
      rarity: 'rare',
      statBoosts: { agility: 4, attack: 2 },
      description: '+4 Agility, +2 Attack - Silent but deadly!',
      position: { top: -25, left: 0 },
    },
  ],
  accessories: [
    {
      id: 'acc_bow',
      name: 'Bow Tie',
      cost: 75,
      icon: '🎀',
      rarity: 'common',
      statBoosts: { stamina: 2 },
      description: '+2 Stamina - Classy and comfortable!',
      position: { top: 40, left: 10 },
    },
    {
      id: 'acc_glasses',
      name: 'Cool Glasses',
      cost: 80,
      icon: '😎',
      rarity: 'common',
      statBoosts: { agility: 2, attack: 1 },
      description: '+2 Agility, +1 Attack - Look sharp, move fast!',
      position: { top: 15, left: 8 },
    },
    {
      id: 'acc_scarf',
      name: 'Winter Scarf',
      cost: 90,
      icon: '🧣',
      rarity: 'uncommon',
      statBoosts: { defense: 3, stamina: 2 },
      description: '+3 Defense, +2 Stamina - Warm and cozy!',
      position: { top: 35, left: 5 },
    },
    {
      id: 'acc_medal',
      name: 'Gold Medal',
      cost: 175,
      icon: '🥇',
      rarity: 'rare',
      statBoosts: { strength: 3, attack: 3 },
      description: '+3 Strength, +3 Attack - Champion power!',
      position: { top: 45, left: 15 },
    },
    {
      id: 'acc_necklace',
      name: 'Power Necklace',
      cost: 130,
      icon: '📿',
      rarity: 'uncommon',
      statBoosts: { energy: 3, health: 2 },
      description: '+3 Energy, +2 Health - Mystical energy!',
      position: { top: 42, left: 12 },
    },
  ],
  skins: [
    {
      id: 'skin_glow',
      name: 'Glowing Aura',
      cost: 150,
      icon: '✨',
      rarity: 'rare',
      statBoosts: { energy: 4, agility: 2 },
      description: '+4 Energy, +2 Agility - Radiant power!',
      isFullBody: true,
    },
    {
      id: 'skin_rainbow',
      name: 'Rainbow Fur',
      cost: 200,
      icon: '🌈',
      rarity: 'epic',
      statBoosts: { health: 3, strength: 3, agility: 2 },
      description: '+3 Health, +3 Strength, +2 Agility - All colors of power!',
      isFullBody: true,
    },
    {
      id: 'skin_galaxy',
      name: 'Galaxy Pattern',
      cost: 180,
      icon: '🌌',
      rarity: 'epic',
      statBoosts: { energy: 5, defense: 3 },
      description: '+5 Energy, +3 Defense - Cosmic protection!',
      isFullBody: true,
    },
    {
      id: 'skin_fire',
      name: 'Flame Aura',
      cost: 190,
      icon: '🔥',
      rarity: 'epic',
      statBoosts: { attack: 5, strength: 3 },
      description: '+5 Attack, +3 Strength - Burn bright!',
      isFullBody: true,
    },
    {
      id: 'skin_ice',
      name: 'Frost Armor',
      cost: 185,
      icon: '❄️',
      rarity: 'epic',
      statBoosts: { defense: 5, health: 3 },
      description: '+5 Defense, +3 Health - Cold as ice!',
      isFullBody: true,
    },
  ],
};

export const STAT_BOOSTS = [
  { id: 'boost_health', name: 'Health +5', stat: 'health', cost: 300, icon: '❤️' },
  { id: 'boost_strength', name: 'Strength +5', stat: 'strength', cost: 300, icon: '💪' },
  { id: 'boost_defense', name: 'Defense +5', stat: 'defense', cost: 300, icon: '🛡️' },
  { id: 'boost_agility', name: 'Agility +5', stat: 'agility', cost: 300, icon: '⚡' },
  { id: 'boost_stamina', name: 'Stamina +5', stat: 'stamina', cost: 300, icon: '🏃' },
  { id: 'boost_attack', name: 'Attack +5', stat: 'attack', cost: 300, icon: '⚔️' },
  { id: 'boost_energy', name: 'Energy +5', stat: 'energy', cost: 300, icon: '💫' },
];

export const BATTLE_TRICKS = [
  {
    id: 'trick_quick_strike',
    name: 'Quick Strike',
    cost: 100,
    icon: '💨',
    description: 'Fast attack with 20% bonus damage',
    unlockLevel: 5,
  },
  {
    id: 'trick_power_slam',
    name: 'Power Slam',
    cost: 200,
    icon: '💥',
    description: 'Heavy attack, 50% bonus but 30% accuracy',
    unlockLevel: 10,
  },
  {
    id: 'trick_heal',
    name: 'Rejuvenate',
    cost: 250,
    icon: '💚',
    description: 'Restore 20% HP instead of attacking',
    unlockLevel: 15,
  },
  {
    id: 'trick_counter_stance',
    name: 'Counter Stance',
    cost: 300,
    icon: '🔄',
    description: 'Reflect 50% of damage taken this turn',
    unlockLevel: 20,
  },
];

export const PET_SLOT_ITEM = {
  id: 'pet_slot',
  name: 'Additional Pet Slot',
  cost: 500,
  icon: '🐾',
  description: 'Unlock a slot to train another pet (Max 3 total)',
  maxSlots: 3,
};

export const RARITY_COLORS = {
  common: '#9E9E9E',
  uncommon: '#4CAF50',
  rare: '#2196F3',
  epic: '#9C27B0',
  legendary: '#FF9800',
};

export const getRarityColor = (rarity) => {
  return RARITY_COLORS[rarity] || RARITY_COLORS.common;
};

export const getTotalStatBoosts = (equippedCosmetics) => {
  const totalBoosts = {
    health: 0,
    energy: 0,
    strength: 0,
    defense: 0,
    stamina: 0,
    agility: 0,
    attack: 0,
  };

  Object.values(COSMETICS).flat().forEach(cosmetic => {
    if (equippedCosmetics.includes(cosmetic.id) && cosmetic.statBoosts) {
      Object.keys(cosmetic.statBoosts).forEach(stat => {
        totalBoosts[stat] += cosmetic.statBoosts[stat];
      });
    }
  });

  return totalBoosts;
};
