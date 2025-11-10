import React, { createContext, useState, useEffect } from 'react';
import { saveHealthLogs, getHealthLogs, getTodayKey } from '../utils/storage';
import {
  calculateStepsXP,
  calculateSleepXP,
  calculateMeditationXP,
  calculateMealsXP,
  calculateMoodXP,
  getJournalXP,
  getBreathingXP,
} from '../utils/xpCalculations';

export const HealthContext = createContext();

export const HealthProvider = ({ children }) => {
  const [healthLogs, setHealthLogs] = useState({});
  const [todayLog, setTodayLog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load health logs on app start
  useEffect(() => {
    loadHealthLogs();
  }, []);

  const loadHealthLogs = async () => {
    const logs = await getHealthLogs();
    const today = getTodayKey();
    
    // Initialize today's log if it doesn't exist
    if (!logs[today]) {
      logs[today] = {
        date: today,
        steps: 0,
        sleepHours: 0,
        waterGlasses: 0,
        moodCheckIns: [],
        meals: [],
        meditationMinutes: 0,
        hasJournal: false,
        breathingExercises: 0,
      };
    }
    
    setHealthLogs(logs);
    setTodayLog(logs[today]);
    setLoading(false);
  };

  // Update a specific health activity for today
  const updateActivity = async (activityType, value) => {
    let currentTodayLog = todayLog;
    let currentHealthLogs = healthLogs;
    
    if (!currentTodayLog) {
      await loadHealthLogs();
      const logs = await getHealthLogs();
      const today = getTodayKey();
      
      if (!logs[today]) {
        logs[today] = {
          date: today,
          steps: 0,
          sleepHours: 0,
          waterGlasses: 0,
          moodCheckIns: [],
          meals: [],
          meditationMinutes: 0,
          hasJournal: false,
          breathingExercises: 0,
        };
      }
      
      currentTodayLog = logs[today];
      currentHealthLogs = logs;
    }
    
    const today = getTodayKey();
    const updatedLog = {
      ...currentTodayLog,
      [activityType]: value,
    };
    
    const updatedLogs = {
      ...currentHealthLogs,
      [today]: updatedLog,
    };
    
    setHealthLogs(updatedLogs);
    setTodayLog(updatedLog);
    await saveHealthLogs(updatedLogs);
    
    return updatedLog;
  };

  // Check if all daily activities are completed
  const checkAllActivitiesCompleted = () => {
    if (!todayLog) return false;
    
    const hasSteps = todayLog.steps >= 10000;
    const hasSleep = todayLog.sleepHours >= 8;
    const hasWater = todayLog.waterGlasses >= 8;
    const hasMoodCheckIns = todayLog.moodCheckIns && todayLog.moodCheckIns.length >= 3;
    const hasHealthyMeals = todayLog.meals && todayLog.meals.filter(m => m === 'healthy').length >= 3;
    const hasMeditation = todayLog.meditationMinutes >= 10;
    const hasJournal = todayLog.hasJournal === true;
    const hasBreathing = todayLog.breathingExercises >= 1;
    
    return (
      hasSteps &&
      hasSleep &&
      hasWater &&
      hasMoodCheckIns &&
      hasHealthyMeals &&
      hasMeditation &&
      hasJournal &&
      hasBreathing
    );
  };

  // Calculate total XP earned today
  const getTodayXP = () => {
    if (!todayLog) return 0;
    
    let totalXP = 0;
    
    // Steps XP
    totalXP += calculateStepsXP(todayLog.steps || 0);
    
    // Sleep XP
    totalXP += calculateSleepXP(todayLog.sleepHours || 0);
    
    // Meditation XP
    totalXP += calculateMeditationXP(todayLog.meditationMinutes || 0);
    
    // Meals XP (count healthy meals)
    const healthyMealCount = (todayLog.meals || []).filter(m => m === 'healthy').length;
    totalXP += calculateMealsXP(healthyMealCount);
    
    // Mood check-ins XP
    totalXP += calculateMoodXP((todayLog.moodCheckIns || []).length);
    
    // Journal XP
    if (todayLog.hasJournal) {
      totalXP += getJournalXP();
    }
    
    // Breathing exercises XP
    totalXP += getBreathingXP() * (todayLog.breathingExercises || 0);
    
    // Daily bonus for completing all activities
    if (checkAllActivitiesCompleted()) {
      totalXP += 200;
    }
    
    return totalXP;
  };

  // Get count of completed activities today
  const getTodayActivityCount = () => {
    if (!todayLog) return 0;
    
    let count = 0;
    if (todayLog.steps > 0) count++;
    if (todayLog.sleepHours > 0) count++;
    if (todayLog.waterGlasses > 0) count++;
    if (todayLog.moodCheckIns && todayLog.moodCheckIns.length > 0) count++;
    if (todayLog.meals && todayLog.meals.length > 0) count++;
    if (todayLog.meditationMinutes > 0) count++;
    if (todayLog.hasJournal) count++;
    if (todayLog.breathingExercises > 0) count++;
    
    return count;
  };

  const value = {
    healthLogs,
    todayLog,
    loading,
    updateActivity,
    getTodayXP,
    getTodayActivityCount,
  };

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
};
