import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Card, ProgressBar, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BattleContext } from '../context/BattleContext';
import { getBattleStats } from '../utils/storage';
import { COLORS } from '../data/constants';

export default function BattleScreen({ navigation }) {
  const { energy, hasEnoughEnergy, maxEnergy } = useContext(BattleContext);
  const [battleStats, setBattleStats] = useState({
    pvp: { wins: 0, losses: 0 },
    bot: { 
      easy: { wins: 0, losses: 0 }, 
      medium: { wins: 0, losses: 0 }, 
      hard: { wins: 0, losses: 0 } 
    },
    runner: { highScore: 0, dailyGems: 0 }
  });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadBattleData();
  }, []);

  const loadBattleData = async () => {
    try {
      const stats = await getBattleStats();
      if (stats) {
        setBattleStats(stats);
      }
    } catch (error) {
      console.error('Error loading battle data:', error);
    }
  };

  const handleModeSelect = (mode, energyCost) => {
    if (!hasEnoughEnergy(energyCost)) {
      setSnackbarMessage(`You need ${energyCost} energy for this mode. Current: ${energy}`);
      setSnackbarVisible(true);
      return;
    }

    switch(mode) {
      case 'pvp':
        navigation.navigate('PvPArena');
        break;
      case 'bot':
        navigation.navigate('BotArena');
        break;
      case 'runner':
        navigation.navigate('RunnerGame');
        break;
    }
  };

  const energyPercentage = energy / maxEnergy;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Battle Arena</Text>
        <Text style={styles.subtitle}>Choose your challenge</Text>
      </View>

      <View style={styles.energyCard}>
        <View style={styles.energyHeader}>
          <MaterialCommunityIcons name="lightning-bolt" size={24} color={COLORS.WARNING} />
          <Text style={styles.energyLabel}>Energy</Text>
        </View>
        <View style={styles.energyBarContainer}>
          <View style={[styles.energyFill, { width: `${energyPercentage * 100}%` }]} />
        </View>
        <Text style={styles.energyValue}>{energy}/{maxEnergy}</Text>
      </View>

      <View style={styles.modesContainer}>
        
        <Card style={styles.modeCard}>
          <Card.Content>
            <Text style={styles.modeIcon}>⚔️</Text>
            <Text style={styles.modeName}>PvP Arena</Text>
            <Text style={styles.modeDescription}>
              Battle real players and steal their gems!
            </Text>
            
            <View style={styles.modeDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>💎 Gems:</Text>
                <Text style={styles.detailValue}>10-30</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>⚡ Cost:</Text>
                <Text style={styles.detailValue}>20 energy</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <Text style={styles.statsText}>
                Wins: {battleStats.pvp.wins}
              </Text>
              <Text style={styles.statsText}>
                Losses: {battleStats.pvp.losses}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.enterButton, styles.pvpButton]}
              onPress={() => handleModeSelect('pvp', 20)}
            >
              <Text style={styles.enterButtonText}>ENTER ARENA</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        <Card style={styles.modeCard}>
          <Card.Content>
            <Text style={styles.modeIcon}>🤖</Text>
            <Text style={styles.modeName}>Bot Arena</Text>
            <Text style={styles.modeDescription}>
              Practice against AI with lower stakes
            </Text>
            
            <View style={styles.modeDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>💎 Gems:</Text>
                <Text style={styles.detailValue}>4-14</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>⚡ Cost:</Text>
                <Text style={styles.detailValue}>10 energy</Text>
              </View>
            </View>

            <View style={styles.botStatsGrid}>
              <Text style={styles.botStatText}>
                Easy: {battleStats.bot.easy.wins}-{battleStats.bot.easy.losses}
              </Text>
              <Text style={styles.botStatText}>
                Med: {battleStats.bot.medium.wins}-{battleStats.bot.medium.losses}
              </Text>
              <Text style={styles.botStatText}>
                Hard: {battleStats.bot.hard.wins}-{battleStats.bot.hard.losses}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.enterButton, styles.botButton]}
              onPress={() => handleModeSelect('bot', 10)}
            >
              <Text style={styles.enterButtonText}>START PRACTICE</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        <Card style={styles.modeCard}>
          <Card.Content>
            <Text style={styles.modeIcon}>🏃</Text>
            <Text style={styles.modeName}>Pet Runner</Text>
            <Text style={styles.modeDescription}>
              Endless obstacle course challenge
            </Text>
            
            <View style={styles.modeDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>💎 Gems:</Text>
                <Text style={styles.detailValue}>5-25</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>⚡ Cost:</Text>
                <Text style={styles.detailValue}>5 energy</Text>
              </View>
            </View>

            <View style={styles.runnerStats}>
              <Text style={styles.statsText}>
                High Score: {battleStats.runner.highScore}
              </Text>
              <Text style={styles.dailyGems}>
                Today: {battleStats.runner.dailyGems}/50 gems
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.enterButton, styles.runnerButton]}
              onPress={() => handleModeSelect('runner', 5)}
            >
              <Text style={styles.enterButtonText}>PLAY GAME</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>

      </View>

      <View style={{ height: 40 }} />

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
  header: {
    backgroundColor: COLORS.PRIMARY,
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  energyCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -20,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  energyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  energyLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  energyBarContainer: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 5,
  },
  energyFill: {
    height: '100%',
    backgroundColor: COLORS.SUCCESS,
  },
  energyValue: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  modesContainer: {
    padding: 20,
  },
  modeCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
  },
  modeIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 10,
  },
  modeName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  modeDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  modeDetails: {
    backgroundColor: COLORS.SECONDARY,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  statsText: {
    fontSize: 13,
    color: '#666',
  },
  botStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  botStatText: {
    fontSize: 12,
    color: '#666',
  },
  runnerStats: {
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  dailyGems: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  enterButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  pvpButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  botButton: {
    backgroundColor: '#5D9CEC',
  },
  runnerButton: {
    backgroundColor: '#A463BF',
  },
  enterButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
