import React, { useContext, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BattleContext } from '../context/BattleContext';
import { PetContext } from '../context/PetContext';
import { COLORS } from '../data/constants';

export default function RunnerGameScreen({ navigation }) {
  const { energy, consumeEnergy, hasEnoughEnergy, maxEnergy } = useContext(BattleContext);
  const { pet } = useContext(PetContext);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const ENERGY_COST = 5;

  const handleStartGame = async () => {
    if (!hasEnoughEnergy(ENERGY_COST)) {
      setSnackbarMessage(`Need ${ENERGY_COST} energy to play`);
      setSnackbarVisible(true);
      return;
    }

    setSnackbarMessage('Pet Runner game coming soon! Check back later.');
    setSnackbarVisible(true);
  };

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
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="diamond-stone" size={20} color={COLORS.WARNING} />
              <Text style={styles.infoText}>Earn: 1 gem per 10 points</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.gamePreviewCard}>
          <Card.Content>
            <Text style={styles.previewTitle}>How to Play</Text>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionIcon}>🏃</Text>
              <Text style={styles.instructionText}>
                Your pet runs automatically through an endless course
              </Text>
            </View>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionIcon}>⬆️</Text>
              <Text style={styles.instructionText}>
                Tap to jump over obstacles
              </Text>
            </View>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionIcon}>💎</Text>
              <Text style={styles.instructionText}>
                Collect gems along the way
              </Text>
            </View>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionIcon}>🏆</Text>
              <Text style={styles.instructionText}>
                Score points to beat your high score
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.statsTitle}>Your Stats</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>High Score:</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Today's Gems:</Text>
              <Text style={styles.statValue}>0/50</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Runs:</Text>
              <Text style={styles.statValue}>0</Text>
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
          {hasEnoughEnergy(ENERGY_COST) ? 'Start Running!' : `Need ${ENERGY_COST - energy} More Energy`}
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
  instructionText: {
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
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
