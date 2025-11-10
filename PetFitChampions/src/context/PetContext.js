import React, { createContext, useState, useEffect } from 'react';
import { savePet, getPet, saveGems, getGems } from '../utils/storage';
import { getDefaultPet } from '../data/petTemplates';
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
    let petData = await getPet();
    const gemsData = await getGems();
    
    // If no pet exists, create default pet (Vigor)
    if (!petData) {
      petData = getDefaultPet();
      await savePet(petData);
    }
    
    setPet(petData);
    setGems(gemsData);
    setLoading(false);
  };

  // Add XP to pet and handle level ups
  const addXP = async (xpAmount) => {
    if (!pet) return null;

    const oldTotalXP = pet.xp || 0;
    const newTotalXP = oldTotalXP + xpAmount;
    
    // Check for level up
    const levelUpResult = processLevelUp(oldTotalXP, newTotalXP);
    
    // Update pet
    const updatedPet = {
      ...pet,
      xp: newTotalXP,
      level: levelUpResult.newLevel,
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

  const value = {
    pet,
    gems,
    loading,
    addXP,
    getLevelProgress,
    spendGems,
  };

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
};
