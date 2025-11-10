import React, { useContext } from 'react';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { PetProvider, PetContext } from './src/context/PetContext';
import { HealthProvider } from './src/context/HealthContext';
import { BattleProvider } from './src/context/BattleContext';

import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import PetSelectionScreen from './src/screens/PetSelectionScreen';
import HomeScreen from './src/screens/HomeScreen';
import TrackScreen from './src/screens/TrackScreen';
import PetScreen from './src/screens/PetScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ProfileEditScreen from './src/screens/ProfileEditScreen';
import GemShopScreen from './src/screens/GemShopScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import BattleScreen from './src/screens/BattleScreen';
import PvPArenaScreen from './src/screens/PvPArenaScreen';
import PvPBattleScreen from './src/screens/PvPBattleScreen';
import PvPResultScreen from './src/screens/PvPResultScreen';
import BotArenaScreen from './src/screens/BotArenaScreen';
import BotArenaResultScreen from './src/screens/BotArenaResultScreen';
import RunnerGameScreen from './src/screens/RunnerGameScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SignUp" 
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function BattleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="BattleModeSelector" 
        component={BattleScreen}
        options={{ headerTitle: 'Battle Arena' }}
      />
      <Stack.Screen 
        name="PvPArena" 
        component={PvPArenaScreen}
        options={{ headerTitle: 'PvP Arena' }}
      />
      <Stack.Screen 
        name="PvPBattle" 
        component={PvPBattleScreen}
        options={{ 
          headerTitle: 'Battle', 
          headerLeft: () => null,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="PvPResult" 
        component={PvPResultScreen}
        options={{ 
          headerTitle: 'Battle Result', 
          headerLeft: () => null,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="BotArena" 
        component={BotArenaScreen}
        options={{ headerTitle: 'Bot Arena' }}
      />
      <Stack.Screen 
        name="BotArenaResult" 
        component={BotArenaResultScreen}
        options={{ 
          headerTitle: 'Battle Result', 
          headerLeft: () => null,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="RunnerGame" 
        component={RunnerGameScreen}
        options={{ headerTitle: 'Pet Runner' }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ headerTitle: 'Profile' }}
      />
      <Stack.Screen 
        name="ProfileEdit" 
        component={ProfileEditScreen}
        options={{ headerTitle: 'Edit Profile' }}
      />
      <Stack.Screen 
        name="GemShop" 
        component={GemShopScreen}
        options={{ headerTitle: 'Gem Shop' }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Track') {
            iconName = focused ? 'clipboard-check' : 'clipboard-check-outline';
          } else if (route.name === 'Battle') {
            iconName = focused ? 'sword-cross' : 'sword';
          } else if (route.name === 'Leaderboard') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Pet') {
            iconName = focused ? 'paw' : 'paw-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#32808D',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ headerTitle: 'PetFit Champions' }}
      />
      <Tab.Screen 
        name="Track" 
        component={TrackScreen}
        options={{ headerTitle: 'Track Health' }}
      />
      <Tab.Screen 
        name="Battle" 
        component={BattleStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'BattleModeSelector';
          const hideTabBar = routeName === 'PvPBattle' || routeName === 'PvPResult';
          return {
            headerShown: false,
            tabBarStyle: hideTabBar ? { display: 'none' } : undefined,
          };
        }}
      />
      <Tab.Screen 
        name="Leaderboard" 
        component={LeaderboardScreen}
        options={{ headerTitle: 'Leaderboard', headerShown: false }}
      />
      <Tab.Screen 
        name="Pet" 
        component={PetScreen}
        options={{ headerTitle: 'My Pet' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function Navigation() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { pet, loading: petLoading } = useContext(PetContext);

  if (authLoading || petLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : !pet ? (
          <Stack.Screen name="PetSelection" component={PetSelectionScreen} />
        ) : (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <PetProvider>
          <BattleProvider>
            <HealthProvider>
              <Navigation />
            </HealthProvider>
          </BattleProvider>
        </PetProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
