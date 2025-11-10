import React, { useContext, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button, Snackbar } from 'react-native-paper';
import { PetContext } from '../context/PetContext';
import { STARTER_PETS } from '../data/petTemplates';

export default function PetSelectionScreen({ navigation }) {
  const { selectPet } = useContext(PetContext);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSelectPet = async (petId) => {
    setSelectedPetId(petId);
  };

  const handleConfirmSelection = async () => {
    if (!selectedPetId) {
      setSnackbarMessage('Please select a pet first!');
      setSnackbarVisible(true);
      return;
    }

    await selectPet(selectedPetId);
    setSnackbarMessage(`${STARTER_PETS[selectedPetId.toUpperCase()].name} joined your team!`);
    setSnackbarVisible(true);
    
    // Navigate to home after short delay
    setTimeout(() => {
      navigation.replace('MainTabs');
    }, 1500);
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>Choose Your Starter Pet</Title>
        <Text style={styles.subtitle}>
          Select a companion to start your fitness journey!
        </Text>

        {renderPetCard('VIGOR')}
        {renderPetCard('ZEN')}
        {renderPetCard('ATLAS')}
        {renderPetCard('SWIFT')}

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
  confirmButton: {
    marginTop: 8,
    marginBottom: 32,
  },
});
