import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { Card, Title, Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PetContext } from '../context/PetContext';
import { BATTLE_CONSTANTS, COLORS } from '../data/constants';
import { getBattleStats, saveBattleStats } from '../utils/storage';

export default function PvPResultScreen({ route, navigation }) {
  const { victory } = route.params;
  const { gems, spendGems, addGems, setGems } = useContext(PetContext);
  const [gemChange, setGemChange] = useState(0);
  const [newGemTotal, setNewGemTotal] = useState(gems);
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (!processed) {
      processRewards();
      setProcessed(true);
    }
  }, [processed]);

  const processRewards = async () => {
    if (victory) {
      const reward = BATTLE_CONSTANTS.VICTORY_GEM_REWARD;
      setGemChange(reward);
      const newTotal = await addGems(reward);
      setNewGemTotal(newTotal);
    } else {
      const loss = Math.min(BATTLE_CONSTANTS.DEFEAT_GEM_LOSS, gems);
      setGemChange(-loss);
      const newTotal = await spendGems(loss);
      setNewGemTotal(newTotal);
    }

    const currentStats = await getBattleStats();
    const pvpStats = currentStats.pvp || { wins: 0, losses: 0 };
    const updatedStats = {
      ...currentStats,
      pvp: {
        wins: victory ? pvpStats.wins + 1 : pvpStats.wins,
        losses: victory ? pvpStats.losses : pvpStats.losses + 1,
      },
    };
    await saveBattleStats(updatedStats);
  };

  const handleReturnToMatchmaking = () => {
    navigation.navigate('PvPArena');
  };

  const handleReturnHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.resultCard}>
          <Card.Content>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={victory ? 'trophy' : 'shield-off'}
                size={80}
                color={victory ? COLORS.SUCCESS : COLORS.ERROR}
              />
            </View>

            <Title style={[styles.resultTitle, { color: victory ? COLORS.SUCCESS : COLORS.ERROR }]}>
              {victory ? 'VICTORY!' : 'DEFEAT'}
            </Title>

            <Text style={styles.resultText}>
              {victory
                ? 'Congratulations! You won the battle!'
                : "Don't give up! Train your pet and try again!"}
            </Text>

            <View style={styles.rewardSection}>
              <View style={styles.rewardRow}>
                <MaterialCommunityIcons name="diamond-stone" size={24} color={COLORS.WARNING} />
                <Text style={[styles.gemChange, { color: victory ? COLORS.SUCCESS : COLORS.ERROR }]}>
                  {gemChange > 0 ? '+' : ''}{gemChange} Gems
                </Text>
              </View>
              <Text style={styles.gemTotal}>Total Gems: {newGemTotal}</Text>
            </View>

            <View style={styles.statsSection}>
              <Text style={styles.statsTitle}>Battle Summary</Text>
              {victory ? (
                <>
                  <Text style={styles.statText}>• Defeated opponent in combat</Text>
                  <Text style={styles.statText}>• Earned {BATTLE_CONSTANTS.VICTORY_GEM_REWARD} gems</Text>
                  <Text style={styles.statText}>• Your pet gains experience!</Text>
                </>
              ) : (
                <>
                  <Text style={styles.statText}>• Opponent was victorious</Text>
                  <Text style={styles.statText}>• Lost {Math.min(BATTLE_CONSTANTS.DEFEAT_GEM_LOSS, gems)} gems</Text>
                  <Text style={styles.statText}>• Keep training to get stronger!</Text>
                </>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleReturnToMatchmaking}
                icon="sword-cross"
                style={[styles.button, styles.battleAgainButton]}
                labelStyle={styles.buttonLabel}
              >
                Battle Again
              </Button>

              <Button
                mode="outlined"
                onPress={handleReturnHome}
                icon="home"
                style={styles.button}
                labelStyle={styles.buttonLabel}
              >
                Return Home
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  resultCard: {
    elevation: 4,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  resultTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  resultText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 24,
  },
  rewardSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 12,
    marginBottom: 20,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  gemChange: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  gemTotal: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  statsSection: {
    padding: 16,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 12,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 12,
  },
  statText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    marginVertical: 4,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 4,
  },
  battleAgainButton: {
    backgroundColor: COLORS.PRIMARY,
    elevation: 2,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
