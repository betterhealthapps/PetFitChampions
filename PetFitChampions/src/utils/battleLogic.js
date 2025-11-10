import { BATTLE_ACTIONS } from '../data/constants';
import { getAllActiveTraits } from './battleTraits';

export const initializeBattleTraits = (playerPet, opponentPet) => {
  return {
    playerTraits: getAllActiveTraits(playerPet, opponentPet),
    opponentTraits: getAllActiveTraits(opponentPet, playerPet),
  };
};

export const determineTurnOrder = (playerPet, opponentPet, playerTraits, opponentTraits) => {
  if (playerTraits.firstStrike && !opponentTraits.firstStrike) {
    return 'player';
  }
  if (opponentTraits.firstStrike && !playerTraits.firstStrike) {
    return 'opponent';
  }

  if (playerPet.baseStats.agility > opponentPet.baseStats.agility) {
    return 'player';
  }
  if (opponentPet.baseStats.agility > playerPet.baseStats.agility) {
    return 'opponent';
  }

  return Math.random() > 0.5 ? 'player' : 'opponent';
};

export const applyEnduranceHealing = (currentHealth, maxHealth, trait) => {
  if (!trait) return currentHealth;

  const healAmount = Math.floor(maxHealth * (trait.healAmount / 100));
  return Math.min(maxHealth, currentHealth + healAmount);
};

export const checkCounterReflect = (damage, trait) => {
  if (!trait) return 0;

  if (Math.random() < trait.chance) {
    return Math.floor(damage * (trait.reflectAmount / 100));
  }
  return 0;
};

export const checkCriticalHit = (attackerPet, trait) => {
  let baseCritChance = (attackerPet.baseStats.agility / 100) * 0.2;

  if (trait) {
    baseCritChance += trait.chance;
  }

  return Math.random() < baseCritChance;
};

export const calculateDamage = (attacker, defender, action, traits = null) => {
  const baseAttack = attacker.stats.attack || 50;
  const baseStrength = attacker.stats.strength || 50;
  const baseDefense = defender.stats.defense || 50;
  
  let damage = 0;
  
  switch (action) {
    case BATTLE_ACTIONS.ATTACK:
      damage = Math.max(1, Math.floor((baseAttack * 0.8 + baseStrength * 0.2) - baseDefense * 0.3));
      break;
    case BATTLE_ACTIONS.SPECIAL:
      const baseEnergy = attacker.stats.energy || 50;
      damage = Math.max(1, Math.floor((baseAttack * 1.2 + baseEnergy * 0.5) - baseDefense * 0.2));
      break;
    case BATTLE_ACTIONS.DEFEND:
      damage = 0;
      break;
    default:
      damage = Math.max(1, Math.floor(baseAttack - baseDefense * 0.3));
  }
  
  const variance = 0.85 + Math.random() * 0.3;
  damage = Math.max(1, Math.floor(damage * variance));

  if (traits && traits.criticalHit && action !== BATTLE_ACTIONS.DEFEND) {
    const isCrit = checkCriticalHit(attacker, traits.criticalHit);
    if (isCrit) {
      damage = Math.floor(damage * traits.criticalHit.multiplier);
    }
  }

  return damage;
};

export const getDefenseBonus = (action) => {
  return action === BATTLE_ACTIONS.DEFEND ? 0.5 : 1.0;
};

export const generateOpponent = (playerPet) => {
  const levelVariance = Math.floor(Math.random() * 5) - 2;
  const opponentLevel = Math.max(1, (playerPet.level || 1) + levelVariance);
  
  const petTypes = [
    { name: 'Shadow', type: 'cat' },
    { name: 'Thunder', type: 'bird' },
    { name: 'Rocky', type: 'bear' },
    { name: 'Blaze', type: 'dog' },
  ];
  
  const randomPet = petTypes[Math.floor(Math.random() * petTypes.length)];
  
  const baseStats = {
    health: 70 + Math.floor(Math.random() * 30),
    energy: 60 + Math.floor(Math.random() * 35),
    strength: 55 + Math.floor(Math.random() * 40),
    defense: 50 + Math.floor(Math.random() * 40),
    stamina: 60 + Math.floor(Math.random() * 30),
    agility: 50 + Math.floor(Math.random() * 45),
    attack: 60 + Math.floor(Math.random() * 30),
  };
  
  const levelMultiplier = 1 + (opponentLevel - 1) * 0.04;
  const scaledStats = {};
  Object.keys(baseStats).forEach((stat) => {
    scaledStats[stat] = Math.floor(baseStats[stat] * levelMultiplier);
  });
  
  return {
    name: randomPet.name,
    type: randomPet.type,
    level: opponentLevel,
    tier: Math.min(3, Math.floor(opponentLevel / 16) + 1),
    baseStats: scaledStats,
    stats: scaledStats,
    currentHealth: scaledStats.health,
    maxHealth: scaledStats.health,
  };
};

export const getAIAction = (opponentPet, playerPet, opponentHealth, playerHealth) => {
  const healthPercentage = (opponentHealth / opponentPet.maxHealth) * 100;
  
  if (healthPercentage < 30) {
    return Math.random() < 0.6 ? BATTLE_ACTIONS.DEFEND : BATTLE_ACTIONS.SPECIAL;
  }
  
  if (playerHealth < opponentHealth * 0.4) {
    return Math.random() < 0.7 ? BATTLE_ACTIONS.ATTACK : BATTLE_ACTIONS.SPECIAL;
  }
  
  const rand = Math.random();
  if (rand < 0.5) return BATTLE_ACTIONS.ATTACK;
  if (rand < 0.8) return BATTLE_ACTIONS.SPECIAL;
  return BATTLE_ACTIONS.DEFEND;
};

