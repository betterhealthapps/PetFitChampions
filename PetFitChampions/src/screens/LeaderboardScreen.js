import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { PetContext } from '../context/PetContext';
import { getLeaderboardData, getBattleStats } from '../utils/storage';

const generateAICompetitors = (userScore, category) => {
  const names = [
    'Dragon Master', 'Thunder King', 'Shadow Ninja', 'Storm Rider',
    'Ice Queen', 'Fire Wolf', 'Star Chaser', 'Moon Walker',
    'Lightning Fox', 'Wind Dancer'
  ];

  const competitors = names.map((name, index) => {
    let score;
    const variance = Math.random() * 0.3 + 0.85;
    
    switch (category) {
      case 'overall':
        score = Math.floor((userScore + Math.random() * 5000) * variance);
        break;
      case 'battles':
        score = Math.floor((userScore + Math.random() * 50) * variance);
        break;
      case 'streak':
        score = Math.floor((userScore + Math.random() * 20) * variance);
        break;
      case 'weekly':
        score = Math.floor((userScore + Math.random() * 2000) * variance);
        break;
      default:
        score = 0;
    }

    return {
      name,
      score: Math.max(0, score),
      isUser: false,
    };
  });

  return competitors;
};

export default function LeaderboardScreen() {
  const { pet } = useContext(PetContext);
  const [activeTab, setActiveTab] = useState('overall');
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadLeaderboardData();
  }, [activeTab, pet]);

  const loadLeaderboardData = async () => {
    const lbData = await getLeaderboardData();
    const battleStats = await getBattleStats();

    let userScore = 0;
    let userName = pet?.name || 'You';

    switch (activeTab) {
      case 'overall':
        userScore = lbData.totalXP || pet?.xp || 0;
        break;
      case 'battles':
        userScore = battleStats.pvp?.wins || 0;
        break;
      case 'streak':
        userScore = lbData.bestStreak || 0;
        break;
      case 'weekly':
        userScore = lbData.weeklyXP || 0;
        break;
    }

    const userEntry = {
      name: userName,
      score: userScore,
      isUser: true,
    };

    const aiCompetitors = generateAICompetitors(userScore, activeTab);
    const allEntries = [...aiCompetitors, userEntry];
    allEntries.sort((a, b) => b.score - a.score);

    const userPosition = allEntries.findIndex(entry => entry.isUser) + 1;

    setLeaderboard(allEntries.slice(0, 10));
    setUserRank(userPosition);
    setUserData(userEntry);
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getScoreLabel = () => {
    switch (activeTab) {
      case 'overall':
        return 'Total XP';
      case 'battles':
        return 'Wins';
      case 'streak':
        return 'Best Streak';
      case 'weekly':
        return 'Weekly XP';
      default:
        return 'Score';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏆 Leaderboard</Text>
        <Text style={styles.headerSubtitle}>Your Rank: {getRankIcon(userRank)}</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overall' && styles.activeTab]}
          onPress={() => setActiveTab('overall')}
        >
          <Text style={[styles.tabText, activeTab === 'overall' && styles.activeTabText]}>
            📊 Overall XP
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'battles' && styles.activeTab]}
          onPress={() => setActiveTab('battles')}
        >
          <Text style={[styles.tabText, activeTab === 'battles' && styles.activeTabText]}>
            ⚔️ Battle Wins
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'streak' && styles.activeTab]}
          onPress={() => setActiveTab('streak')}
        >
          <Text style={[styles.tabText, activeTab === 'streak' && styles.activeTabText]}>
            🔥 Streak
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
          onPress={() => setActiveTab('weekly')}
        >
          <Text style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}>
            📅 Weekly
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.categoryTitle}>{getScoreLabel()} Rankings</Text>
            
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              const isUser = entry.isUser;

              return (
                <View 
                  key={index}
                  style={[
                    styles.rankRow,
                    isUser && styles.userRankRow
                  ]}
                >
                  <View style={styles.rankLeft}>
                    <Text style={[styles.rankNumber, isUser && styles.userText]}>
                      {getRankIcon(rank)}
                    </Text>
                    <Text style={[styles.playerName, isUser && styles.userText]}>
                      {entry.name}
                      {isUser && ' (You)'}
                    </Text>
                  </View>
                  <Text style={[styles.score, isUser && styles.userText]}>
                    {entry.score.toLocaleString()}
                  </Text>
                </View>
              );
            })}

            {userRank > 10 && (
              <View style={styles.userPosition}>
                <Text style={styles.userPositionText}>Your Position:</Text>
                <View style={[styles.rankRow, styles.userRankRow]}>
                  <View style={styles.rankLeft}>
                    <Text style={[styles.rankNumber, styles.userText]}>
                      {getRankIcon(userRank)}
                    </Text>
                    <Text style={[styles.playerName, styles.userText]}>
                      {userData.name} (You)
                    </Text>
                  </View>
                  <Text style={[styles.score, styles.userText]}>
                    {userData.score.toLocaleString()}
                  </Text>
                </View>
              </View>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoTitle}>💡 How to Climb the Ranks</Text>
            {activeTab === 'overall' && (
              <Text style={styles.infoText}>
                • Track health activities daily to earn XP{'\n'}
                • Complete all 8 tasks for bonus XP{'\n'}
                • Level up your pet for more power
              </Text>
            )}
            {activeTab === 'battles' && (
              <Text style={styles.infoText}>
                • Win PvP battles to increase your score{'\n'}
                • Upgrade stats for better performance{'\n'}
                • Unlock battle traits for special abilities
              </Text>
            )}
            {activeTab === 'streak' && (
              <Text style={styles.infoText}>
                • Log activities every day to maintain streak{'\n'}
                • Consistency is key to long streaks{'\n'}
                • Don't break the chain!
              </Text>
            )}
            {activeTab === 'weekly' && (
              <Text style={styles.infoText}>
                • Earn XP this week to climb rankings{'\n'}
                • Leaderboard resets every Monday{'\n'}
                • Push hard for weekly rewards
              </Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#32808D',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#FFD700',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#32808D',
  },
  tabText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#32808D',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  rankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  userRankRow: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#32808D',
  },
  rankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 50,
    color: '#666',
  },
  playerName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#32808D',
  },
  userText: {
    color: '#32808D',
    fontWeight: 'bold',
  },
  userPosition: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#E0E0E0',
  },
  userPositionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 12,
  },
  infoCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: '#FFF9E6',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});
