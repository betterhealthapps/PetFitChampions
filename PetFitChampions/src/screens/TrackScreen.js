import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, TextInput, Button, IconButton, Chip } from 'react-native-paper';
import { HealthContext } from '../context/HealthContext';
import { PetContext } from '../context/PetContext';
import { MOOD_OPTIONS, MEAL_QUALITY } from '../data/constants';

export default function TrackScreen() {
  const { todayLog, updateActivity, getTodayXP } = useContext(HealthContext);
  const { addXP } = useContext(PetContext);
  
  const [steps, setSteps] = useState('0');
  const [sleepHours, setSleepHours] = useState('0');
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [meditationMinutes, setMeditationMinutes] = useState(0);
  const [meditationTimer, setMeditationTimer] = useState(null);

  useEffect(() => {
    if (todayLog) {
      setSteps(todayLog.steps.toString());
      setSleepHours(todayLog.sleepHours.toString());
      setWaterGlasses(todayLog.waterGlasses || 0);
      setMeditationMinutes(todayLog.meditationMinutes || 0);
    }
  }, [todayLog]);

  const handleSaveSteps = async () => {
    await updateActivity('steps', parseInt(steps) || 0);
    Alert.alert('Success', 'Steps logged!');
  };

  const handleSaveSleep = async () => {
    await updateActivity('sleepHours', parseFloat(sleepHours) || 0);
    Alert.alert('Success', 'Sleep hours logged!');
  };

  const handleAddWater = async () => {
    const newCount = waterGlasses + 1;
    setWaterGlasses(newCount);
    await updateActivity('waterGlasses', newCount);
  };

  const handleRemoveWater = async () => {
    if (waterGlasses > 0) {
      const newCount = waterGlasses - 1;
      setWaterGlasses(newCount);
      await updateActivity('waterGlasses', newCount);
    }
  };

  const handleMoodCheckIn = async (mood) => {
    const currentMoods = todayLog?.moodCheckIns || [];
    const newMoods = [...currentMoods, { emoji: mood.emoji, time: new Date().toISOString() }];
    await updateActivity('moodCheckIns', newMoods);
    Alert.alert('Success', `Mood logged: ${mood.emoji}`);
  };

  const handleLogMeal = async (quality) => {
    const currentMeals = todayLog?.meals || [];
    const newMeals = [...currentMeals, quality];
    await updateActivity('meals', newMeals);
    Alert.alert('Success', `${quality} meal logged!`);
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
      Alert.alert('Success', `${meditationMinutes} minutes of meditation logged!`);
    }
  };

  const handleJournalEntry = async () => {
    await updateActivity('hasJournal', true);
    Alert.alert('Success', 'Journal entry logged!');
  };

  const handleBreathingExercise = async () => {
    const currentCount = todayLog?.breathingExercises || 0;
    await updateActivity('breathingExercises', currentCount + 1);
    Alert.alert('Success', 'Breathing exercise completed!');
  };

  const handleClaimXP = async () => {
    const xpToAdd = getTodayXP();
    if (xpToAdd === 0) {
      Alert.alert('No XP', 'Complete some activities first!');
      return;
    }

    const result = await addXP(xpToAdd);
    
    if (result.leveledUp) {
      Alert.alert(
        '🎉 Level Up!',
        `Your pet reached level ${result.newLevel} and earned ${result.gemsEarned} gems!`
      );
    } else {
      Alert.alert('XP Added', `+${xpToAdd} XP earned today!`);
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
            <TextInput
              label="Steps taken today"
              value={steps}
              onChangeText={setSteps}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />
            <Button mode="contained" onPress={handleSaveSteps}>
              Save Steps
            </Button>
          </Card.Content>
        </Card>

        {/* Sleep Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>😴 Sleep</Text>
            <TextInput
              label="Hours slept"
              value={sleepHours}
              onChangeText={setSleepHours}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />
            <Button mode="contained" onPress={handleSaveSleep}>
              Save Sleep
            </Button>
          </Card.Content>
        </Card>

        {/* Water Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>💧 Water Intake</Text>
            <View style={styles.counterRow}>
              <IconButton icon="minus" onPress={handleRemoveWater} />
              <Text style={styles.counterText}>{waterGlasses} glasses</Text>
              <IconButton icon="plus" onPress={handleAddWater} />
            </View>
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
          </Card.Content>
        </Card>

        {/* XP Summary Card */}
        <Card style={styles.xpCard}>
          <Card.Content>
            <Text style={styles.xpTitle}>Today's XP: {getTodayXP()}</Text>
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
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 16,
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
    marginBottom: 12,
  },
  claimButton: {
    backgroundColor: 'white',
  },
});