export const createBotOpponent = (difficulty, playerPet) => {
  if (!playerPet || !playerPet.baseStats) {
    throw new Error('Invalid player pet data');
  }

  const difficultyMultipliers = {
    easy: 0.85,
    medium: 1.0,
    hard: 1.15,
  };

  const multiplier = difficultyMultipliers[difficulty] || 1.0;
  const baseLevel = Math.max(1, Math.round((playerPet.level || 1) * multiplier));

  const botNames = [
    'Byte', 'Circuit', 'Pixel', 'Glitch', 'Nano', 'Turbo',
    'Spark', 'Flash', 'Bolt', 'Rocket', 'Blaze', 'Storm'
  ];

  const botTypes = ['fire', 'water', 'earth', 'wind'];
  const randomName = botNames[Math.floor(Math.random() * botNames.length)];
  const randomType = botTypes[Math.floor(Math.random() * botTypes.length)];

  const variance = 0.95 + Math.random() * 0.1;
  
  const baseHealth = Math.round((playerPet.baseStats.health || 80) * multiplier * variance);
  const baseEnergy = Math.round((playerPet.baseStats.energy || 70) * multiplier * variance);
  const baseStrength = Math.round((playerPet.baseStats.strength || 60) * multiplier * variance);
  const baseDefense = Math.round((playerPet.baseStats.defense || 60) * multiplier * variance);
  const baseStamina = Math.round((playerPet.baseStats.stamina || 70) * multiplier * variance);
  const baseAgility = Math.round((playerPet.baseStats.agility || 60) * multiplier * variance);
  const baseAttack = Math.round((playerPet.stats.attack || playerPet.baseStats.attack || 60) * multiplier * variance);

  const botPet = {
    name: `${randomName} Bot`,
    type: randomType,
    level: baseLevel,
    tier: playerPet.tier || 1,
    baseStats: {
      health: baseHealth,
      energy: baseEnergy,
      strength: baseStrength,
      defense: baseDefense,
      stamina: baseStamina,
      agility: baseAgility,
      attack: baseAttack,
    },
    stats: {
      health: baseHealth,
      energy: baseEnergy,
      strength: baseStrength,
      defense: baseDefense,
      stamina: baseStamina,
      agility: baseAgility,
      attack: baseAttack,
    },
    currentHealth: baseHealth,
    maxHealth: baseHealth,
  };

  return botPet;
};

export const checkDodge = (pet) => {
  const dodgeChance = Math.min(0.15, pet.baseStats.agility / 800);
  return Math.random() < dodgeChance;
};

export const getBotAIStrategy = (difficulty, botHealth, playerHealth, turnCount, botTraits = {}) => {
  const botHealthPercent = botHealth;
  const playerHealthPercent = playerHealth;

  if (turnCount === 1 && botHealthPercent < 35) {
    return BATTLE_ACTIONS.DEFEND;
  }

  if (difficulty === 'easy') {
    if (botHealthPercent < 20) {
      return Math.random() > 0.5 ? BATTLE_ACTIONS.DEFEND : BATTLE_ACTIONS.ATTACK;
    }
    return Math.random() > 0.35 ? BATTLE_ACTIONS.ATTACK : BATTLE_ACTIONS.SPECIAL;
  }

  if (difficulty === 'medium') {
    if (botHealthPercent < 30 && playerHealthPercent > 60) {
      return Math.random() > 0.6 ? BATTLE_ACTIONS.DEFEND : BATTLE_ACTIONS.SPECIAL;
    }
    if (playerHealthPercent < 35) {
      return BATTLE_ACTIONS.SPECIAL;
    }
    return Math.random() > 0.45 ? BATTLE_ACTIONS.ATTACK : BATTLE_ACTIONS.SPECIAL;
  }

  if (difficulty === 'hard') {
    if (botTraits.criticalMaster && playerHealthPercent < 50) {
      return BATTLE_ACTIONS.SPECIAL;
    }
    if (botHealthPercent < 30 && playerHealthPercent > 50) {
      return Math.random() > 0.4 ? BATTLE_ACTIONS.DEFEND : BATTLE_ACTIONS.SPECIAL;
    }
    if (playerHealthPercent < 40) {
      return BATTLE_ACTIONS.SPECIAL;
    }
    if (botHealthPercent > 60 && playerHealthPercent > 60) {
      return Math.random() > 0.2 ? BATTLE_ACTIONS.SPECIAL : BATTLE_ACTIONS.ATTACK;
    }
    return Math.random() > 0.35 ? BATTLE_ACTIONS.SPECIAL : BATTLE_ACTIONS.ATTACK;
  }

  return BATTLE_ACTIONS.ATTACK;
};

export const calculateBotRewards = (difficulty, victory) => {
  const rewardTiers = {
    easy: { winGems: [4, 6], loseGems: -1, xp: 25 },
    medium: { winGems: [7, 10], loseGems: -3, xp: 40 },
    hard: { winGems: [11, 14], loseGems: -5, xp: 60 },
  };

  const tier = rewardTiers[difficulty] || rewardTiers.medium;
  
  if (victory) {
    const gems = Math.floor(
      tier.winGems[0] + Math.random() * (tier.winGems[1] - tier.winGems[0] + 1)
    );
    return { gems, xp: tier.xp };
  } else {
    return { gems: tier.loseGems, xp: Math.floor(tier.xp * 0.25) };
  }
};

export const calculateRunnerReward = (score) => {
  if (score < 50) return 5;
  if (score < 100) return 8;
  if (score < 200) return 12;
  if (score < 300) return 15;
  if (score < 500) return 20;
  return 25;
};
