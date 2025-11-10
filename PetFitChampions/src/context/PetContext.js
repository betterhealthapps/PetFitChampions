import React, { createContext, useState, useEffect } from 'react';
import { savePet, getPet, saveGems, getGems } from '../utils/storage';
import { createPetFromTemplate } from '../data/petTemplates';
import { getLevelFromXP, getXPProgressInLevel, processLevelUp } from '../utils/xpCalculations';

export const PetContext = createContext();

export const PetProvider = ({ children }) => {
  const [pet, setPet] = useState(null);
  const [gems, setGems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load pet and gems on app start
  useEffect(() => {
    loadPetData();
  }, []);

  const loadPetData = async () => {
    const petData = await getPet();
    const gemsData = await getGems();
    
    // Don't create default pet - let user select from PetSelectionScreen
    setPet(petData);
    setGems(gemsData);
    setLoading(false);
  };

  // Select a starter pet
  const selectPet = async (petId) => {
    const newPet = createPetFromTemplate(petId);
    setPet(newPet);
    await savePet(newPet);
    return newPet;
  };

  // Calculate stat increase for level up
  const increaseStats = (currentStats, levelsGained) => {
    const statIncrease = 2; // Each stat increases by 2 per level
    const newStats = { ...currentStats };
    
    Object.keys(newStats).forEach((stat) => {
      newStats[stat] = currentStats[stat] + (statIncrease * levelsGained);
    });
    
    return newStats;
  };

  // Add XP to pet and handle level ups
  const addXP = async (xpAmount) => {
    if (!pet) return null;

    const oldTotalXP = pet.xp || 0;
    const newTotalXP = oldTotalXP + xpAmount;
    
    const oldLevel = pet.level || 1;
    
    // Check for level up
    const levelUpResult = processLevelUp(oldTotalXP, newTotalXP);
    
    // Calculate new stats if leveled up
    let newStats = pet.stats;
    if (levelUpResult.leveledUp) {
      const levelsGained = levelUpResult.newLevel - oldLevel;
      newStats = increaseStats(pet.stats, levelsGained);
    }
    
    // Update pet
    const updatedPet = {
      ...pet,
      xp: newTotalXP,
      level: levelUpResult.newLevel,
      stats: newStats,
    };
    
    setPet(updatedPet);
    await savePet(updatedPet);
    
    // Award gems if leveled up
    if (levelUpResult.leveledUp && levelUpResult.gemsEarned > 0) {
      const newGems = gems + levelUpResult.gemsEarned;
      setGems(newGems);
      await saveGems(newGems);
    }
    
    return {
      ...levelUpResult,
      newXP: newTotalXP,
      xpGained: xpAmount,
    };
  };

  // Get current level progress
  const getLevelProgress = () => {
    if (!pet) return { current: 0, needed: 1000, percentage: 0 };
    return getXPProgressInLevel(pet.xp || 0, pet.level || 1);
  };

  // Spend gems
  const spendGems = async (amount) => {
    if (gems < amount) {
      throw new Error('Not enough gems');
    }
    
    const newGems = gems - amount;
    setGems(newGems);
    await saveGems(newGems);
    return newGems;
  };

  // Evolve pet to next tier
  const evolvePet = async (tierCost) => {
    if (!pet) return null;
    if (gems < tierCost) {
      throw new Error('Not enough gems');
    }
    
    const newTier = (pet.tier || 1) + 1;
    if (newTier > 3) {
      throw new Error('Already at max tier');
    }
    
    // Deduct gems
    const newGems = gems - tierCost;
    setGems(newGems);
    await saveGems(newGems);
    
    // Boost stats on evolution (50% increase)
    const evolvedStats = {};
    Object.keys(pet.stats).forEach((stat) => {
      evolvedStats[stat] = Math.floor(pet.stats[stat] * 1.5);
    });
    
    // Update pet
    const evolvedPet = {
      ...pet,
      tier: newTier,
      stats: evolvedStats,
    };
    
    setPet(evolvedPet);
    await savePet(evolvedPet);
    
    return evolvedPet;
  };

  const value = {
    pet,
    gems,
    loading,
    selectPet,
    addXP,
    getLevelProgress,
    spendGems,
    evolvePet,
  };

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
};
