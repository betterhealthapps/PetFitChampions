import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, Button, Snackbar, Chip } from 'react-native-paper';
import { PetContext } from '../context/PetContext';
import { STARTER_PETS } from '../data/petTemplates';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export default function PetSelectionScreen({ navigation, route }) {
  const { selectPet } = useContext(PetContext);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Multi-pet state
  const [mode, setMode] = useState('select');
  const [ownedPets, setOwnedPets] = useState([]);
  const [activePetIndex, setActivePetIndex] = useState(0);
  const [petSlots, setPetSlots] = useState(1);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    checkExistingPets();
  }, []);

  const checkExistingPets = async () => {
    try {
      if (!auth.currentUser) {
        setMode('select');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      
      if (!userDoc.exists()) {
        setMode('select');
        return;
      }

      const data = userDoc.data();
      
      if (data.pets && data.pets.length > 0) {
        setMode('switch');
        setOwnedPets(data.pets);
        setActivePetIndex(data.activePetIndex || 0);
        setPetSlots(data.petSlots || 1);
        setIsPremium((data.subscription?.tier || 'free') !== 'free');
      } else {
        setMode('select');
      }
    } catch (error) {
      console.error('Error checking pets:', error);
      setMode('select');
    }
  };

  const handleSelectPet = async (petId) => {
    setSelectedPetId(petId);
    console.log('Pet selected:', petId);
  };

  const handleConfirmSelection = async () => {
    if (!selectedPetId) {
      setSnackbarMessage('Please select a pet first!');
      setSnackbarVisible(true);
      return;
    }

    try {
      console.log('Confirming pet selection:', selectedPetId);
      
      const petTemplate = STARTER_PETS[selectedPetId.toUpperCase()];
      
      if (!petTemplate) {
        Alert.alert('Error', 'Invalid pet selection. Please try again.');
        return;
      }

      await selectPet(selectedPetId);

      setSnackbarMessage(`${petTemplate.name} joined your team!`);
      setSnackbarVisible(true);
      
      setTimeout(() => {
        navigation.replace('MainTabs');
      }, 1500);

    } catch (error) {
      console.error('Pet selection error:', error);
      Alert.alert('Error', 'Failed to select pet: ' + error.message);
    }
  };

  const handleSwitchPet = async (index) => {
    if (index === activePetIndex) {
      Alert.alert('Already Active', 'This pet is already your active pet!');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        activePetIndex: index,
      });

      setActivePetIndex(index);
      Alert.alert('Pet Switched!', `${ownedPets[index].name} is now your active pet!`);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAddPet = () => {
    if (!isPremium && petSlots >= 1) {
      Alert.alert(
        'Premium Required',
        'Additional pet slots require Premium membership!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go Premium', onPress: () => navigation.navigate('Subscription') },
        ]
      );
      return;
    }

    navigation.navigate('PetShop');
  };

  const renderPetCard = (petKey) => {
    const pet = STARTER_PETS[petKey];
    const isSelected = selectedPetId === pet.id;

    return (
      <Card 
        key={pet.id}
        style={[styles.petCard, isSelected && styles.selectedCard]}
        onPress={() => handleSelectPet(pet.id)}
      >
        <Card.Content>
          <View style={styles.petHeader}>
            <Text style={styles.petEmoji}>{pet.emoji}</Text>
            <View style={styles.petInfo}>
              <Title style={styles.petName}>{pet.name}</Title>
              <Text style={styles.petType}>Type: {pet.type}</Text>
            </View>
          </View>
          
          <Text style={styles.petDescription}>{pet.description}</Text>
          
          <Text style={styles.statsTitle}>Base Stats:</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>❤️</Text>
              <Text style={styles.statText}>{pet.baseStats.health}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>⚡</Text>
              <Text style={styles.statText}>{pet.baseStats.energy}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>💪</Text>
              <Text style={styles.statText}>{pet.baseStats.strength}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🛡️</Text>
              <Text style={styles.statText}>{pet.baseStats.defense}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🏃</Text>
              <Text style={styles.statText}>{pet.baseStats.stamina}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🎯</Text>
              <Text style={styles.statText}>{pet.baseStats.agility}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>⚔️</Text>
              <Text style={styles.statText}>{pet.baseStats.attack}</Text>
            </View>
          </View>
          
          {isSelected && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedText}>✓ Selected</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderOwnedPetCard = (pet, index) => {
    const isActive = index === activePetIndex;

    return (
      <Card 
        key={index}
        style={[styles.petCard, isActive && styles.activeCard]}
        onPress={() => handleSwitchPet(index)}
      >
        <Card.Content>
          <View style={styles.petHeader}>
            <Text style={styles.petEmoji}>{pet.icon}</Text>
            <View style={styles.petInfo}>
              <Title style={styles.petName}>{pet.name}</Title>
              <Text style={styles.petType}>Level {pet.level} • Tier {pet.evolutionTier || 1}</Text>
            </View>
            {isActive && (
              <Chip style={styles.activeChip} textStyle={styles.activeChipText}>
                ACTIVE
              </Chip>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderEmptySlot = (index) => {
    return (
      <Card key={`empty-${index}`} style={styles.emptySlotCard}>
        <Card.Content style={styles.emptySlotContent}>
          <Text style={styles.emptySlotIcon}>➕</Text>
          <Title style={styles.emptySlotText}>Add New Pet</Title>
          {!isPremium && (
            <Text style={styles.requirementText}>Premium Required</Text>
          )}
          <Button 
            mode="outlined" 
            onPress={handleAddPet}
            style={styles.addPetButton}
          >
            {isPremium ? 'Add Pet' : 'Upgrade'}
          </Button>
        </Card.Content>
      </Card>
    );
  };

  const renderLockedSlot = (index) => {
    return (
      <Card key={`locked-${index}`} style={styles.lockedSlotCard}>
        <Card.Content style={styles.emptySlotContent}>
          <Text style={styles.emptySlotIcon}>🔒</Text>
          <Title style={styles.emptySlotText}>Locked</Title>
          <Text style={styles.requirementText}>500 Gems</Text>
          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('GemShop')}
            style={styles.addPetButton}
          >
            Unlock
          </Button>
        </Card.Content>
      </Card>
    );
  };

  // SWITCH MODE (existing pets)
  if (mode === 'switch') {
    return (
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Title style={styles.title}>Your Pets</Title>
          <Text style={styles.subtitle}>
            Tap to switch • {ownedPets.length}/{petSlots} slots
          </Text>

          {ownedPets.map((pet, index) => renderOwnedPetCard(pet, index))}
          {Array.from({ length: petSlots - ownedPets.length }).map((_, i) => renderEmptySlot(i))}
          {Array.from({ length: 3 - petSlots }).map((_, i) => renderLockedSlot(i))}

          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={styles.confirmButton}
            icon="arrow-left"
          >
            Back
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

  // SELECT MODE (first time)
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.content}>
        <Title style={styles.title}>Choose Your Starter Pet</Title>
        <Text style={styles.subtitle}>
          Select a companion to start your fitness journey!
        </Text>

        {renderPetCard('VIGOR')}
        {renderPetCard('ZEN')}
        {renderPetCard('ATLAS')}
        {renderPetCard('SWIFT')}
        {renderPetCard('AERO')}

        <Button
          mode="contained"
          onPress={handleConfirmSelection}
          style={styles.confirmButton}
          icon="check"
          disabled={!selectedPetId}
        >
          Confirm Selection
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
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40, // Extra padding at bottom
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  petCard: {
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#6200ee',
    backgroundColor: '#f3e5f5',
  },
  activeCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  petEmoji: {
    fontSize: 60,
    marginRight: 16,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 24,
    marginBottom: 4,
  },
  petType: {
    fontSize: 14,
    color: '#666',
  },
  petDescription: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 8,
  },
  statEmoji: {
    fontSize: 20,
  },
  statText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  selectedBadge: {
    backgroundColor: '#6200ee',
    padding: 8,
    borderRadius: 4,
    marginTop: 12,
    alignItems: 'center',
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  activeChip: {
    backgroundColor: '#4CAF50',
  },
  activeChipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  confirmButton: {
    marginTop: 8,
    marginBottom: 32,
  },
  emptySlotCard: {
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#CCC',
    borderStyle: 'dashed',
    backgroundColor: '#FAFAFA',
  },
  lockedSlotCard: {
    marginBottom: 16,
    backgroundColor: '#EFEFEF',
    opacity: 0.8,
  },
  emptySlotContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptySlotIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  emptySlotText: {
    fontSize: 18,
    marginBottom: 5,
  },
  requirementText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  addPetButton: {
    marginTop: 5,
  },
});
