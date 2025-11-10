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
import BattleMatchmakingScreen from './src/screens/BattleMatchmakingScreen';
import BattleScreen from './src/screens/BattleScreen';
import BattleResultScreen from './src/screens/BattleResultScreen';

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
        name="BattleMatchmaking" 
        component={BattleMatchmakingScreen}
        options={{ headerTitle: 'Battle Arena' }}
      />
      <Stack.Screen 
        name="Battle" 
        component={BattleScreen}
        options={{ 
          headerTitle: 'Battle', 
          headerLeft: () => null,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="BattleResult" 
        component={BattleResultScreen}
        options={{ 
          headerTitle: 'Battle Result', 
          headerLeft: () => null,
          gestureEnabled: false,
        }}
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
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'BattleMatchmaking';
          const hideTabBar = routeName === 'Battle' || routeName === 'BattleResult';
          return {
            headerShown: false,
            tabBarStyle: hideTabBar ? { display: 'none' } : undefined,
          };
        }}
      />
      <Tab.Screen 
        name="Pet" 
        component={PetScreen}
        options={{ headerTitle: 'My Pet' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ headerTitle: 'Profile' }}
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
