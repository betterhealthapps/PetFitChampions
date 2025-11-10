import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Card, Title, Text, Button, List } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { PetContext } from '../context/PetContext';
import { getProfileData } from '../utils/storage';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const { pet, gems } = useContext(PetContext);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    loadProfile();
    const unsubscribe = navigation.addListener('focus', () => {
      loadProfile();
    });
    return unsubscribe;
  }, [navigation]);

  const loadProfile = async () => {
    const data = await getProfileData();
    setProfileData(data);
  };

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
            <View style={styles.profileHeader}>
              {profileData?.photoURL ? (
                <Image source={{ uri: profileData.photoURL }} style={styles.profilePhoto} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.photoPlaceholderText}>
                    {user?.username?.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.profileInfo}>
                <Title style={styles.username}>{profileData?.displayName || user.username}</Title>
                {profileData?.bio ? (
                  <Text style={styles.bio}>{profileData.bio}</Text>
                ) : null}
                <Text style={styles.email}>{user.email}</Text>
                <Text style={styles.memberSince}>
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('ProfileEdit')}
              style={styles.editButton}
              icon="pencil"
            >
              Edit Profile
            </Button>
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

        {/* Gem Shop */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Shop</Text>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('GemShop')}
              style={styles.shopButton}
              icon="store"
            >
              💎 Gem Shop
            </Button>
            <Text style={styles.shopDescription}>
              Buy cosmetics, stat boosts, battle tricks, and pet slots
            </Text>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#5EB8C6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  photoPlaceholderText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 12,
    color: '#888',
  },
  editButton: {
    backgroundColor: '#32808D',
    marginTop: 8,
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
  shopButton: {
    marginBottom: 8,
  },
  shopDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});
