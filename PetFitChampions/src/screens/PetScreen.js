import React, { useContext, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, ProgressBar, Button, Snackbar } from 'react-native-paper';
import { PetContext } from '../context/PetContext';
import { EVOLUTION_TIERS } from '../data/constants';

export default function PetScreen() {
  const { pet, gems, getLevelProgress, evolvePet } = useContext(PetContext);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const levelProgress = getLevelProgress();
  const stats = pet.stats || {};
  const currentTier = pet.tier || 1;
  
  // Evolution eligibility
  const canEvolveTo2 = currentTier === 1 && pet.level >= 16;
  const canEvolveTo3 = currentTier === 2 && pet.level >= 36;
  const canEvolve = canEvolveTo2 || canEvolveTo3;
  const evolutionCost = canEvolveTo2 ? EVOLUTION_TIERS.TIER_2.cost : EVOLUTION_TIERS.TIER_3.cost;
  const hasEnoughGems = gems >= evolutionCost;

  const handleEvolution = () => {
    if (!canEvolve) return;
    
    Alert.alert(
      'Evolve Pet?',
      `Evolve to Tier ${currentTier + 1} for ${evolutionCost} gems?\nThis will boost all stats by 50%!`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Evolve',
          onPress: async () => {
            try {
              await evolvePet(evolutionCost);
              setSnackbarMessage(`🎉 Evolved to Tier ${currentTier + 1}! Stats increased by 50%!`);
              setSnackbarVisible(true);
            } catch (error) {
              setSnackbarMessage(error.message);
              setSnackbarVisible(true);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Pet Header */}
        <Card style={styles.card}>
          <Card.Content style={styles.petHeader}>
            <Text style={styles.petEmoji}>{pet.emoji}</Text>
            <View style={styles.petInfo}>
              <Title style={styles.petName}>{pet.name}</Title>
              <Text style={styles.petType}>Level {pet.level} {pet.type}</Text>
              <Text style={styles.petDescription}>{pet.description}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Level Progress */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Level Progress</Text>
            <View style={styles.progressInfo}>
              <Text>Level {pet.level}</Text>
              <Text>{Math.floor(levelProgress.current)} / {levelProgress.needed} XP</Text>
            </View>
            <ProgressBar 
              progress={levelProgress.percentage / 100} 
              color="#6200ee"
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>
              {Math.floor(levelProgress.percentage)}% to Level {pet.level + 1}
            </Text>
          </Card.Content>
        </Card>

        {/* Gems */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.gemsContainer}>
              <Text style={styles.gemsIcon}>💎</Text>
              <View>
                <Text style={styles.gemsValue}>{gems}</Text>
                <Text style={styles.gemsLabel}>Gems</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Stats */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Stats</Text>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>❤️ Health</Text>
              <Text style={styles.statValue}>{stats.health || 0}</Text>
            </View>
            <ProgressBar progress={(stats.health || 0) / 100} color="#e53935" />

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>⚡ Energy</Text>
              <Text style={styles.statValue}>{stats.energy || 0}</Text>
            </View>
            <ProgressBar progress={(stats.energy || 0) / 100} color="#fdd835" />

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>💪 Strength</Text>
              <Text style={styles.statValue}>{stats.strength || 0}</Text>
            </View>
            <ProgressBar progress={(stats.strength || 0) / 100} color="#fb8c00" />

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>🛡️ Defense</Text>
              <Text style={styles.statValue}>{stats.defense || 0}</Text>
            </View>
            <ProgressBar progress={(stats.defense || 0) / 100} color="#43a047" />

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>🏃 Stamina</Text>
              <Text style={styles.statValue}>{stats.stamina || 0}</Text>
            </View>
            <ProgressBar progress={(stats.stamina || 0) / 100} color="#1e88e5" />

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>🎯 Agility</Text>
              <Text style={styles.statValue}>{stats.agility || 0}</Text>
            </View>
            <ProgressBar progress={(stats.agility || 0) / 100} color="#8e24aa" />

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>⚔️ Attack</Text>
              <Text style={styles.statValue}>{stats.attack || 0}</Text>
            </View>
            <ProgressBar progress={(stats.attack || 0) / 100} color="#d32f2f" />
          </Card.Content>
        </Card>

        {/* Evolution */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Evolution</Text>
            <Text style={styles.tierText}>
              Tier {currentTier} - {currentTier === 1 ? 'Basic' : currentTier === 2 ? 'Advanced' : 'Master'}
            </Text>
            
            {canEvolve && (
              <View style={styles.evolutionContainer}>
                <Text style={styles.evolutionText}>
                  Ready to evolve to Tier {currentTier + 1}!
                </Text>
                <Text style={styles.evolutionCost}>Cost: {evolutionCost} gems</Text>
                <Text style={styles.evolutionBonus}>+50% to all stats!</Text>
                <Button
                  mode="contained"
                  onPress={handleEvolution}
                  disabled={!hasEnoughGems}
                  icon="star"
                  style={styles.evolutionButton}
                >
                  {hasEnoughGems ? 'Evolve Now' : `Need ${evolutionCost - gems} more gems`}
                </Button>
              </View>
            )}
            
            {!canEvolve && currentTier < 3 && (
              <Text style={styles.tierInfo}>
                {currentTier === 1 && `Reach level 16 to unlock Tier 2 evolution (${EVOLUTION_TIERS.TIER_2.cost} gems)`}
                {currentTier === 2 && `Reach level 36 to unlock Tier 3 evolution (${EVOLUTION_TIERS.TIER_3.cost} gems)`}
              </Text>
            )}
            
            {currentTier === 3 && (
              <Text style={styles.tierInfo}>Maximum tier reached! 🏆</Text>
            )}
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
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petEmoji: {
    fontSize: 80,
    marginRight: 16,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 28,
  },
  petType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  petDescription: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    marginVertical: 8,
  },
  progressText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 4,
  },
  gemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gemsIcon: {
    fontSize: 60,
    marginRight: 16,
  },
  gemsValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  gemsLabel: {
    fontSize: 18,
    color: '#666',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tierText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tierInfo: {
    fontSize: 14,
    color: '#666',
  },
  evolutionContainer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#f3e5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  evolutionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
  },
  evolutionCost: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  evolutionBonus: {
    fontSize: 14,
    color: '#43a047',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  evolutionButton: {
    marginTop: 8,
  },
});
