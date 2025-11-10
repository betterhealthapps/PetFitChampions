import React, { useContext, useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, Alert, Dimensions } from 'react-native';
import { Card, Title, Text, Button, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BattleContext } from '../context/BattleContext';
import { PetContext } from '../context/PetContext';
import { COLORS } from '../data/constants';
import { calculateRunnerReward } from '../utils/battleLogic';
import { saveBattleStats, getBattleStats } from '../utils/storage';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GROUND_HEIGHT = 120;
const PET_SIZE = 50;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_HEIGHT = 60;
const JUMP_HEIGHT = 120;

export default function RunnerGameScreen({ navigation }) {
  const { energy, consumeEnergy, hasEnoughEnergy, maxEnergy } = useContext(BattleContext);
  const { pet, addGems } = useContext(PetContext);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [runnerStats, setRunnerStats] = useState({ highScore: 0, totalRuns: 0, todayGems: 0 });

  const petY = useRef(new Animated.Value(GROUND_HEIGHT)).current;
  const gameLoop = useRef(null);
  const obstacleId = useRef(0);

  const ENERGY_COST = 5;

  useEffect(() => {
    loadRunnerStats();
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      startGame();
    } else {
      stopGame();
    }
    return () => stopGame();
  }, [gameState]);

  const loadRunnerStats = async () => {
    const battleStats = await getBattleStats();
    if (battleStats && battleStats.runner) {
      const stats = battleStats.runner;
      if (stats.dailyGems !== undefined && stats.todayGems === undefined) {
        stats.todayGems = stats.dailyGems;
      }
      setRunnerStats(stats);
    }
  };

  const handleStartGame = async () => {
    if (!hasEnoughEnergy(ENERGY_COST)) {
      setSnackbarMessage(`Need ${ENERGY_COST} energy to play`);
      setSnackbarVisible(true);
      return;
    }

    await consumeEnergy(ENERGY_COST);
    setScore(0);
    setObstacles([]);
    setGameState('playing');
  };

  const startGame = () => {
    let currentScore = 0;
    let obstacleSpawnCounter = 0;
    const spawnInterval = 80;

    gameLoop.current = setInterval(() => {
      currentScore += 1;
      setScore(currentScore);
      obstacleSpawnCounter += 1;

      if (obstacleSpawnCounter >= spawnInterval) {
        spawnObstacle();
        obstacleSpawnCounter = 0;
      }

      setObstacles(prev => {
        const updated = prev.map(obs => ({
          ...obs,
          x: obs.x - (5 + currentScore * 0.01)
        })).filter(obs => obs.x > -OBSTACLE_WIDTH);
        
        checkCollision(updated);
        return updated;
      });
    }, 16);
  };

  const stopGame = () => {
    if (gameLoop.current) {
      clearInterval(gameLoop.current);
      gameLoop.current = null;
    }
  };

  const spawnObstacle = () => {
    const newObstacle = {
      id: obstacleId.current++,
      x: SCREEN_WIDTH,
      type: Math.random() > 0.7 ? 'tall' : 'normal',
    };
    setObstacles(prev => [...prev, newObstacle]);
  };

  const jump = () => {
    if (isJumping || gameState !== 'playing') return;

    setIsJumping(true);
    Animated.sequence([
      Animated.timing(petY, {
        toValue: GROUND_HEIGHT + JUMP_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(petY, {
        toValue: GROUND_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setIsJumping(false));
  };

  const checkCollision = (currentObstacles) => {
    if (isJumping) return;

    const petLeft = 50;
    const petRight = petLeft + PET_SIZE;
    const petBottom = GROUND_HEIGHT;
    const petTop = GROUND_HEIGHT + PET_SIZE;

    for (const obs of currentObstacles) {
      if (obs.x < petRight && obs.x + OBSTACLE_WIDTH > petLeft) {
        const obsHeight = obs.type === 'tall' ? OBSTACLE_HEIGHT + 20 : OBSTACLE_HEIGHT;
        const obsTop = GROUND_HEIGHT + obsHeight;
        
        if (petBottom < obsTop) {
          endGame();
          return;
        }
      }
    }
  };

  const endGame = async () => {
    stopGame();
    setGameState('gameOver');

    try {
      const battleStats = await getBattleStats();
      const currentStats = battleStats.runner || { highScore: 0, totalRuns: 0, todayGems: 0 };
      
      currentStats.todayGems = currentStats.todayGems ?? currentStats.dailyGems ?? 0;
      
      const DAILY_GEM_LIMIT = 50;
      const isAtDailyLimit = currentStats.todayGems >= DAILY_GEM_LIMIT;
      
      let gemsEarned = calculateRunnerReward(score);
      
      if (isAtDailyLimit) {
        gemsEarned = 0;
      } else if (currentStats.todayGems + gemsEarned > DAILY_GEM_LIMIT) {
        gemsEarned = DAILY_GEM_LIMIT - currentStats.todayGems;
      }
      
      const xpEarned = Math.min(Math.floor(score / 2), 100);
      
      await addGems(gemsEarned);
      await addXP(xpEarned);

      const newStats = {
        highScore: Math.max(currentStats.highScore, score),
        totalRuns: (currentStats.totalRuns || 0) + 1,
        todayGems: currentStats.todayGems + gemsEarned,
      };

      battleStats.runner = newStats;
      await saveBattleStats(battleStats);
      setRunnerStats(newStats);

      const isNewRecord = score > currentStats.highScore;

      Alert.alert(
        'Game Over!',
        `${isNewRecord ? '🎉 NEW RECORD! 🎉\n\n' : ''}Score: ${score}\n\n💎 Gems Earned: ${gemsEarned}${isAtDailyLimit ? ' (Daily limit reached)' : ''}\n⭐ XP Earned: ${xpEarned}\n${isNewRecord ? '' : `🏆 High Score: ${currentStats.highScore}`}\n\n📊 Today's Gems: ${newStats.todayGems}/${DAILY_GEM_LIMIT}`,
        [
          { text: 'Menu', onPress: () => setGameState('menu') },
          { text: 'Play Again', onPress: () => handleStartGame() }
        ]
      );
    } catch (error) {
      console.error('Error ending game:', error);
      setGameState('menu');
    }
  };

  if (!pet) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (gameState === 'playing' || gameState === 'gameOver') {
    return (
      <View style={styles.gameContainer}>
        <View style={styles.gameHeader}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <TouchableOpacity onPress={() => { stopGame(); setGameState('menu'); }} style={styles.quitButton}>
            <Text style={styles.quitText}>Quit</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.gameArea} 
          onPress={jump}
          activeOpacity={1}
        >
          <View style={styles.skyArea}>
            <Text style={styles.instructionText}>Tap to Jump!</Text>
          </View>

          <Animated.View
            style={[
              styles.pet,
              {
                transform: [{ translateY: petY.interpolate({
                  inputRange: [0, 300],
                  outputRange: [0, -300],
                  extrapolate: 'clamp'
                })}]
              }
            ]}
          >
            <Text style={styles.petCharacter}>🐾</Text>
          </Animated.View>

          {obstacles.map(obs => (
            <View
              key={obs.id}
              style={[
                styles.obstacle,
                {
                  left: obs.x,
                  height: obs.type === 'tall' ? OBSTACLE_HEIGHT + 20 : OBSTACLE_HEIGHT,
                }
              ]}
            >
              <Text style={styles.obstacleText}>{obs.type === 'tall' ? '🌵' : '🪨'}</Text>
            </View>
          ))}

          <View style={styles.ground}>
            <Text style={styles.groundPattern}>{'─'.repeat(100)}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.header}>
              <MaterialCommunityIcons name="run-fast" size={48} color="#A463BF" />
              <Title style={styles.title}>Pet Runner</Title>
            </View>
            <Text style={styles.subtitle}>Endless obstacle course challenge</Text>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="lightning-bolt" size={20} color={COLORS.WARNING} />
              <Text style={styles.infoText}>Energy: {energy}/{maxEnergy}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="flash" size={20} color={COLORS.ERROR} />
              <Text style={styles.infoText}>Cost: {ENERGY_COST} energy per run</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.rewardCard}>
          <Card.Content>
            <Text style={styles.rewardTitle}>💎 Gem Rewards</Text>
            <View style={styles.rewardRow}>
              <Text style={styles.rewardText}>0-49 points: 5 gems</Text>
            </View>
            <View style={styles.rewardRow}>
              <Text style={styles.rewardText}>50-99 points: 8 gems</Text>
            </View>
            <View style={styles.rewardRow}>
              <Text style={styles.rewardText}>100-199 points: 12 gems</Text>
            </View>
            <View style={styles.rewardRow}>
              <Text style={styles.rewardText}>200-299 points: 15 gems</Text>
            </View>
            <View style={styles.rewardRow}>
              <Text style={styles.rewardText}>300-499 points: 20 gems</Text>
            </View>
            <View style={styles.rewardRow}>
              <Text style={styles.rewardText}>500+ points: 25 gems</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.gamePreviewCard}>
          <Card.Content>
            <Text style={styles.previewTitle}>How to Play</Text>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionIcon}>🏃</Text>
              <Text style={styles.instructionTextMenu}>
                Your pet runs automatically through an endless course
              </Text>
            </View>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionIcon}>⬆️</Text>
              <Text style={styles.instructionTextMenu}>
                Tap to jump over obstacles
              </Text>
            </View>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionIcon}>🪨</Text>
              <Text style={styles.instructionTextMenu}>
                Avoid rocks and cacti
              </Text>
            </View>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionIcon}>⚡</Text>
              <Text style={styles.instructionTextMenu}>
                Game speeds up as you progress
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.statsTitle}>Your Stats</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>High Score:</Text>
              <Text style={styles.statValue}>{runnerStats.highScore}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Today's Gems:</Text>
              <Text style={styles.statValue}>{runnerStats.todayGems}/50</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Runs:</Text>
              <Text style={styles.statValue}>{runnerStats.totalRuns}</Text>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleStartGame}
          disabled={!hasEnoughEnergy(ENERGY_COST)}
          icon="play"
          style={styles.playButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          {hasEnoughEnergy(ENERGY_COST) ? `🏃 Start Running! (${ENERGY_COST}⚡)` : `Need ${ENERGY_COST - energy} More Energy`}
        </Button>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY,
  },
  content: {
    padding: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#A463BF',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    marginLeft: 8,
    fontWeight: '600',
  },
  rewardCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A463BF',
    marginBottom: 12,
  },
  rewardRow: {
    paddingVertical: 4,
  },
  rewardText: {
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
  },
  gamePreviewCard: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A463BF',
    marginBottom: 12,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  instructionIcon: {
    fontSize: 24,
    marginRight: 12,
    width: 32,
  },
  instructionTextMenu: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  statsCard: {
    marginBottom: 24,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A463BF',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A463BF',
  },
  playButton: {
    backgroundColor: '#A463BF',
    borderRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameContainer: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1A1A2E',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  quitButton: {
    padding: 8,
    backgroundColor: COLORS.ERROR,
    borderRadius: 8,
  },
  quitText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  skyArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: GROUND_HEIGHT,
    backgroundColor: '#8B4513',
    justifyContent: 'flex-start',
    paddingTop: 5,
  },
  groundPattern: {
    fontSize: 16,
    color: '#654321',
  },
  pet: {
    position: 'absolute',
    bottom: GROUND_HEIGHT,
    left: 50,
    width: PET_SIZE,
    height: PET_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petCharacter: {
    fontSize: 40,
  },
  obstacle: {
    position: 'absolute',
    bottom: GROUND_HEIGHT,
    width: OBSTACLE_WIDTH,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  obstacleText: {
    fontSize: 40,
  },
});
