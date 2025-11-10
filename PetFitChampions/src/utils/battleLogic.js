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
