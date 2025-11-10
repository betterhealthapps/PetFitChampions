# PetFit Champions

## Overview
PetFit Champions is a gamified health tracking mobile app built with React Native and Expo. Users track daily health activities to earn XP, level up virtual pets, and prepare them for future PvP battles. This is the Phase 1 MVP implementation.

## Current Status (Phase 1 MVP - Completed)
The app includes:
- **Authentication**: Email/password signup and login with persistent sessions
- **Home Dashboard**: Displays username, pet info, XP progress, daily activity summary
- **Health Tracking**: Manual inputs for 8 health activities (steps, sleep, mood, water, meditation, meals, journal, breathing)
- **XP System**: Automatic XP calculation based on tracked activities with configurable conversion rates
- **Pet System**: Single starter pet (Vigor the Dog) with 7 stats and level progression
- **Leveling**: Automatic level-up system (1-50) with gem rewards equal to current level
- **Navigation**: Bottom tab navigation between Home, Track, Pet, and Profile screens
- **Data Persistence**: Local storage using AsyncStorage for user, pet, and health data

## Project Structure
```
PetFitChampions/
├── src/
│   ├── screens/          # Screen components
│   │   ├── LoginScreen.js
│   │   ├── SignUpScreen.js
│   │   ├── HomeScreen.js
│   │   ├── TrackScreen.js
│   │   ├── PetScreen.js
│   │   └── ProfileScreen.js
│   ├── components/       # Reusable UI components
│   ├── context/          # State management
│   │   ├── AuthContext.js
│   │   ├── PetContext.js
│   │   └── HealthContext.js
│   ├── utils/            # Utility functions
│   │   ├── xpCalculations.js
│   │   └── storage.js
│   ├── data/             # Constants and templates
│   │   ├── constants.js
│   │   └── petTemplates.js
│   └── assets/           # Images and icons
├── App.js               # Main app with navigation setup
└── package.json         # Dependencies
```

## Tech Stack
- **Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **UI Library**: React Native Paper
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **Icons**: Expo Vector Icons

## XP Conversion Rates
- 10k steps = 200 XP
- 8 hours sleep = 150 XP
- 3 healthy meals = 150 XP
- 10 minutes meditation = 100 XP
- Journal entry = 100 XP
- 3 mood check-ins = 150 XP
- Breathing exercise = 50 XP
- Complete ALL daily tasks = +200 bonus XP

## Leveling System
- **Level 1-10**: 1000 XP per level
- **Level 11-25**: 1500 XP per level
- **Level 26-50**: 2500 XP per level
- **Gem Rewards**: On level-up, earn gems equal to current level (e.g., Level 5 = 5 gems)

## Starter Pet (MVP)
**Vigor (Dog)** - High Stamina
- Base Stats:
  - Health: 80
  - Energy: 70
  - Strength: 65
  - Defense: 60
  - Stamina: 90 (High)
  - Agility: 55
  - Attack: 70

## Running the App
The app runs on port 5000 with Expo web. Use the webview to interact with the app in your browser.

## Next Phase Features (Phase 2)
- Add all 4 starter pets (Vigor, Zen, Atlas, Swift)
- Pet selection screen
- 3-tier evolution system
- Enhanced gem economy
- Daily streak tracker

## Phase 3 Features
- Turn-based PvP battle system
- Battle matchmaking
- Energy system with regeneration
- Battle history tracking
- Gem stealing mechanics

## Recent Changes
- **November 10, 2025**: Initial Phase 1 MVP implementation completed
  - Full authentication system
  - Complete health tracking for 8 activities
  - XP calculation and leveling system
  - Pet stats display and progression
  - Bottom tab navigation
  - Local data persistence

## User Preferences
None specified yet.
