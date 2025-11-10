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
  getDefenseBonus
} from '../utils/battleLogic';
import { saveUserData, getUserData } from '../utils/storage';

export default function BotArenaScreen({ navigation }) {
  const { energy, consumeEnergy, hasEnoughEnergy, maxEnergy, addGems } = useContext(BattleContext);
  const { pet, updatePet } = useContext(PetContext);
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

  const difficulties = [
    {
      id: 'easy',
      name: 'Easy',
      icon: '🟢',
      description: 'Perfect for beginners',
      gems: '5-8',
      color: '#4CAF50',
    },
    {
      id: 'medium',
      name: 'Medium',
      icon: '🟡',
      description: 'Balanced challenge',
      gems: '8-12',
      color: '#FF9800',
    },
    {
      id: 'hard',
      name: 'Hard',
      icon: '🔴',
      description: 'For experienced trainers',
      gems: '12-15',
      color: '#F44336',
    },
  ];

  const handleStartBattle = async (difficulty) => {
    if (!hasEnoughEnergy(ENERGY_COST)) {
      setSnackbarMessage(`Need ${ENERGY_COST} energy to battle`);
      setSnackbarVisible(true);
      return;
    }

    setSnackbarMessage('Bot battles coming soon! Check back later.');
    setSnackbarVisible(true);
  };

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
          >
            <Card.Content>
              <View style={styles.difficultyHeader}>
                <Text style={styles.difficultyIcon}>{diff.icon}</Text>
                <Text style={styles.difficultyName}>{diff.name}</Text>
              </View>
              <Text style={styles.difficultyDescription}>{diff.description}</Text>
              
              <View style={styles.rewardInfo}>
                <MaterialCommunityIcons name="diamond-stone" size={20} color={COLORS.WARNING} />
                <Text style={styles.rewardText}>{diff.gems} gems</Text>
              </View>

              <Button
                mode="contained"
                onPress={() => handleStartBattle(diff.id)}
                disabled={!hasEnoughEnergy(ENERGY_COST)}
                style={[styles.battleButton, { backgroundColor: diff.color }]}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                Start Battle
              </Button>
            </Card.Content>
          </Card>
        ))}

        <Card style={styles.tipsCard}>
          <Card.Content>
            <Text style={styles.tipsTitle}>💡 Practice Tips</Text>
            <Text style={styles.tipText}>• Lower energy cost than PvP</Text>
            <Text style={styles.tipText}>• Perfect for testing strategies</Text>
            <Text style={styles.tipText}>• Earn gems while training</Text>
          </Card.Content>
        </Card>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 8,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginLeft: 8,
  },
  battleButton: {
    borderRadius: 10,
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
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
});
