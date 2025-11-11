import React, { createContext, useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc, increment } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { createPetFromTemplate, STARTER_PETS } from '../data/petTemplates';
import { getLevelFromXP, getXPProgressInLevel, processLevelUp } from '../utils/xpCalculations';

export const PetContext = createContext();

export const PetProvider = ({ children }) => {
  const [pet, setPet] = useState(null);
  const [gems, setGems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadPetData(currentUser.uid);
      } else {
        setPet(null);
        setGems(0);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Load pet and gems from Firebase
  const loadPetData = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        
        // Get active pet
        const activePetIndex = data.activePetIndex || 0;
        const pets = data.pets || [];
        
        if (pets.length > 0) {
          const activePet = pets[activePetIndex];
          
          // Ensure tier is a number
          if (activePet && activePet.evolutionTier) {
            activePet.tier = Number(activePet.evolutionTier);
          }
          
          setPet(activePet);
        } else {
          setPet(null);
        }
        
        setGems(data.gems || 0);
      } else {
        // New user - initialize Firebase document
        await setDoc(userRef, {
          email: auth.currentUser.email,
          gems: 0,
          pets: [],
          activePetIndex: 0,
          petSlots: 1,
          energy: 100,
          totalXP: 0,
          createdAt: new Date(),
        });
        
        setPet(null);
        setGems(0);
      }
    } catch (error) {
      console.error('Error loading pet data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Select a starter pet
  const selectPet = async (petId) => {
    try {
      if (!auth.currentUser) {
        throw new Error('No user logged in');
      }

      console.log('Selecting pet:', petId);

      // Get pet template
      const petTemplate = STARTER_PETS[petId.toUpperCase()];
      
      if (!petTemplate) {
        throw new Error('Invalid pet template: ' + petId);
      }

      // Create new pet from template
      const newPet = createPetFromTemplate(petId);
      
      // Ensure proper structure
      const petData = {
        id: petId.toLowerCase(),
        name: newPet.name || petTemplate.name,
        icon: newPet.emoji || petTemplate.emoji,
        type: newPet.type || petTemplate.type,
        level: 1,
        currentXP: 0,
        xp: 0,
        evolutionTier: 1,
        tier: 1,
        baseStats: newPet.stats || petTemplate.baseStats,
        stats: newPet.stats || petTemplate.baseStats,
        cosmetics: {
          hat: null,
          accessory: null,
          skin: null,
        },
        ownedCosmetics: [],
        learnedTricks: [],
        learnedTraits: [],
        emotionalBond: 0,
        lastFed: null,
        lastPetted: null,
      };

      console.log('Created pet data:', petData);

      // Save to Firebase
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        pets: [petData],
        activePetIndex: 0,
      });

      setPet(petData);
      
      console.log('Pet saved successfully');
      return petData;

    } catch (error) {
      console.error('Error selecting pet:', error);
      throw error;
    }
  };

  // Calculate stat increase for level up
  const increaseStats = (currentStats, levelsGained) => {
    const statIncrease = 2;
    const newStats = { ...currentStats };
    
    Object.keys(newStats).forEach((stat) => {
      newStats[stat] = currentStats[stat] + (statIncrease * levelsGained);
    });
    
    return newStats;
  };

  // Add XP to pet and handle level ups
  const addXP = async (xpAmount) => {
    if (!pet || !auth.currentUser) return null;

    try {
      const oldTotalXP = pet.xp || 0;
      const newTotalXP = oldTotalXP + xpAmount;
      
      const oldLevel = pet.level || 1;
      
      // Check for level up
      const levelUpResult = processLevelUp(oldTotalXP, newTotalXP);
      
      // Calculate new stats if leveled up
      let newStats = pet.stats || pet.baseStats;
      if (levelUpResult.leveledUp) {
        const levelsGained = levelUpResult.newLevel - oldLevel;
        newStats = increaseStats(newStats, levelsGained);
      }
      
      // Update pet locally
      const updatedPet = {
        ...pet,
        xp: newTotalXP,
        currentXP: newTotalXP,
        level: levelUpResult.newLevel,
        stats: newStats,
        baseStats: newStats,
      };
      
      setPet(updatedPet);

      // Update in Firebase
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      const data = userDoc.data();
      
      const activePetIndex = data.activePetIndex || 0;
      const pets = [...(data.pets || [])];
      pets[activePetIndex] = updatedPet;

      await updateDoc(userRef, {
        pets: pets,
        totalXP: increment(xpAmount),
      });
      
      // Award gems if leveled up
      if (levelUpResult.leveledUp && levelUpResult.gemsEarned > 0) {
        await addGems(levelUpResult.gemsEarned);
      }
      
      return {
        ...levelUpResult,
        newXP: newTotalXP,
        xpGained: xpAmount,
      };
    } catch (error) {
      console.error('Error adding XP:', error);
      return null;
    }
  };

  // Get current level progress
  const getLevelProgress = () => {
    if (!pet) return { current: 0, needed: 1000, percentage: 0 };
    return getXPProgressInLevel(pet.xp || 0, pet.level || 1);
  };

  // Spend gems
  const spendGems = async (amount) => {
    if (!auth.currentUser) throw new Error('Not logged in');
    if (gems < amount) throw new Error('Not enough gems');
    
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        gems: increment(-amount),
      });
      
      const newGems = gems - amount;
      setGems(newGems);
      return newGems;
    } catch (error) {
      console.error('Error spending gems:', error);
      throw error;
    }
  };

  // Add gems
  const addGems = async (amount) => {
    if (!auth.currentUser) return;
    
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        gems: increment(amount),
      });
      
      const newGems = gems + amount;
      setGems(newGems);
      return newGems;
    } catch (error) {
      console.error('Error adding gems:', error);
      return gems;
    }
  };

  // Evolve pet to next tier
  const evolvePet = async (tierCost) => {
    if (!pet || !auth.currentUser) return null;
    if (gems < tierCost) throw new Error('Not enough gems');
    
    try {
      const currentTier = Number(pet.tier || pet.evolutionTier) || 1;
      const newTier = currentTier + 1;
      
      if (newTier > 3) {
        throw new Error('Already at max tier');
      }
      
      // Boost stats on evolution (50% increase)
      const evolvedStats = {};
      const stats = pet.stats || pet.baseStats || {};
      Object.keys(stats).forEach((stat) => {
        evolvedStats[stat] = Math.floor(stats[stat] * 1.5);
      });
      
      // Update pet
      const evolvedPet = {
        ...pet,
        tier: newTier,
        evolutionTier: newTier,
        stats: evolvedStats,
        baseStats: evolvedStats,
      };
      
      setPet(evolvedPet);

      // Update in Firebase
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      const data = userDoc.data();
      
      const activePetIndex = data.activePetIndex || 0;
      const pets = [...(data.pets || [])];
      pets[activePetIndex] = evolvedPet;

      await updateDoc(userRef, {
        pets: pets,
        gems: increment(-tierCost),
      });
      
      await spendGems(tierCost);
      
      return evolvedPet;
    } catch (error) {
      console.error('Error evolving pet:', error);
      throw error;
    }
  };

  // Update pet
  const updatePet = async (updatedPet) => {
    if (!auth.currentUser) return;
    
    try {
      setPet(updatedPet);

      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      const data = userDoc.data();
      
      const activePetIndex = data.activePetIndex || 0;
      const pets = [...(data.pets || [])];
      pets[activePetIndex] = updatedPet;

      await updateDoc(userRef, {
        pets: pets,
      });
    } catch (error) {
      console.error('Error updating pet:', error);
    }
  };

  const value = {
    pet,
    currentPet: pet,
    gems,
    loading,
    user,
    selectPet,
    addXP,
    getLevelProgress,
    spendGems,
    addGems,
    setGems,
    evolvePet,
    updatePet,
    loadPetData,
  };

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
};
