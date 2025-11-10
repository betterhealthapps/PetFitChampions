import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, Button, List } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { PetContext } from '../context/PetContext';

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);
  const { pet, gems } = useContext(PetContext);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: () => logout(),
          style: 'destructive'
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* User Info Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.username}>{user.username}</Title>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.memberSince}>
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </Text>
          </Card.Content>
        </Card>

        {/* Stats Summary */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Your Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{pet?.level || 1}</Text>
                <Text style={styles.statLabel}>Pet Level</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{gems || 0}</Text>
                <Text style={styles.statLabel}>Gems</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{pet?.xp || 0}</Text>
                <Text style={styles.statLabel}>Total XP</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{pet?.tier || 1}</Text>
                <Text style={styles.statLabel}>Pet Tier</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Current Pet */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Current Pet</Text>
            <View style={styles.petRow}>
              <Text style={styles.petEmoji}>{pet?.emoji || '🐕'}</Text>
              <View>
                <Text style={styles.petName}>{pet?.name || 'Vigor'}</Text>
                <Text style={styles.petType}>Level {pet?.level || 1} {pet?.type || 'Dog'}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* App Info */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>About PetFit Champions</Text>
            <List.Item
              title="Version"
              description="1.0.0 - MVP"
              left={props => <List.Icon {...props} icon="information" />}
            />
            <List.Item
              title="Track Health"
              description="Log activities to earn XP"
              left={props => <List.Icon {...props} icon="heart" />}
            />
            <List.Item
              title="Level Up Pets"
              description="Grow stronger with your companion"
              left={props => <List.Icon {...props} icon="star" />}
            />
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <Button 
          mode="contained" 
          onPress={handleLogout}
          style={styles.logoutButton}
          icon="logout"
        >
          Logout
        </Button>
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
  username: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  petRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petEmoji: {
    fontSize: 60,
    marginRight: 16,
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  petType: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 6,
  },
});
