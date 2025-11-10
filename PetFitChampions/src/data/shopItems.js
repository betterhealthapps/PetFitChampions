export const COSMETICS = {
  hats: [
    { id: 'hat_party', name: 'Party Hat', cost: 50, icon: '🎩', rarity: 'common' },
    { id: 'hat_crown', name: 'Royal Crown', cost: 150, icon: '👑', rarity: 'rare' },
    { id: 'hat_wizard', name: 'Wizard Hat', cost: 100, icon: '🧙', rarity: 'uncommon' },
    { id: 'hat_halo', name: 'Halo', cost: 200, icon: '😇', rarity: 'epic' },
  ],
  accessories: [
    { id: 'acc_bow', name: 'Bow Tie', cost: 75, icon: '🎀', rarity: 'common' },
    { id: 'acc_glasses', name: 'Cool Glasses', cost: 80, icon: '😎', rarity: 'common' },
    { id: 'acc_scarf', name: 'Winter Scarf', cost: 90, icon: '🧣', rarity: 'uncommon' },
    { id: 'acc_medal', name: 'Gold Medal', cost: 175, icon: '🥇', rarity: 'rare' },
  ],
  skins: [
    { id: 'skin_glow', name: 'Glowing Aura', cost: 150, icon: '✨', rarity: 'rare' },
    { id: 'skin_rainbow', name: 'Rainbow Fur', cost: 200, icon: '🌈', rarity: 'epic' },
    { id: 'skin_galaxy', name: 'Galaxy Coat', cost: 250, icon: '🌌', rarity: 'epic' },
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
};
