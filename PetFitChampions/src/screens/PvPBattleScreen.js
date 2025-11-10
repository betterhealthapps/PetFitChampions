import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Animated, BackHandler } from 'react-native';
import { Card, Title, Text, Button, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PetContext } from '../context/PetContext';
import { BATTLE_ACTIONS, COLORS } from '../data/constants';
import { 
  calculateDamage, 
  getDefenseBonus, 
  getAIAction,
  initializeBattleTraits,
  applyEnduranceHealing,
  checkCounterReflect
} from '../utils/battleLogic';
import { getLearnedTraits } from '../utils/storage';

export default function PvPBattleScreen({ route, navigation }) {
  const { opponent } = route.params;
  const { pet } = useContext(PetContext);

  const maxPlayerHealth = pet.stats.health;
  const [learnedTraits, setLearnedTraits] = useState([]);
  const [traitsInitialized, setTraitsInitialized] = useState(false);
  const [playerTraits, setPlayerTraits] = useState({});
  const [opponentTraits, setOpponentTraits] = useState({});

  useEffect(() => {
    const loadTraits = async () => {
      const traits = await getLearnedTraits();
      setLearnedTraits(traits);
      const battleTraits = initializeBattleTraits(pet, opponent, traits, []);
      setPlayerTraits(battleTraits.playerTraits);
      setOpponentTraits(battleTraits.opponentTraits);
      setTraitsInitialized(true);
    };
    loadTraits();
  }, []);

  const [playerHealth, setPlayerHealth] = useState(pet.stats.health);
  const [opponentHealth, setOpponentHealth] = useState(opponent.maxHealth);
  const [battleLog, setBattleLog] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [playerAction, setPlayerAction] = useState(null);
  const [opponentDefending, setOpponentDefending] = useState(false);
  const [battleEnded, setBattleEnded] = useState(false);
  const [shakeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (!playerTurn && !battleEnded) {
      setTimeout(() => executeAITurn(), 1500);
    }
  }, [playerTurn, battleEnded]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const executePlayerAction = (action) => {
    if (!playerTurn || battleEnded) return;

    setPlayerAction(action);
    let damage = 0;
    let newLogs = [];

    if (playerTraits.endurance) {
      const healedHealth = applyEnduranceHealing(playerHealth, maxPlayerHealth, playerTraits.endurance);
      if (healedHealth > playerHealth) {
        const healAmount = healedHealth - playerHealth;
        setPlayerHealth(healedHealth);
        newLogs.push(`💪 Endurance restored ${healAmount} HP!`);
      }
    }

    if (action === BATTLE_ACTIONS.DEFEND) {
      newLogs.push(`${pet.name} takes a defensive stance!`);
    } else {
      const defenseMultiplier = opponentDefending ? 0.5 : 1.0;
      damage = Math.floor(calculateDamage(pet, opponent, action, playerTraits) * defenseMultiplier);
      
      const isCrit = playerTraits.criticalHit && damage > calculateDamage(pet, opponent, action);
      if (isCrit) {
        newLogs.push(`💥 Critical Master! Double damage!`);
      }

      const newOpponentHealth = Math.max(0, opponentHealth - damage);
      setOpponentHealth(newOpponentHealth);
      shake();

      const actionName = action === BATTLE_ACTIONS.SPECIAL ? 'Special Attack' : 'Attack';
      newLogs.push(`${pet.name} used ${actionName} and dealt ${damage} damage!`);

      if (newOpponentHealth <= 0) {
        setBattleEnded(true);
        setTimeout(() => {
          navigation.replace('PvPResult', { victory: true });
        }, 1500);
      }
    }

    setBattleLog([...newLogs, ...battleLog]);
    setOpponentDefending(false);
    setPlayerTurn(false);
  };

  const executeAITurn = () => {
    const aiAction = getAIAction(opponent, pet, opponentHealth, playerHealth);
    let damage = 0;
    let newLogs = [];

    if (opponentTraits.endurance) {
      const healedHealth = applyEnduranceHealing(opponentHealth, opponent.maxHealth, opponentTraits.endurance);
      if (healedHealth > opponentHealth) {
        const healAmount = healedHealth - opponentHealth;
        setOpponentHealth(healedHealth);
        newLogs.push(`💪 ${opponent.name}'s Endurance restored ${healAmount} HP!`);
      }
    }

    if (aiAction === BATTLE_ACTIONS.DEFEND) {
      setOpponentDefending(true);
      newLogs.push(`${opponent.name} takes a defensive stance!`);
    } else {
      const defenseMultiplier = playerAction === BATTLE_ACTIONS.DEFEND ? 0.5 : 1.0;
      damage = Math.floor(calculateDamage(opponent, pet, aiAction, opponentTraits) * defenseMultiplier);

      const counterDamage = checkCounterReflect(damage, playerTraits.counter);
      if (counterDamage > 0) {
        const newOpHealth = Math.max(0, opponentHealth - counterDamage);
        setOpponentHealth(newOpHealth);
        newLogs.push(`🔄 Counter! Reflected ${counterDamage} damage back!`);
      }

      const newPlayerHealth = Math.max(0, playerHealth - damage);
      setPlayerHealth(newPlayerHealth);
      shake();

      const actionName = aiAction === BATTLE_ACTIONS.SPECIAL ? 'Special Attack' : 'Attack';
      newLogs.push(`${opponent.name} used ${actionName} and dealt ${damage} damage!`);

      if (newPlayerHealth <= 0) {
        setBattleEnded(true);
        setTimeout(() => {
          navigation.replace('PvPResult', { victory: false });
        }, 1500);
      }
    }

    setBattleLog([...newLogs, ...battleLog]);
    setPlayerAction(null);
    setPlayerTurn(true);
  };

  const playerHealthPercent = playerHealth / maxPlayerHealth;
  const opponentHealthPercent = opponentHealth / opponent.maxHealth;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.battleHeader}>
              <Text style={styles.vsText}>VS</Text>
            </View>

            <View style={styles.combatantSection}>
              <Animated.View style={[styles.combatant, { transform: [{ translateX: shakeAnim }] }]}>
                <View style={styles.combatantCard}>
                  <MaterialCommunityIcons name="paw" size={48} color={COLORS.PRIMARY} />
                  <Text style={styles.combatantName}>{opponent.name}</Text>
                  <Text style={styles.combatantLevel}>Lv. {opponent.level}</Text>
                  {opponentDefending && (
                    <MaterialCommunityIcons name="shield" size={24} color={COLORS.ACCENT} />
                  )}
                  <View style={styles.traitsContainer}>
                    {Object.values(opponentTraits).filter(t => t).map(trait => (
                      <View key={trait.id} style={styles.traitBadge}>
                        <Text style={styles.traitIcon}>{trait.icon}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.healthBarContainer}>
                  <Text style={styles.healthText}>
                    {opponentHealth}/{opponent.maxHealth}
                  </Text>
                  <ProgressBar
                    progress={opponentHealthPercent}
                    color={opponentHealthPercent > 0.5 ? COLORS.SUCCESS : opponentHealthPercent > 0.25 ? COLORS.WARNING : COLORS.ERROR}
                    style={styles.healthBar}
                  />
                </View>
              </Animated.View>

              <View style={styles.combatant}>
                <View style={styles.combatantCard}>
                  <MaterialCommunityIcons name="paw" size={48} color={COLORS.ACCENT} />
                  <Text style={styles.combatantName}>{pet.name}</Text>
                  <Text style={styles.combatantLevel}>Lv. {pet.level}</Text>
                  {playerAction === BATTLE_ACTIONS.DEFEND && (
                    <MaterialCommunityIcons name="shield" size={24} color={COLORS.ACCENT} />
                  )}
                  <View style={styles.traitsContainer}>
                    {Object.values(playerTraits).filter(t => t).map(trait => (
                      <View key={trait.id} style={styles.traitBadge}>
                        <Text style={styles.traitIcon}>{trait.icon}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.healthBarContainer}>
                  <Text style={styles.healthText}>
                    {playerHealth}/{maxPlayerHealth}
                  </Text>
                  <ProgressBar
                    progress={playerHealthPercent}
                    color={playerHealthPercent > 0.5 ? COLORS.SUCCESS : playerHealthPercent > 0.25 ? COLORS.WARNING : COLORS.ERROR}
                    style={styles.healthBar}
                  />
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text style={styles.turnIndicator}>
              {battleEnded ? 'Battle Ended!' : playerTurn ? 'Your Turn' : "Opponent's Turn"}
            </Text>

            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={() => executePlayerAction(BATTLE_ACTIONS.ATTACK)}
                disabled={!playerTurn || battleEnded}
                icon="sword"
                style={[styles.actionButton, { backgroundColor: COLORS.PRIMARY }]}
                labelStyle={styles.actionButtonLabel}
              >
                Attack
              </Button>

              <Button
                mode="contained"
                onPress={() => executePlayerAction(BATTLE_ACTIONS.DEFEND)}
                disabled={!playerTurn || battleEnded}
                icon="shield"
                style={[styles.actionButton, { backgroundColor: COLORS.ACCENT }]}
                labelStyle={styles.actionButtonLabel}
              >
                Defend
              </Button>

              <Button
                mode="contained"
                onPress={() => executePlayerAction(BATTLE_ACTIONS.SPECIAL)}
                disabled={!playerTurn || battleEnded}
                icon="flash"
                style={[styles.actionButton, { backgroundColor: COLORS.WARNING }]}
                labelStyle={styles.actionButtonLabel}
              >
                Special
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.logCard}>
          <Card.Content>
            <Text style={styles.logTitle}>Battle Log</Text>
            <ScrollView style={styles.logScroll} nestedScrollEnabled>
              {battleLog.map((log, index) => (
                <Text key={index} style={styles.logEntry}>
                  • {log}
                </Text>
              ))}
              {battleLog.length === 0 && (
                <Text style={styles.logEmpty}>Battle started! Choose your action.</Text>
              )}
            </ScrollView>
          </Card.Content>
        </Card>
      </View>
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
  card: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  battleHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  vsText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.ERROR,
  },
  combatantSection: {
    marginTop: 16,
  },
  combatant: {
    marginBottom: 24,
  },
  combatantCard: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 12,
    marginBottom: 12,
  },
  combatantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 8,
  },
  combatantLevel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  healthBarContainer: {
    width: '100%',
  },
  healthText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 8,
  },
  healthBar: {
    height: 12,
    borderRadius: 6,
  },
  actionsCard: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  turnIndicator: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    textAlign: 'center',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    elevation: 2,
  },
  actionButtonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  logCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  logTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 12,
  },
  logScroll: {
    maxHeight: 150,
  },
  logEntry: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    marginVertical: 4,
  },
  logEmpty: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  traitsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  traitBadge: {
    backgroundColor: '#FFE8A5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  traitIcon: {
    fontSize: 16,
  },
});
