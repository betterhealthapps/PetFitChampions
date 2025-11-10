import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { PetContext } from '../context/PetContext';
import { HealthContext } from '../context/HealthContext';
import { BattleContext } from '../context/BattleContext';
import { COLORS } from '../data/constants';

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { pet, gems, getLevelProgress } = useContext(PetContext);
  const { getTodayActivityCount, getTodayXP } = useContext(HealthContext);
  const { energy, maxEnergy } = useContext(BattleContext);

  if (!user || !pet) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  const levelProgress = getLevelProgress();
  const activityCount = getTodayActivityCount();
  const todayXP = getTodayXP();
  const energyPercent = (energy / maxEnergy) * 100;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.welcome}>Welcome, {user.username}! 👋</Title>
        
        {/* Pet Display Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.petHeader}>
              <MaterialCommunityIcons name="paw" size={64} color={COLORS.PRIMARY} />
              <View style={styles.petInfo}>
                <Title style={styles.petName}>{pet.name}</Title>
                <Text style={styles.petType}>Level {pet.level} • Tier {pet.tier || 1}</Text>
                <View style={styles.resourceRow}>
                  <View style={styles.resource}>
                    <MaterialCommunityIcons name="diamond-stone" size={16} color={COLORS.WARNING} />
                    <Text style={styles.resourceText}>{gems}</Text>
                  </View>
                  <View style={styles.resource}>
                    <MaterialCommunityIcons name="lightning-bolt" size={16} color={COLORS.WARNING} />
                    <Text style={styles.resourceText}>{energy}/{maxEnergy}</Text>
                  </View>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* XP Progress Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Level Progress</Text>
            <View style={styles.progressInfo}>
              <Text>{Math.floor(levelProgress.current)} / {levelProgress.needed} XP</Text>
              <Text>{Math.floor(levelProgress.percentage)}%</Text>
            </View>
            <ProgressBar 
              progress={levelProgress.percentage / 100} 
              color={COLORS.PRIMARY}
              style={styles.progressBar}
            />
          </Card.Content>
        </Card>

        {/* Today's Activities Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Today's Progress</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{activityCount}</Text>
                <Text style={styles.statLabel}>Activities</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{todayXP}</Text>
                <Text style={styles.statLabel}>XP Earned</Text>
              </View>
            </View>
            
            <View style={styles.buttonRow}>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('Track')}
                style={styles.actionButton}
                icon="plus"
              >
                Track Activity
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => navigation.navigate('Battle')}
                style={styles.actionButton}
                icon="sword-cross"
              >
                Battle
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Tips Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>💡 Daily Tip</Text>
            <Text style={styles.tipText}>
              Complete all 8 health activities today to earn a 200 XP bonus!
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
    backgroundColor: COLORS.SECONDARY,
  },
  content: {
    padding: 16,
  },
  welcome: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petInfo: {
    flex: 1,
    marginLeft: 16,
  },
  petName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 4,
  },
  petType: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  resourceRow: {
    flexDirection: 'row',
    gap: 16,
  },
  resource: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resourceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    padding: 16,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 12,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.TEXT_PRIMARY,
  },
});
