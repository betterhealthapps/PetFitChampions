# PetFit Champions

## Overview
PetFit Champions is a gamified health tracking mobile app built with React Native and Expo. Users track daily health activities to earn XP, level up virtual pets, and prepare them for future PvP battles. This is the Phase 1 MVP implementation.

## Current Status (Phase 3 MVP - Completed)
The app includes:
- **Authentication**: Email/password signup and login with persistent sessions
- **Pet Selection**: Choose from 4 unique starter pets with distinct stat specializations
- **Home Dashboard**: Displays username, pet info, XP progress, daily activity summary, energy, and quick battle access
- **Health Tracking**: Manual inputs for 8 health activities (steps, sleep, mood, water, meditation, meals, journal, breathing)
- **XP System**: Automatic XP calculation based on tracked activities with configurable conversion rates
- **Pet System**: 4 starter pets with 7 stats, level progression, and evolution system
- **Leveling**: Automatic level-up system (1-50) with gem rewards and +2 stat growth per level
- **Evolution**: 3-tier evolution system (Tier 1→2 at level 16, Tier 2→3 at level 36) with 50% stat boosts
- **Battle Mode Selector**: Unified screen with 3 battle modes (PvP Arena, Bot Arena, Pet Runner)
- **PvP Arena**: Turn-based battles with AI opponents, 20 energy, 10-30 gems, win/loss tracking
- **Bot Arena**: Practice battles (placeholder), 10 energy, 5-15 gems, 3 difficulty levels
- **Pet Runner**: Endless runner mini-game (placeholder), 5 energy, 1 gem per 10 points
- **Energy System**: 100 max energy, variable cost per mode, regenerates 1 energy per minute
- **Battle Stats**: Win/loss tracking for all battle modes, persisted to local storage
- **Navigation**: Bottom tab navigation with Battle tab, locked PvP battle screens prevent mid-battle exits
- **Data Persistence**: Local storage using AsyncStorage for user, pet, health, energy, gems, and battle stats
- **Visual Assets**: App icon and 12 pet evolution illustrations (4 pets × 3 tiers)

