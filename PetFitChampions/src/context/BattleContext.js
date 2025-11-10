import React, { createContext, useState, useEffect } from 'react';
import { saveEnergy, getEnergy, saveLastEnergyUpdate, getLastEnergyUpdate } from '../utils/storage';
import { BATTLE_CONSTANTS } from '../data/constants';

export const BattleContext = createContext();

export const BattleProvider = ({ children }) => {
  const [energy, setEnergy] = useState(BATTLE_CONSTANTS.MAX_ENERGY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnergyData();
    const interval = setInterval(regenerateEnergy, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadEnergyData = async () => {
    const savedEnergy = await getEnergy();
    const lastUpdate = await getLastEnergyUpdate();
    
    let currentEnergy = savedEnergy;
    
    if (lastUpdate) {
      const now = Date.now();
      const minutesPassed = Math.floor((now - lastUpdate) / 60000);
      const energyToAdd = minutesPassed * BATTLE_CONSTANTS.ENERGY_REGEN_RATE;
      currentEnergy = Math.min(savedEnergy + energyToAdd, BATTLE_CONSTANTS.MAX_ENERGY);
    }
    
    setEnergy(currentEnergy);
    await saveEnergy(currentEnergy);
    await saveLastEnergyUpdate(Date.now());
    setLoading(false);
  };

  const regenerateEnergy = async () => {
    setEnergy((prevEnergy) => {
      const newEnergy = Math.min(prevEnergy + BATTLE_CONSTANTS.ENERGY_REGEN_RATE, BATTLE_CONSTANTS.MAX_ENERGY);
      saveEnergy(newEnergy);
      saveLastEnergyUpdate(Date.now());
      return newEnergy;
    });
  };

  const consumeEnergy = async (amount) => {
    if (energy < amount) {
      throw new Error('Not enough energy');
    }
    
    const newEnergy = energy - amount;
    setEnergy(newEnergy);
    await saveEnergy(newEnergy);
    await saveLastEnergyUpdate(Date.now());
    return newEnergy;
  };

  const hasEnoughEnergy = (amount) => {
    return energy >= amount;
  };

  return (
    <BattleContext.Provider
      value={{
        energy,
        loading,
        consumeEnergy,
        hasEnoughEnergy,
        maxEnergy: BATTLE_CONSTANTS.MAX_ENERGY,
      }}
    >
      {children}
    </BattleContext.Provider>
  );
};
