export const BATTLE_TRAITS = {
  firstStrike: {
    id: 'first_strike',
    name: 'First Strike',
    description: 'Attack first if Agility > opponent',
    icon: '⚡',
    requirement: { stat: 'agility', comparison: 'greater', opponent: true },
    effect: 'initiative',
  },
  endurance: {
    id: 'endurance',
    name: 'Endurance',
    description: 'Restore 10% health each turn if Stamina > 70',
    icon: '💪',
    requirement: { stat: 'stamina', value: 70, comparison: 'greater' },
    effect: 'heal_per_turn',
    healAmount: 10,
  },
  counter: {
    id: 'counter',
    name: 'Counter',
    description: '25% chance to reflect damage if Defense > 60',
    icon: '🔄',
    requirement: { stat: 'defense', value: 60, comparison: 'greater' },
    effect: 'damage_reflect',
    chance: 0.25,
    reflectAmount: 50,
  },
  criticalHit: {
    id: 'critical_hit',
    name: 'Critical Master',
    description: '15% chance for double damage if Strength > 80',
    icon: '💥',
    requirement: { stat: 'strength', value: 80, comparison: 'greater' },
    effect: 'crit_boost',
    chance: 0.15,
    multiplier: 2.0,
  },
};

export const checkTraitActive = (pet, trait, opponentPet = null) => {
  const req = trait.requirement;

  if (req.opponent) {
    if (!opponentPet) return false;
    return pet.baseStats[req.stat] > opponentPet.baseStats[req.stat];
  } else {
    return pet.baseStats[req.stat] > req.value;
  }
};

export const getActiveTrait = (pet, traitId, opponentPet = null) => {
  const trait = BATTLE_TRAITS[traitId];
  const isActive = checkTraitActive(pet, trait, opponentPet);
  return isActive ? trait : null;
};

export const getAllActiveTraits = (pet, opponentPet = null) => {
  return {
    firstStrike: getActiveTrait(pet, 'firstStrike', opponentPet),
    endurance: getActiveTrait(pet, 'endurance'),
    counter: getActiveTrait(pet, 'counter'),
    criticalHit: getActiveTrait(pet, 'criticalHit'),
  };
};