## Project Structure
```
PetFitChampions/
├── src/
│   ├── screens/          # Screen components
│   │   ├── LoginScreen.js
│   │   ├── SignUpScreen.js
│   │   ├── PetSelectionScreen.js
│   │   ├── HomeScreen.js
│   │   ├── TrackScreen.js
│   │   ├── BattleScreen.js (Mode selector)
│   │   ├── PvPArenaScreen.js (PvP matchmaking)
│   │   ├── PvPBattleScreen.js (Turn-based combat)
│   │   ├── PvPResultScreen.js (Victory/defeat)
│   │   ├── BotArenaScreen.js (Bot practice - placeholder)
│   │   ├── RunnerGameScreen.js (Endless runner - placeholder)
│   │   ├── PetScreen.js
│   │   └── ProfileScreen.js
│   ├── components/       # Reusable UI components
│   ├── context/          # State management
│   │   ├── AuthContext.js
│   │   ├── PetContext.js
│   │   ├── BattleContext.js
│   │   └── HealthContext.js
│   ├── utils/            # Utility functions
│   │   ├── xpCalculations.js
│   │   ├── battleLogic.js
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
- **Stat Growth**: All stats increase by +2 per level gained

## Evolution System
- **Tier 1 (Basic)**: Levels 1-15
- **Tier 2 (Advanced)**: Levels 16-35 (Cost: 150 gems, +50% all stats)
- **Tier 3 (Master)**: Levels 36+ (Cost: 500 gems, +50% all stats)

## Starter Pets
Users choose one of 4 unique pets at signup:

**1. Vigor (Dog)** - High Stamina
- Health: 80, Energy: 70, Strength: 65, Defense: 60
- Stamina: 90 (High), Agility: 55, Attack: 70
- Best for: Endurance-based strategies

**2. Zen (Cat)** - High Agility
- Health: 70, Energy: 75, Strength: 55, Defense: 50
- Stamina: 60, Agility: 95 (High), Attack: 65
- Best for: Speed and evasion tactics

**3. Atlas (Bear)** - High Strength & Defense
- Health: 100, Energy: 65, Strength: 95 (High), Defense: 90 (High)
- Stamina: 70, Agility: 45, Attack: 85
- Best for: Tank and power builds

**4. Swift (Bird)** - High Energy
- Health: 65, Energy: 95 (High), Strength: 50, Defense: 45
- Stamina: 75, Agility: 85, Attack: 60
- Best for: Sustained combat and energy management

## Running the App
The app runs on port 5000 with Expo web. Use the webview to interact with the app in your browser.

## Battle System

### Battle Modes
The Battle tab opens a mode selector with 3 battle types:

**1. PvP Arena** ⚔️
- **Energy Cost**: 20 per battle
- **Gem Rewards**: +15 for victory, -5 for defeat
- **Gameplay**: Turn-based combat with 3 actions (Attack/Defend/Special)
- **AI Opponents**: Level-scaled, randomized stats, intelligent action selection
- **Battle Flow**: Matchmaking → Battle (locked) → Result
- **Stats Tracked**: Wins and losses

**2. Bot Arena** 🤖 (Coming Soon)
- **Energy Cost**: 10 per battle
- **Gem Rewards**: 5-15 gems (varies by difficulty)
- **Difficulties**: Easy, Medium, Hard
- **Purpose**: Practice battles with lower stakes
- **Stats Tracked**: Wins/losses per difficulty level

**3. Pet Runner** 🏃 (Coming Soon)
- **Energy Cost**: 5 per run
- **Gem Rewards**: 1 gem per 10 points scored
- **Gameplay**: Endless obstacle course runner
- **Daily Limit**: 50 gems per day
- **Stats Tracked**: High score, daily gems earned, total runs

### Energy System
- **Max Energy**: 100
- **Regen Rate**: 1 energy per minute
- **Costs**: Variable by mode (PvP: 20, Bot: 10, Runner: 5)

## Color Scheme
- **Primary (Teal)**: #32808D - Main brand color for buttons, headers, important text
- **Secondary (Gray)**: #F5F5F5 - Background color for screens and cards
- **Accent (Light Teal)**: #5EB8C6 - Secondary actions, highlights
- **Success (Green)**: #43a047 - Positive feedback, health bars
- **Error (Red)**: #d32f2f - Damage, errors, warnings
- **Warning (Orange)**: #ff9800 - Energy, gems, special items

## Future Enhancements
- Daily streak tracker with bonus rewards
- Battle history and statistics
- Ranked matchmaking with leaderboards
- Pet abilities and special moves
- Social features (friend battles, guilds)

## Recent Changes
- **November 10, 2025 (Update 5)**: Multiple Battle Modes
  - Restructured battle system to support 3 distinct game modes
  - Created unified Battle Mode Selector screen with energy display and mode cards
  - PvP Arena: Fully functional turn-based battles with win/loss tracking
  - Bot Arena: Placeholder screen with 3 difficulty levels (Easy, Medium, Hard)
  - Pet Runner: Placeholder screen with game instructions and stats display
  - Battle stats persistence: Win/loss records saved to AsyncStorage for all modes
  - Reorganized battle screens: BattleScreen → PvPBattleScreen, etc.
  - Updated navigation structure to support multiple battle flows
  - Each mode has unique energy costs and gem rewards

- **November 10, 2025 (Update 4)**: Battle System & Visual Assets
  - Complete turn-based battle system with AI opponents
  - Energy management: 100 max, 20 per battle, 1/min regeneration
  - Battle screens: Matchmaking, Battle (with animations), Result
  - Locked battle navigation (no back button or gestures during battle)
  - Gem rewards: +15 for victory, -5 for defeat
  - Damage calculation using pet stats (attack, strength, energy, defense)
  - AI opponent generation with level-based scaling
  - Generated app icon (1024x1024) with pet health theme
  - Generated 12 pet evolution illustrations (4 pets × 3 tiers, 512x512 each)
  - Applied new color scheme (#32808D teal, #F5F5F5 gray, #5EB8C6 accent)
  - Updated HomeScreen with energy display and Battle button

- **November 10, 2025 (Update 3)**: Complete Pet System implementation
  - Pet Selection Screen: Choose from 4 unique starter pets (Vigor, Zen, Atlas, Swift)
  - Each pet has distinct stat specializations and descriptions
  - Stat Growth System: All stats increase by +2 per level gained
  - Evolution System: 3-tier progression with 50% stat boosts (Tier 2 at level 16, Tier 3 at level 36)
  - Enhanced Pet Screen: Shows all 7 stats with progress bars, evolution button when eligible
  - Evolution costs: 150 gems (Tier 2), 500 gems (Tier 3)
  - Navigation flow: Users select pet after signup, before accessing main app

- **November 10, 2025 (Update 2)**: Enhanced Track screen with improved UI controls
  - Steps input: Added large increment/decrement buttons (±1000) and quick buttons (-100, +100, +500)
  - Sleep input: Replaced text field with interactive slider (0-12 hours, 0.5 step increments)
  - Water counter: Enhanced with larger icons and improved visual hierarchy
  - Target labels: Added XP conversion rates below each activity card for user guidance
  - Daily bonus reminder: Added callout showing "+200 XP for completing all 8 activities"
  - Toast notifications: Replaced all Alert dialogs with Snackbar toasts for better UX
  - Auto-save: All inputs now save automatically with toast feedback

- **November 10, 2025**: Initial Phase 1 MVP implementation completed
  - Full authentication system
  - Complete health tracking for 8 activities
  - XP calculation and leveling system
  - Pet stats display and progression
  - Bottom tab navigation
  - Local data persistence

## User Preferences
None specified yet.
