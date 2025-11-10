import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, ProgressBar } from 'react-native-paper';
import { PetContext } from '../context/PetContext';

export default function PetScreen() {
  const { pet, gems, getLevelProgress } = useContext(PetContext);

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const levelProgress = getLevelProgress();
  const stats = pet.stats || {};

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

        {/* Tier Info */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Evolution</Text>
            <Text style={styles.tierText}>
              Tier {pet.tier || 1} - {pet.tier === 1 ? 'Basic' : pet.tier === 2 ? 'Advanced' : 'Master'}
            </Text>
            <Text style={styles.tierInfo}>
              {pet.level < 16 && 'Reach level 16 to unlock Tier 2 evolution (150 gems)'}
              {pet.level >= 16 && pet.level < 36 && 'Reach level 36 to unlock Tier 3 evolution (500 gems)'}
              {pet.level >= 36 && 'Maximum tier reached!'}
            </Text>
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
});
