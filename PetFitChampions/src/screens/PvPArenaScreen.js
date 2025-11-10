import React, { useContext, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button, ProgressBar, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BattleContext } from '../context/BattleContext';
import { PetContext } from '../context/PetContext';
import { BATTLE_CONSTANTS, COLORS } from '../data/constants';
import { generateOpponent } from '../utils/battleLogic';

export default function PvPArenaScreen({ navigation }) {
  const { energy, consumeEnergy, hasEnoughEnergy, maxEnergy } = useContext(BattleContext);
  const { pet } = useContext(PetContext);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searching, setSearching] = useState(false);

  const handleFindOpponent = async () => {
    if (!hasEnoughEnergy(BATTLE_CONSTANTS.ENERGY_COST)) {
      setSnackbarMessage(`Need ${BATTLE_CONSTANTS.ENERGY_COST} energy to battle`);
      setSnackbarVisible(true);
      return;
    }

    setSearching(true);
    
    setTimeout(async () => {
      try {
        await consumeEnergy(BATTLE_CONSTANTS.ENERGY_COST);
        const opponent = generateOpponent(pet);
        
        navigation.navigate('PvPBattle', { opponent });
      } catch (error) {
        setSnackbarMessage(error.message);
        setSnackbarVisible(true);
      } finally {
        setSearching(false);
      }
    }, 1500);
  };

  const energyPercentage = energy / maxEnergy;
  const canBattle = hasEnoughEnergy(BATTLE_CONSTANTS.ENERGY_COST);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <MaterialCommunityIcons name="sword-cross" size={48} color={COLORS.PRIMARY} />
              <Title style={styles.title}>Battle Arena</Title>
            </View>
            
            <Text style={styles.subtitle}>Test your pet in PvP battles!</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.energySection}>
              <View style={styles.energyHeader}>
                <MaterialCommunityIcons name="lightning-bolt" size={24} color={COLORS.WARNING} />
                <Text style={styles.energyTitle}>Energy: {energy}/{maxEnergy}</Text>
              </View>
              <ProgressBar 
                progress={energyPercentage} 
                color={energy < BATTLE_CONSTANTS.ENERGY_COST ? COLORS.ERROR : COLORS.SUCCESS}
                style={styles.energyBar}
              />
              <Text style={styles.energyInfo}>
                {energy < maxEnergy ? `Regenerates 1 energy per minute` : 'Energy full!'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{pet?.name || 'Your Pet'}</Text>
              <Text style={styles.petLevel}>Level {pet?.level || 1} - Tier {pet?.tier || 1}</Text>
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Health</Text>
                  <Text style={styles.statValue}>{pet?.stats?.health || 0}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Attack</Text>
                  <Text style={styles.statValue}>{pet?.stats?.attack || 0}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Defense</Text>
                  <Text style={styles.statValue}>{pet?.stats?.defense || 0}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Strength</Text>
                  <Text style={styles.statValue}>{pet?.stats?.strength || 0}</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoTitle}>Battle Rules</Text>
            <Text style={styles.infoText}>• Costs {BATTLE_CONSTANTS.ENERGY_COST} energy per battle</Text>
            <Text style={styles.infoText}>• Win: +{BATTLE_CONSTANTS.VICTORY_GEM_REWARD} gems</Text>
            <Text style={styles.infoText}>• Lose: -{BATTLE_CONSTANTS.DEFEAT_GEM_LOSS} gems</Text>
            <Text style={styles.infoText}>• Turn-based combat</Text>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleFindOpponent}
          loading={searching}
          disabled={!canBattle || searching}
          icon="magnify"
          style={styles.findButton}
          contentStyle={styles.findButtonContent}
          labelStyle={styles.findButtonLabel}
        >
          {searching ? 'Finding Opponent...' : canBattle ? 'Find Opponent' : `Need ${BATTLE_CONSTANTS.ENERGY_COST - energy} More Energy`}
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
    backgroundColor: COLORS.SECONDARY,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  energySection: {
    marginTop: 8,
  },
  energyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  energyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: COLORS.TEXT_PRIMARY,
  },
  energyBar: {
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  energyInfo: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  petInfo: {
    alignItems: 'center',
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 4,
  },
  petLevel: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    width: '45%',
    marginVertical: 8,
    padding: 12,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  infoCard: {
    marginBottom: 24,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    marginVertical: 4,
  },
  findButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 12,
    elevation: 4,
  },
  findButtonContent: {
    paddingVertical: 8,
  },
  findButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
