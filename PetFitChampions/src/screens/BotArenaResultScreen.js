import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { COLORS } from '../data/constants';

export default function BotArenaResultScreen({ route, navigation }) {
  const { result, rewards, botName, difficulty, botStats } = route.params;
  const isVictory = result === 'victory';

  const difficultyInfo = {
    easy: { icon: '😊', color: COLORS.SUCCESS },
    medium: { icon: '😐', color: COLORS.WARNING },
    hard: { icon: '😈', color: COLORS.ERROR },
  };

  const diffInfo = difficultyInfo[difficulty] || difficultyInfo.medium;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Result Header */}
        <View style={[styles.resultHeader, { backgroundColor: isVictory ? COLORS.SUCCESS : COLORS.ERROR }]}>
          <Text style={styles.resultIcon}>{isVictory ? '🏆' : '💔'}</Text>
          <Text style={styles.resultTitle}>{isVictory ? 'VICTORY!' : 'DEFEAT'}</Text>
        </View>

        {/* Battle Info */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.battleInfo}>
              <Text style={styles.difficultyIcon}>{diffInfo.icon}</Text>
              <View>
                <Text style={styles.botName}>{botName}</Text>
                <Text style={[styles.difficulty, { color: diffInfo.color }]}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Bot
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Rewards */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Battle Rewards</Text>
            
            <View style={styles.rewardRow}>
              <View style={styles.rewardItem}>
                <Text style={styles.rewardIcon}>💎</Text>
                <View>
                  <Text style={[styles.rewardValue, { color: rewards.gems >= 0 ? COLORS.SUCCESS : COLORS.ERROR }]}>
                    {rewards.gems >= 0 ? '+' : ''}{rewards.gems}
                  </Text>
                  <Text style={styles.rewardLabel}>Gems</Text>
                </View>
              </View>

              <View style={styles.rewardItem}>
                <Text style={styles.rewardIcon}>⭐</Text>
                <View>
                  <Text style={[styles.rewardValue, { color: COLORS.SUCCESS }]}>
                    +{rewards.xp}
                  </Text>
                  <Text style={styles.rewardLabel}>XP</Text>
                </View>
              </View>
            </View>

            {isVictory && (
              <View style={styles.victoryBonus}>
                <Text style={styles.bonusText}>
                  🎉 Victory bonus applied! Keep practicing to master harder difficulties!
                </Text>
              </View>
            )}

            {!isVictory && (
              <View style={styles.defeatMessage}>
                <Text style={styles.defeatText}>
                  💪 Don't give up! Learn from this battle and try again!
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Stats */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Your Bot Arena Record</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Easy</Text>
                <Text style={styles.statValue}>
                  {botStats.easy.wins}W - {botStats.easy.losses}L
                </Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Medium</Text>
                <Text style={styles.statValue}>
                  {botStats.medium.wins}W - {botStats.medium.losses}L
                </Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Hard</Text>
                <Text style={styles.statValue}>
                  {botStats.hard.wins}W - {botStats.hard.losses}L
                </Text>
              </View>
            </View>

            <View style={styles.totalStats}>
              <Text style={styles.totalLabel}>Total Wins:</Text>
              <Text style={styles.totalValue}>
                {botStats.easy.wins + botStats.medium.wins + botStats.hard.wins}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.battleAgainButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Battle Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.menuButton]}
            onPress={() => navigation.navigate('BattleModeSelector')}
          >
            <Text style={styles.buttonText}>Battle Menu</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
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
    flex: 1,
  },
  resultHeader: {
    padding: 40,
    alignItems: 'center',
  },
  resultIcon: {
    fontSize: 80,
    marginBottom: 10,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
  },
  card: {
    margin: 15,
    elevation: 3,
  },
  battleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  difficultyIcon: {
    fontSize: 50,
  },
  botName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  difficulty: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rewardIcon: {
    fontSize: 40,
  },
  rewardValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  rewardLabel: {
    fontSize: 14,
    color: '#666',
  },
  victoryBonus: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  bonusText: {
    color: COLORS.SUCCESS,
    textAlign: 'center',
    fontSize: 14,
  },
  defeatMessage: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  defeatText: {
    color: COLORS.ERROR,
    textAlign: 'center',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  totalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    padding: 15,
    borderRadius: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  actions: {
    marginHorizontal: 15,
    gap: 10,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  battleAgainButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  menuButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
