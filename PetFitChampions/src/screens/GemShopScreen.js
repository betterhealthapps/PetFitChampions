import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { PetContext } from '../context/PetContext';
import { 
  getGems, saveGems, 
  getOwnedItems, saveOwnedItems,
  getEquippedCosmetics, saveEquippedCosmetics,
  getLearnedTricks, saveLearnedTricks,
  getPetSlots, savePetSlots,
  getPet, savePet
} from '../utils/storage';
import { COSMETICS, STAT_BOOSTS, BATTLE_TRICKS, PET_SLOT_ITEM, RARITY_COLORS } from '../data/shopItems';

export default function GemShopScreen({ navigation }) {
  const { currentPet, updatePet } = useContext(PetContext);
  const [activeTab, setActiveTab] = useState('cosmetics');
  const [userGems, setUserGems] = useState(0);
  const [ownedItems, setOwnedItems] = useState([]);
  const [equippedItems, setEquippedItems] = useState({ hat: null, accessory: null, skin: null });
  const [learnedTricks, setLearnedTricks] = useState([]);
  const [petSlots, setPetSlotsCount] = useState(1);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const gems = await getGems();
    const owned = await getOwnedItems();
    const equipped = await getEquippedCosmetics();
    const tricks = await getLearnedTricks();
    const slots = await getPetSlots();
    
    setUserGems(gems);
    setOwnedItems(owned);
    setEquippedItems(equipped);
    setLearnedTricks(tricks);
    setPetSlotsCount(slots);
  };

  const showMessage = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const purchaseItem = async (item, type) => {
    if (userGems < item.cost) {
      showMessage(`Not enough gems! Need ${item.cost - userGems} more.`);
      return;
    }

    if (type === 'cosmetic' && ownedItems.includes(item.id)) {
      showMessage('You already own this item!');
      return;
    }

    const newGems = userGems - item.cost;
    await saveGems(newGems);
    setUserGems(newGems);

    if (type === 'cosmetic') {
      const newOwned = [...ownedItems, item.id];
      await saveOwnedItems(newOwned);
      setOwnedItems(newOwned);
      showMessage(`Purchased ${item.name}!`);
    }
  };

  const purchaseStatBoost = async (boost) => {
    if (userGems < boost.cost) {
      showMessage(`Not enough gems! Need ${boost.cost - userGems} more.`);
      return;
    }

    const currentValue = currentPet.baseStats?.[boost.stat] || currentPet.stats?.[boost.stat] || 0;
    if (currentValue >= 100) {
      showMessage(`${boost.stat} is already at maximum (100)!`);
      return;
    }

    const newGems = userGems - boost.cost;
    await saveGems(newGems);
    setUserGems(newGems);

    const newStatValue = Math.min(100, currentValue + 5);
    
    const updatedBaseStats = {
      ...(currentPet.baseStats || currentPet.stats),
      [boost.stat]: newStatValue,
    };

    const updatedStats = {
      ...(currentPet.stats || currentPet.baseStats),
      [boost.stat]: newStatValue,
    };

    const updatedPet = {
      ...currentPet,
      baseStats: updatedBaseStats,
      stats: updatedStats,
    };

    await savePet(updatedPet);
    updatePet(updatedPet);

    showMessage(`${boost.name} applied! ${boost.stat} increased to ${newStatValue}`);
  };

  const purchaseTrick = async (trick) => {
    if (userGems < trick.cost) {
      showMessage(`Not enough gems! Need ${trick.cost - userGems} more.`);
      return;
    }

    if (currentPet.level < trick.unlockLevel) {
      showMessage(`Pet must be level ${trick.unlockLevel} to learn this trick!`);
      return;
    }

    if (learnedTricks.includes(trick.id)) {
      showMessage('You already learned this trick!');
      return;
    }

    const newGems = userGems - trick.cost;
    await saveGems(newGems);
    setUserGems(newGems);

    const newTricks = [...learnedTricks, trick.id];
    await saveLearnedTricks(newTricks);
    setLearnedTricks(newTricks);

    showMessage(`Learned ${trick.name}!`);
  };

  const purchasePetSlot = async () => {
    if (userGems < PET_SLOT_ITEM.cost) {
      showMessage(`Not enough gems! Need ${PET_SLOT_ITEM.cost - userGems} more.`);
      return;
    }

    if (petSlots >= PET_SLOT_ITEM.maxSlots) {
      showMessage('You already have the maximum number of pet slots!');
      return;
    }

    const newGems = userGems - PET_SLOT_ITEM.cost;
    await saveGems(newGems);
    setUserGems(newGems);

    const newSlots = petSlots + 1;
    await savePetSlots(newSlots);
    setPetSlotsCount(newSlots);

    showMessage(`Pet slot purchased! You now have ${newSlots} slots.`);
  };

  const equipItem = async (item, slot) => {
    const isEquipped = equippedItems[slot] === item.id;
    const newEquipped = {
      ...equippedItems,
      [slot]: isEquipped ? null : item.id,
    };

    await saveEquippedCosmetics(newEquipped);
    setEquippedItems(newEquipped);
    showMessage(isEquipped ? `Unequipped ${item.name}` : `Equipped ${item.name}`);
  };

  const renderCosmetics = () => {
    return (
      <View style={styles.section}>
        {Object.entries(COSMETICS).map(([category, items]) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
            {items.map(item => {
              const isOwned = ownedItems.includes(item.id);
              const slotKey = category === 'hats' ? 'hat' : category === 'accessories' ? 'accessory' : 'skin';
              const isEquipped = equippedItems[slotKey] === item.id;

              return (
                <View 
                  key={item.id} 
                  style={[
                    styles.itemCard, 
                    { borderLeftColor: RARITY_COLORS[item.rarity], borderLeftWidth: 4 }
                  ]}
                >
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemIcon}>{item.icon}</Text>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={[styles.rarityBadge, { color: RARITY_COLORS[item.rarity] }]}>
                        {item.rarity.toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.itemActions}>
                      <Text style={styles.itemCost}>{item.cost} 💎</Text>
                      {isOwned ? (
                        <View style={styles.ownedSection}>
                          <Text style={styles.ownedBadge}>✓ Owned</Text>
                          <TouchableOpacity 
                            style={[styles.equipButton, isEquipped && styles.equippedButton]}
                            onPress={() => equipItem(item, slotKey)}
                          >
                            <Text style={styles.equipButtonText}>
                              {isEquipped ? 'Unequip' : 'Equip'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity 
                          style={styles.buyButton}
                          onPress={() => purchaseItem(item, 'cosmetic')}
                        >
                          <Text style={styles.buyButtonText}>Buy</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const renderStatBoosts = () => {
    if (!currentPet) {
      return (
        <View style={styles.section}>
          <Text style={styles.warningText}>Loading pet data...</Text>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.warningText}>
          ⚠️ Stat boosts are permanent and cap at 100
        </Text>
        {STAT_BOOSTS.map(boost => {
          const currentValue = currentPet.baseStats?.[boost.stat] || currentPet.stats?.[boost.stat] || 0;
          const newValue = Math.min(100, currentValue + 5);
          const isMaxed = currentValue >= 100;

          return (
            <View key={boost.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemIcon}>{boost.icon}</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{boost.name}</Text>
                  <Text style={styles.statPreview}>
                    Current: {currentValue} → {newValue}
                  </Text>
                  {isMaxed && <Text style={styles.maxedBadge}>MAXED</Text>}
                </View>
                <View style={styles.itemActions}>
                  <Text style={styles.itemCost}>{boost.cost} 💎</Text>
                  <TouchableOpacity 
                    style={[styles.buyButton, isMaxed && styles.disabledButton]}
                    onPress={() => purchaseStatBoost(boost)}
                    disabled={isMaxed}
                  >
                    <Text style={styles.buyButtonText}>Buy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderTricks = () => {
    if (!currentPet) {
      return (
        <View style={styles.section}>
          <Text style={styles.warningText}>Loading pet data...</Text>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        {BATTLE_TRICKS.map(trick => {
          const isLearned = learnedTricks.includes(trick.id);
          const isLocked = currentPet.level < trick.unlockLevel;

          return (
            <View key={trick.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemIcon}>{trick.icon}</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{trick.name}</Text>
                  <Text style={styles.trickDescription}>{trick.description}</Text>
                  <Text style={styles.unlockLevel}>
                    {isLocked ? `🔒 Requires Level ${trick.unlockLevel}` : `✓ Unlocked`}
                  </Text>
                </View>
                <View style={styles.itemActions}>
                  <Text style={styles.itemCost}>{trick.cost} 💎</Text>
                  {isLearned ? (
                    <Text style={styles.learnedBadge}>Equipped</Text>
                  ) : (
                    <TouchableOpacity 
                      style={[styles.buyButton, isLocked && styles.disabledButton]}
                      onPress={() => purchaseTrick(trick)}
                      disabled={isLocked}
                    >
                      <Text style={styles.buyButtonText}>Learn</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderPetSlots = () => {
    const isMaxed = petSlots >= PET_SLOT_ITEM.maxSlots;
    
    return (
      <View style={styles.section}>
        <View style={styles.slotsCard}>
          <Text style={styles.itemIcon}>{PET_SLOT_ITEM.icon}</Text>
          <Text style={styles.itemName}>{PET_SLOT_ITEM.name}</Text>
          <Text style={styles.trickDescription}>{PET_SLOT_ITEM.description}</Text>
          
          <View style={styles.slotsDisplay}>
            <Text style={styles.slotsText}>Current Slots: {petSlots} / {PET_SLOT_ITEM.maxSlots}</Text>
            <View style={styles.slotsVisual}>
              {[...Array(PET_SLOT_ITEM.maxSlots)].map((_, index) => (
                <View 
                  key={index}
                  style={[
                    styles.slotBox,
                    index < petSlots ? styles.slotFilled : styles.slotEmpty
                  ]}
                >
                  <Text style={styles.slotIcon}>{index < petSlots ? '🐾' : '○'}</Text>
                </View>
              ))}
            </View>
          </View>

          {isMaxed ? (
            <Text style={styles.maxedBadge}>All slots unlocked!</Text>
          ) : (
            <View style={styles.purchaseSection}>
              <Text style={styles.itemCost}>{PET_SLOT_ITEM.cost} 💎</Text>
              <TouchableOpacity 
                style={styles.buyButton}
                onPress={purchasePetSlot}
              >
                <Text style={styles.buyButtonText}>Purchase Slot</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💎 Gem Shop</Text>
        <Text style={styles.gemsDisplay}>{userGems} Gems</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'cosmetics' && styles.activeTab]}
          onPress={() => setActiveTab('cosmetics')}
        >
          <Text style={[styles.tabText, activeTab === 'cosmetics' && styles.activeTabText]}>
            👔 Cosmetics
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'boosts' && styles.activeTab]}
          onPress={() => setActiveTab('boosts')}
        >
          <Text style={[styles.tabText, activeTab === 'boosts' && styles.activeTabText]}>
            📈 Stat Boosts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'tricks' && styles.activeTab]}
          onPress={() => setActiveTab('tricks')}
        >
          <Text style={[styles.tabText, activeTab === 'tricks' && styles.activeTabText]}>
            ⚡ Tricks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'slots' && styles.activeTab]}
          onPress={() => setActiveTab('slots')}
        >
          <Text style={[styles.tabText, activeTab === 'slots' && styles.activeTabText]}>
            🐾 Pet Slots
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'cosmetics' && renderCosmetics()}
        {activeTab === 'boosts' && renderStatBoosts()}
        {activeTab === 'tricks' && renderTricks()}
        {activeTab === 'slots' && renderPetSlots()}
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  gemsDisplay: {
    fontSize: 20,
    fontWeight: 'bold',
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
    fontSize: 12,
    color: '#666',
  },
  activeTabText: {
    color: '#32808D',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    fontSize: 36,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  rarityBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  itemCost: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 8,
  },
  buyButton: {
    backgroundColor: '#32808D',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  ownedSection: {
    alignItems: 'flex-end',
  },
  ownedBadge: {
    fontSize: 12,
    color: '#43a047',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  equipButton: {
    backgroundColor: '#5EB8C6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  equippedButton: {
    backgroundColor: '#FF9800',
  },
  equipButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  warningText: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: '#856404',
    fontSize: 14,
  },
  statPreview: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  maxedBadge: {
    fontSize: 12,
    color: '#d32f2f',
    fontWeight: 'bold',
    marginTop: 4,
  },
  trickDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  unlockLevel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  learnedBadge: {
    fontSize: 12,
    color: '#43a047',
    fontWeight: 'bold',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  slotsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  slotsDisplay: {
    alignItems: 'center',
    marginVertical: 20,
  },
  slotsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  slotsVisual: {
    flexDirection: 'row',
    gap: 12,
  },
  slotBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  slotFilled: {
    backgroundColor: '#E8F5E9',
    borderColor: '#43a047',
  },
  slotEmpty: {
    backgroundColor: '#F5F5F5',
    borderColor: '#BDBDBD',
  },
  slotIcon: {
    fontSize: 24,
  },
  purchaseSection: {
    alignItems: 'center',
    marginTop: 16,
  },
  snackbar: {
    backgroundColor: '#32808D',
  },
});
