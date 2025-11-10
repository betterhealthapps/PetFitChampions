import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, Button, Chip } from 'react-native-paper';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const PREMIUM_PETS = [
  {
    id: 'phoenix',
    name: 'Phoenix',
    emoji: '🔥🦅',
    type: 'Mythical Bird',
    cost: 500,
    description: 'Legendary firebird with resurrection powers',
  },
  {
    id: 'dragon',
    name: 'Dragon',
    emoji: '🐉',
    type: 'Legendary Dragon',
    cost: 750,
    description: 'Powerful dragon with fire breath ability',
  },
];

export default function PetShopScreen({ navigation }) {
  const [gems, setGems] = useState(0);
  const [ownedPets, setOwnedPets] = useState([]);
  const [petSlots, setPetSlots] = useState(1);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
    const data = userDoc.data();
    
    setGems(data.gems || 0);
    setOwnedPets(data.pets || []);
    setPetSlots(data.petSlots || 1);
    setIsPremium((data.subscription?.tier || 'free') !== 'free');
  };

  const handlePurchase = async (pet) => {
    if (!isPremium) {
      Alert.alert(
        'Premium Required',
        'Premium pets require Health Champion membership!',
        [
          { text: 'Cancel' },
          { text: 'Go Premium', onPress: () => navigation.navigate('Subscription') }
        ]
      );
      return;
    }

    if (ownedPets.some(p => p.id === pet.id)) {
      Alert.alert('Already Owned', 'You already have this pet!');
      return;
    }

    if (ownedPets.length >= petSlots) {
      Alert.alert('No Slots', 'Purchase additional pet slots in the Gem Shop!');
      return;
    }

    if (gems < pet.cost) {
      Alert.alert('Not Enough Gems', `You need ${pet.cost} gems. You have ${gems}.`);
      return;
    }

    Alert.alert(
      'Purchase Pet?',
      `Buy ${pet.name} for ${pet.cost} gems?`,
      [
        { text: 'Cancel' },
        {
          text: 'Purchase',
          onPress: async () => {
            const newPet = {
              id: pet.id,
              name: pet.name,
              icon: pet.emoji,
              level: 1,
              currentXP: 0,
              evolutionTier: 1,
              baseStats: { 
                health: 85, energy: 90, strength: 85, 
                defense: 80, stamina: 85, agility: 88, attack: 90 
              },
            };

            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
              pets: [...ownedPets, newPet],
              gems: increment(-pet.cost),
            });

            Alert.alert('Success!', `${pet.name} joined your team!`);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>Premium Pet Shop</Title>
        <Text style={styles.subtitle}>💎 Your Gems: {gems}</Text>

        {!isPremium && (
          <Card style={styles.promoCard}>
            <Card.Content>
              <Text style={styles.promoText}>
                ⭐ Premium pets require Health Champion membership
              </Text>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('Subscription')}
                style={styles.upgradeBtn}
              >
                Upgrade to Premium
              </Button>
            </Card.Content>
          </Card>
        )}

        {PREMIUM_PETS.map(pet => {
          const owned = ownedPets.some(p => p.id === pet.id);
          
          return (
            <Card key={pet.id} style={styles.petCard}>
              <Card.Content>
                <Chip style={styles.premiumBadge} textStyle={styles.premiumText}>
                  ⭐ PREMIUM
                </Chip>
                
                <View style={styles.petHeader}>
                  <Text style={styles.petEmoji}>{pet.emoji}</Text>
                  <View style={styles.petInfo}>
                    <Title>{pet.name}</Title>
                    <Text style={styles.petType}>{pet.type}</Text>
                  </View>
                </View>

                <Text style={styles.description}>{pet.description}</Text>

                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Cost:</Text>
                  <Text style={styles.priceValue}>{pet.cost} 💎</Text>
                </View>

                <Button
                  mode="contained"
                  onPress={() => handlePurchase(pet)}
                  disabled={!isPremium || owned}
                  style={styles.buyBtn}
                >
                  {owned ? '✓ Owned' : !isPremium ? '🔒 Premium Required' : `Buy ${pet.cost}💎`}
                </Button>
              </Card.Content>
            </Card>
          );
        })}

        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          icon="arrow-left"
        >
          Back
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 18, textAlign: 'center', color: '#32808D', fontWeight: 'bold', marginBottom: 16 },
  promoCard: { marginBottom: 16, backgroundColor: '#FFF3E0' },
  promoText: { textAlign: 'center', marginBottom: 10 },
  upgradeBtn: { marginTop: 5 },
  petCard: { marginBottom: 16, borderWidth: 2, borderColor: '#FFD700' },
  premiumBadge: { backgroundColor: '#FFD700', alignSelf: 'flex-start', marginBottom: 10 },
  premiumText: { color: '#333', fontWeight: 'bold' },
  petHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  petEmoji: { fontSize: 60, marginRight: 16 },
  petInfo: { flex: 1 },
  petType: { fontSize: 14, color: '#666' },
  description: { fontSize: 14, color: '#888', marginBottom: 12 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  priceLabel: { fontSize: 16, marginRight: 8 },
  priceValue: { fontSize: 18, fontWeight: 'bold', color: '#32808D' },
  buyBtn: { marginTop: 8 },
  backBtn: { marginTop: 16, marginBottom: 32 },
});
