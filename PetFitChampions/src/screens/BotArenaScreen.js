import React, { useContext, useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, Alert } from 'react-native';
import { Card, Title, Text, Button, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BattleContext } from '../context/BattleContext';
import { PetContext } from '../context/PetContext';
import { COLORS, BATTLE_ACTIONS } from '../data/constants';
import { 
  createBotOpponent, 
  calculateDamage, 
  checkCriticalHit, 
  checkDodge, 
  getBotAIStrategy, 
  calculateBotRewards,
  initializeBattleTraits,
} from '../utils/battleLogic';
import { saveBattleStats, getBattleStats } from '../utils/storage';

export default function BotArenaScreen({ navigation }) {
  const { energy, consumeEnergy, hasEnoughEnergy, maxEnergy } = useContext(BattleContext);
  const { pet, updatePet, addGems, addXP } = useContext(PetContext);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  
  const [gameState, setGameState] = useState('setup');
  const [botPet, setBotPet] = useState(null);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [botHealth, setBotHealth] = useState(100);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [battleLog, setBattleLog] = useState([]);
  const [turnCount, setTurnCount] = useState(0);
  const [botStats, setBotStats] = useState({ easy: { wins: 0, losses: 0 }, medium: { wins: 0, losses: 0 }, hard: { wins: 0, losses: 0 } });
  const [playerTraits, setPlayerTraits] = useState({});
  const [botTraits, setBotTraits] = useState({});

  const playerShake = useRef(new Animated.Value(0)).current;
  const botShake = useRef(new Animated.Value(0)).current;

  const ENERGY_COST = 10;

  useEffect(() => {
    loadBotStats();
  }, []);

  const loadBotStats = async () => {
    const battleStats = await getBattleStats();
    if (battleStats && battleStats.bot) {
      setBotStats(battleStats.bot);
    }
  };

  const addLog = (message) => {
    setBattleLog(prev => [message, ...prev].slice(0, 10));
  };

  const shakeAnimation = (target) => {
    const anim = target === 'player' ? playerShake : botShake;
    Animated.sequence([
      Animated.timing(anim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleStartBattle = async () => {
    if (!hasEnoughEnergy(ENERGY_COST)) {
      setSnackbarMessage(`Need ${ENERGY_COST} energy to battle`);
      setSnackbarVisible(true);
      return;
    }

    try {
      const bot = createBotOpponent(selectedDifficulty, pet);
      setBotPet(bot);

      const playerMaxHealth = pet.baseStats.health || 100;
      const botMaxHealth = bot.baseStats.health || 100;
      setPlayerHealth(playerMaxHealth);
      setBotHealth(botMaxHealth);
      setBattleLog([`Battle started against ${bot.name} (${selectedDifficulty})!`]);

      const traits = initializeBattleTraits(pet, bot);
      setPlayerTraits(traits.playerTraits);
      setBotTraits(traits.opponentTraits);

      const playerGoesFirst = traits.playerTraits.firstStrike || 
        (!traits.opponentTraits.firstStrike && pet.baseStats.agility >= bot.baseStats.agility);
      
      setPlayerTurn(playerGoesFirst);
      setTurnCount(1);

      if (playerGoesFirst) {
        addLog('You have first strike!');
      } else {
        addLog(`${bot.name} has first strike!`);
        setTimeout(() => botAttack(), 1500);
      }

      await consumeEnergy(ENERGY_COST);
      setGameState('battle');
    } catch (error) {
      Alert.alert('Error', 'Failed to start battle: ' + error.message);
    }
  };

  const playerMove = (moveType) => {
    if (!playerTurn || gameState !== 'battle') return;

    setPlayerTurn(false);
    setTurnCount(prev => prev + 1);

    if (moveType === BATTLE_ACTIONS.DEFEND) {
      addLog('You brace for defense!');
      setTimeout(() => botAttack(0.5), 1000);
      return;
    }

    const damage = calculateDamage(pet, botPet, moveType, playerTraits);
    const dodged = checkDodge(botPet);

    if (dodged) {
      addLog(`${botPet.name} dodged your attack!`);
      setTimeout(() => botAttack(), 1500);
      return;
    }

    const newBotHealth = Math.max(0, botHealth - damage);
    setBotHealth(newBotHealth);
    shakeAnimation('bot');

    const moveText = moveType === BATTLE_ACTIONS.ATTACK ? 'attacked' : 'used special move on';
    addLog(`You ${moveText} ${botPet.name} for ${Math.round(damage)} damage!`);

    if (newBotHealth <= 0) {
      endBattle('victory');
      return;
    }

    setTimeout(() => botAttack(), 1500);
  };

  const botAttack = (damageMultiplier = 1) => {
    if (gameState !== 'battle') return;

    const aiMove = getBotAIStrategy(selectedDifficulty, botHealth, playerHealth, turnCount, botTraits);

    if (aiMove === BATTLE_ACTIONS.DEFEND) {
      addLog(`${botPet.name} defends!`);
      setPlayerTurn(true);
      return;
    }

    const damage = calculateDamage(botPet, pet, aiMove, botTraits) * damageMultiplier;
    const dodged = checkDodge(pet);

    if (dodged) {
      addLog('You dodged the attack!');
      setPlayerTurn(true);
      return;
    }

    const newPlayerHealth = Math.max(0, playerHealth - damage);
    setPlayerHealth(newPlayerHealth);
    shakeAnimation('player');

    const moveText = aiMove === BATTLE_ACTIONS.ATTACK ? 'attacked' : 'used special move on';
    addLog(`${botPet.name} ${moveText} you for ${Math.round(damage)} damage!`);

    if (newPlayerHealth <= 0) {
      endBattle('defeat');
      return;
    }

    setPlayerTurn(true);
  };

  const endBattle = async (result) => {
    setGameState('results');
    
    try {
      const rewards = calculateBotRewards(selectedDifficulty, result === 'victory');
      
      await addGems(rewards.gems);
      
      const levelUpResult = await addXP(rewards.xp);

      const battleStats = await getBattleStats();
      const statKey = result === 'victory' ? 'wins' : 'losses';
      battleStats.bot[selectedDifficulty][statKey] += 1;
      
      await saveBattleStats(battleStats);
      setBotStats(battleStats.bot);

      navigation.navigate('BotArenaResult', {
        result,
        rewards,
        botName: botPet.name,
        difficulty: selectedDifficulty,
        botStats: battleStats.bot,
      });
    } catch (error) {
      console.error('Error ending battle:', error);
      Alert.alert('Error', 'Failed to save battle results');
    }
  };

  const resetBattle = () => {
    setGameState('setup');
    setBotPet(null);
    setPlayerHealth(100);
    setBotHealth(100);
    setBattleLog([]);
    setPlayerTurn(true);
    setTurnCount(0);
  };

  const difficulties = [
    {
      id: 'easy',
      name: 'Easy',
      icon: '😊',
      description: 'Bot 15% weaker',
      winGems: '4-6',
      loseGems: '-1',
      color: COLORS.SUCCESS,
    },
    {
      id: 'medium',
      name: 'Medium',
      icon: '😐',
      description: 'Equal strength',
      winGems: '7-10',
      loseGems: '-3',
      color: COLORS.WARNING,
    },
    {
      id: 'hard',
      name: 'Hard',
      icon: '😤',
      description: 'Bot 15% stronger',
      winGems: '11-14',
      loseGems: '-5',
      color: COLORS.ERROR,
    },
  ];

  if (!pet) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (gameState === 'battle') {
    const playerHealthPercent = (playerHealth / (pet.baseStats.health || 100)) * 100;
    const botHealthPercent = (botHealth / (botPet.baseStats.health || 100)) * 100;

    return (
      <View style={styles.battleContainer}>
        <View style={styles.battleHeader}>
          <Text style={styles.battleTitle}>Bot Arena Battle</Text>
          <TouchableOpacity onPress={() => resetBattle()} style={styles.forfeitButton}>
            <Text style={styles.forfeitText}>Forfeit</Text>
          </TouchableOpacity>
        </View>

        <Animated.View 
          style={[
            styles.petContainer,
            styles.botContainerTop,
            { transform: [{ translateX: botShake }] }
          ]}
        >
          <Text style={styles.petName}>{botPet.name}</Text>
          <Text style={styles.petLevel}>Lv. {botPet.level}</Text>
          <View style={styles.petPlaceholder}>
            <Text style={styles.petEmoji}>🤖</Text>
          </View>
          <View style={styles.healthBarContainer}>
            <View 
              style={[
                styles.healthBar,
                { width: `${Math.max(0, botHealthPercent)}%` },
                botHealthPercent < 30 && styles.healthBarLow
              ]}
            />
          </View>
          <Text style={styles.healthText}>{Math.round(botHealth)}/{botPet.baseStats.health} HP</Text>
        </Animated.View>

        <ScrollView style={styles.battleLogContainer}>
          {battleLog.map((log, index) => (
            <Text key={index} style={styles.logText}>{log}</Text>
          ))}
        </ScrollView>

        <Animated.View 
          style={[
            styles.petContainer,
            styles.playerContainerBottom,
            { transform: [{ translateX: playerShake }] }
          ]}
        >
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petLevel}>Lv. {pet.level}</Text>
          <View style={styles.petPlaceholder}>
            <Text style={styles.petEmoji}>🐾</Text>
          </View>
          <View style={styles.healthBarContainer}>
            <View 
              style={[
                styles.healthBar,
                { width: `${Math.max(0, playerHealthPercent)}%` },
                playerHealthPercent < 30 && styles.healthBarLow
              ]}
            />
          </View>
          <Text style={styles.healthText}>{Math.round(playerHealth)}/{pet.baseStats.health} HP</Text>
        </Animated.View>

        <View style={styles.actionsContainer}>
          <Text style={styles.actionsTitle}>
            {playerTurn ? 'Your Turn' : `${botPet.name}'s Turn...`}
          </Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionButton, !playerTurn && styles.actionButtonDisabled]}
              onPress={() => playerMove(BATTLE_ACTIONS.ATTACK)}
              disabled={!playerTurn}
            >
              <Text style={styles.actionButtonText}>⚔️ Attack</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, !playerTurn && styles.actionButtonDisabled]}
              onPress={() => playerMove(BATTLE_ACTIONS.SPECIAL)}
              disabled={!playerTurn}
            >
              <Text style={styles.actionButtonText}>✨ Special</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, !playerTurn && styles.actionButtonDisabled]}
              onPress={() => playerMove(BATTLE_ACTIONS.DEFEND)}
              disabled={!playerTurn}
            >
              <Text style={styles.actionButtonText}>🛡️ Defend</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.header}>
              <MaterialCommunityIcons name="robot" size={48} color="#5D9CEC" />
              <Title style={styles.title}>Bot Arena</Title>
            </View>
            <Text style={styles.subtitle}>Choose your difficulty level</Text>
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
              <Text style={styles.infoText}>Cost: {ENERGY_COST} energy per battle</Text>
            </View>
          </Card.Content>
        </Card>

        {difficulties.map((diff) => (
          <Card 
            key={diff.id} 
            style={[styles.difficultyCard, selectedDifficulty === diff.id && styles.selectedCard]}
            onPress={() => setSelectedDifficulty(diff.id)}
          >
            <Card.Content>
              <View style={styles.difficultyHeader}>
                <Text style={styles.difficultyIcon}>{diff.icon}</Text>
                <Text style={styles.difficultyName}>{diff.name}</Text>
              </View>
              <Text style={styles.difficultyDescription}>{diff.description}</Text>
              
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardText}>💎 Win: {diff.winGems} | Lose: {diff.loseGems}</Text>
              </View>

              <View style={styles.statsRow}>
                <Text style={styles.statsText}>
                  W: {botStats[diff.id].wins} | L: {botStats[diff.id].losses}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}

        <Card style={styles.tipsCard}>
          <Card.Content>
            <Text style={styles.tipsTitle}>💡 Practice Tips</Text>
            <Text style={styles.tipText}>• Lower energy cost than PvP (10 vs 20)</Text>
            <Text style={styles.tipText}>• Perfect for testing strategies</Text>
            <Text style={styles.tipText}>• Earn gems while training</Text>
            <Text style={styles.tipText}>• Battle traits are active!</Text>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleStartBattle}
          disabled={!hasEnoughEnergy(ENERGY_COST)}
          icon="sword-cross"
          style={styles.playButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          {hasEnoughEnergy(ENERGY_COST) ? `⚔️ Start Battle (${ENERGY_COST}⚡)` : `Need ${ENERGY_COST - energy} More Energy`}
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
    color: '#5D9CEC',
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
  difficultyCard: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#5D9CEC',
  },
  difficultyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  difficultyIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  difficultyName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  difficultyDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  rewardInfo: {
    padding: 8,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 8,
    marginBottom: 8,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  statsRow: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
  },
  statsText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  tipsCard: {
    marginBottom: 24,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5D9CEC',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    marginVertical: 3,
  },
  playButton: {
    backgroundColor: '#5D9CEC',
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
  battleContainer: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  battleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#16213E',
  },
  battleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  forfeitButton: {
    padding: 8,
    backgroundColor: COLORS.ERROR,
    borderRadius: 8,
  },
  forfeitText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  petContainer: {
    alignItems: 'center',
    padding: 20,
  },
  botContainerTop: {
    backgroundColor: '#2C3E50',
  },
  playerContainerBottom: {
    backgroundColor: '#1F4068',
  },
  petName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  petLevel: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 12,
  },
  petPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#34495E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  petEmoji: {
    fontSize: 40,
  },
  healthBarContainer: {
    width: 200,
    height: 20,
    backgroundColor: '#2C3E50',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  healthBar: {
    height: '100%',
    backgroundColor: COLORS.SUCCESS,
    borderRadius: 10,
  },
  healthBarLow: {
    backgroundColor: COLORS.ERROR,
  },
  healthText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  battleLogContainer: {
    flex: 1,
    backgroundColor: '#0F3460',
    margin: 16,
    padding: 12,
    borderRadius: 12,
  },
  logText: {
    fontSize: 13,
    color: '#FFFFFF',
    marginVertical: 4,
    opacity: 0.9,
  },
  actionsContainer: {
    backgroundColor: '#16213E',
    padding: 16,
    paddingBottom: 32,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#5D9CEC',
    padding: 16,
    margin: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: '#555555',
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
