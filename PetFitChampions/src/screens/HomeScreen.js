import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button, ProgressBar } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { PetContext } from '../context/PetContext';
import { HealthContext } from '../context/HealthContext';

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { pet, gems, getLevelProgress } = useContext(PetContext);
  const { getTodayActivityCount, getTodayXP } = useContext(HealthContext);

  if (!user || !pet) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  const levelProgress = getLevelProgress();
  const activityCount = getTodayActivityCount();
  const todayXP = getTodayXP();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.welcome}>Welcome, {user.username}! 👋</Title>
        
        {/* Pet Display Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.petHeader}>
              <Text style={styles.petEmoji}>{pet.emoji}</Text>
              <View style={styles.petInfo}>
                <Title>{pet.name}</Title>
                <Text>Level {pet.level} {pet.type}</Text>
                <Text style={styles.gems}>💎 {gems} Gems</Text>
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
              color="#6200ee"
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
            
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('Track')}
              style={styles.trackButton}
              icon="plus"
            >
              Track Activity
            </Button>
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
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  welcome: {
    fontSize: 24,
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petEmoji: {
    fontSize: 60,
    marginRight: 16,
  },
  petInfo: {
    flex: 1,
  },
  gems: {
    marginTop: 4,
    fontSize: 16,
    color: '#6200ee',
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  trackButton: {
    marginTop: 8,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
});
