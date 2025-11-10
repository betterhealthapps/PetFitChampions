import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button, IconButton, Chip, Snackbar } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { HealthContext } from '../context/HealthContext';
import { PetContext } from '../context/PetContext';
import { MOOD_OPTIONS, MEAL_QUALITY } from '../data/constants';

export default function TrackScreen() {
  const { todayLog, updateActivity, getTodayXP } = useContext(HealthContext);
  const { addXP } = useContext(PetContext);
  
  const [steps, setSteps] = useState(0);
  const [sleepHours, setSleepHours] = useState(0);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [meditationMinutes, setMeditationMinutes] = useState(0);
  const [meditationTimer, setMeditationTimer] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (todayLog) {
      setSteps(todayLog.steps || 0);
      setSleepHours(todayLog.sleepHours || 0);
      setWaterGlasses(todayLog.waterGlasses || 0);
      setMeditationMinutes(todayLog.meditationMinutes || 0);
    }
  }, [todayLog]);

  const showToast = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleStepsIncrement = async (amount) => {
    const newSteps = Math.max(0, steps + amount);
    setSteps(newSteps);
    await updateActivity('steps', newSteps);
    showToast(`Steps updated: ${newSteps.toLocaleString()}`);
  };

  const handleSleepChange = async (value) => {
    const rounded = Math.round(value * 2) / 2; // Round to nearest 0.5
    setSleepHours(rounded);
    await updateActivity('sleepHours', rounded);
    showToast(`Sleep updated: ${rounded} hours`);
  };

  const handleAddWater = async () => {
    const newCount = waterGlasses + 1;
    setWaterGlasses(newCount);
    await updateActivity('waterGlasses', newCount);
    showToast(`Water logged: ${newCount} glasses`);
  };

  const handleRemoveWater = async () => {
    if (waterGlasses > 0) {
      const newCount = waterGlasses - 1;
      setWaterGlasses(newCount);
      await updateActivity('waterGlasses', newCount);
      showToast(`Water updated: ${newCount} glasses`);
    }
  };

  const handleMoodCheckIn = async (mood) => {
    const currentMoods = todayLog?.moodCheckIns || [];
    const newMoods = [...currentMoods, { emoji: mood.emoji, time: new Date().toISOString() }];
    await updateActivity('moodCheckIns', newMoods);
    showToast(`Mood logged: ${mood.emoji}`);
  };

  const handleLogMeal = async (quality) => {
    const currentMeals = todayLog?.meals || [];
    const newMeals = [...currentMeals, quality];
    await updateActivity('meals', newMeals);
    showToast(`${quality} meal logged!`);
  };

  const startMeditation = () => {
    const timer = setInterval(() => {
      setMeditationMinutes(prev => prev + 1);
    }, 60000); // Increment every minute
    setMeditationTimer(timer);
  };

  const stopMeditation = async () => {
    if (meditationTimer) {
      clearInterval(meditationTimer);
      setMeditationTimer(null);
      await updateActivity('meditationMinutes', meditationMinutes);
      showToast(`${meditationMinutes} minutes of meditation logged!`);
    }
  };

  const handleJournalEntry = async () => {
    await updateActivity('hasJournal', true);
    showToast('Journal entry logged!');
  };

  const handleBreathingExercise = async () => {
    const currentCount = todayLog?.breathingExercises || 0;
    await updateActivity('breathingExercises', currentCount + 1);
    showToast('Breathing exercise completed!');
  };

  const handleClaimXP = async () => {
    const xpToAdd = getTodayXP();
    if (xpToAdd === 0) {
      showToast('Complete some activities first!');
      return;
    }

    const result = await addXP(xpToAdd);
    
    if (result.leveledUp) {
      showToast(`🎉 Level Up! Reached level ${result.newLevel} and earned ${result.gemsEarned} gems!`);
    } else {
      showToast(`+${xpToAdd} XP earned today! 🌟`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.header}>Track Your Health</Title>

        {/* Steps Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>🚶 Steps</Text>
            <View style={styles.stepsContainer}>
              <IconButton 
                icon="minus-circle" 
                size={36}
                onPress={() => handleStepsIncrement(-1000)}
              />
              <View style={styles.stepsDisplay}>
                <Text style={styles.stepsNumber}>{steps.toLocaleString()}</Text>
                <Text style={styles.stepsLabel}>steps</Text>
              </View>
              <IconButton 
                icon="plus-circle" 
                size={36}
                onPress={() => handleStepsIncrement(1000)}
              />
            </View>
            <View style={styles.quickStepsRow}>
              <Button 
                mode="outlined" 
                onPress={() => handleStepsIncrement(-100)}
                compact
              >
                -100
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => handleStepsIncrement(100)}
                compact
              >
                +100
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => handleStepsIncrement(500)}
                compact
              >
                +500
              </Button>
            </View>
            <Text style={styles.targetText}>Target: 10,000 steps = 200 XP</Text>
          </Card.Content>
        </Card>

        {/* Sleep Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>😴 Sleep</Text>
            <Text style={styles.sleepDisplay}>{sleepHours} hours</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={12}
              step={0.5}
              value={sleepHours}
              onValueChange={setSleepHours}
              onSlidingComplete={handleSleepChange}
              minimumTrackTintColor="#6200ee"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#6200ee"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>0h</Text>
              <Text style={styles.sliderLabel}>6h</Text>
              <Text style={styles.sliderLabel}>12h</Text>
            </View>
            <Text style={styles.targetText}>Target: 8 hours = 150 XP</Text>
          </Card.Content>
        </Card>

        {/* Water Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>💧 Water Intake</Text>
            <View style={styles.counterRow}>
              <IconButton 
                icon="minus-circle" 
                size={36}
                onPress={handleRemoveWater} 
              />
              <View style={styles.counterDisplay}>
                <Text style={styles.counterText}>{waterGlasses}</Text>
                <Text style={styles.counterLabel}>glasses</Text>
              </View>
              <IconButton 
                icon="plus-circle" 
                size={36}
                onPress={handleAddWater} 
              />
            </View>
            <Text style={styles.targetText}>Target: 8 glasses (for daily bonus)</Text>
          </Card.Content>
        </Card>

        {/* Mood Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>😊 Mood Check-in</Text>
            <Text style={styles.helperText}>
              Today: {todayLog?.moodCheckIns?.length || 0} check-ins
            </Text>
            <View style={styles.moodRow}>
              {MOOD_OPTIONS.map((mood) => (
                <Button
                  key={mood.label}
                  mode="outlined"
                  onPress={() => handleMoodCheckIn(mood)}
                  style={styles.moodButton}
                >
                  {mood.emoji}
                </Button>
              ))}
            </View>
            <Text style={styles.targetText}>Target: 3 mood check-ins = 150 XP</Text>
          </Card.Content>
        </Card>

        {/* Meals Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>🍽️ Meals</Text>
            <Text style={styles.helperText}>
              Today: {todayLog?.meals?.length || 0} meals logged
            </Text>
            <View style={styles.mealsRow}>
              <Chip 
                icon="check" 
                onPress={() => handleLogMeal(MEAL_QUALITY.HEALTHY)}
                style={styles.chip}
              >
                Healthy
              </Chip>
              <Chip 
                icon="minus" 
                onPress={() => handleLogMeal(MEAL_QUALITY.OK)}
                style={styles.chip}
              >
                OK
              </Chip>
              <Chip 
                icon="close" 
                onPress={() => handleLogMeal(MEAL_QUALITY.UNHEALTHY)}
                style={styles.chip}
              >
                Unhealthy
              </Chip>
            </View>
            <Text style={styles.targetText}>Target: 3 healthy meals = 150 XP</Text>
          </Card.Content>
        </Card>

        {/* Meditation Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>🧘 Meditation</Text>
            <Text style={styles.timerText}>{meditationMinutes} minutes</Text>
            {!meditationTimer ? (
              <Button mode="contained" onPress={startMeditation} icon="play">
                Start Timer
              </Button>
            ) : (
              <Button mode="contained" onPress={stopMeditation} icon="stop">
                Stop & Save
              </Button>
            )}
            <Text style={styles.targetText}>Target: 10 minutes = 100 XP</Text>
          </Card.Content>
        </Card>

        {/* Journal Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>📝 Journal</Text>
            <Text style={styles.helperText}>
              {todayLog?.hasJournal ? '✓ Entry logged today' : 'No entry today'}
            </Text>
            <Button 
              mode="contained" 
              onPress={handleJournalEntry}
              disabled={todayLog?.hasJournal}
            >
              Log Journal Entry
            </Button>
            <Text style={styles.targetText}>Target: 1 entry = 100 XP</Text>
          </Card.Content>
        </Card>

        {/* Breathing Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>🫁 Breathing Exercise</Text>
            <Text style={styles.helperText}>
              Today: {todayLog?.breathingExercises || 0} exercises
            </Text>
            <Button mode="contained" onPress={handleBreathingExercise}>
              Complete Exercise
            </Button>
            <Text style={styles.targetText}>Target: 1 exercise = 50 XP</Text>
          </Card.Content>
        </Card>

        {/* XP Summary Card */}
        <Card style={styles.xpCard}>
          <Card.Content>
            <Text style={styles.xpTitle}>Today's XP: {getTodayXP()}</Text>
            <Text style={styles.bonusText}>Complete all 8 activities for +200 XP bonus!</Text>
            <Button 
              mode="contained" 
              onPress={handleClaimXP}
              style={styles.claimButton}
              icon="star"
            >
              Claim XP
            </Button>
          </Card.Content>
        </Card>
      </View>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
  helperText: {
    marginBottom: 12,
    color: '#666',
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  stepsDisplay: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  stepsNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  stepsLabel: {
    fontSize: 14,
    color: '#666',
  },
  quickStepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  sleepDisplay: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6200ee',
    marginVertical: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666',
  },
  targetText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 8,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  counterDisplay: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  counterText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  counterLabel: {
    fontSize: 14,
    color: '#666',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  moodButton: {
    margin: 4,
  },
  mealsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 4,
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#6200ee',
  },
  xpCard: {
    backgroundColor: '#6200ee',
    marginBottom: 32,
  },
  xpTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: 8,
  },
  bonusText: {
    fontSize: 12,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  claimButton: {
    backgroundColor: 'white',
  },
});
