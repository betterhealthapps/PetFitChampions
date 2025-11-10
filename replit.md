# PetFit Champions

## Overview
PetFit Champions is a gamified React Native mobile application where users track daily health activities to earn XP, level up virtual pets, and prepare them for future PvP battles. The project aims to integrate health and fitness with engaging pet-centric gameplay, offering a unique blend of wellness and entertainment. This is the Phase 1 MVP implementation, focusing on core tracking, pet progression, and battle mechanics.

## User Preferences
None specified yet.

## System Architecture
The application is built with **React Native and Expo SDK 54**, utilizing **React Navigation** for a tab-based navigation structure (Home, Track, Battle, Leaderboard, Pet, Profile). **React Native Paper** is used for UI components, ensuring a consistent design. **React Context API** manages global state for authentication, pet data, battles, and health tracking. All user and game data, including shop purchases, traits, and leaderboard statistics, are persisted locally using **AsyncStorage**.

**UI/UX Decisions:**
- **Color Scheme**: Primary Teal (#32808D), Secondary Gray (#F5F5F5), Accent Light Teal (#5EB8C6), with distinct colors for Success (Green: #43a047), Error (Red: #d32f2f), and Warning (Orange: #ff9800).
- **Visual Assets**: Includes an app icon and 12 unique pet evolution illustrations (4 pets across 3 tiers).
- **Navigation**: Bottom tab navigation is implemented, with additional stack navigators for specific feature flows (e.g., Battle modes).

**Technical Implementations & Feature Specifications:**
- **Authentication**: Email/password signup and login with persistent sessions.
- **Pet System**: Users select from 4 starter pets, each with unique stat specializations. Pets level up (1-50) by earning XP, gaining +2 stats per level, and can evolve through 3 tiers at levels 16 and 36, receiving 50% stat boosts.
- **Health Tracking**: Manual input for 8 activities (steps, sleep, mood, water, meditation, meals, journal, breathing), with configurable XP conversion rates and a daily completion bonus.
- **XP & Leveling**: Automatic XP calculation and level progression system with gem rewards upon leveling up.
- **Battle System**: Features a unified Battle Mode Selector with three modes:
    - **PvP Arena**: Turn-based combat against AI opponents, costing 20 energy, with gem rewards for victory/loss tracking.
    - **Bot Arena**: Practice battles with varying difficulties, costing 10 energy, with gem rewards.
    - **Pet Runner**: An endless runner mini-game, costing 5 energy, with gem rewards based on score.
- **Energy System**: 100 max energy, regenerating at 1 per minute, with variable costs per battle mode.
- **Gem Shop**: A marketplace with four categories:
    - **Cosmetics**: 15 items (hats, accessories, skins) with rarity, equip/unequip functionality.
    - **Stat Boosts**: Permanent +5 stat increases for 300 gems each.
    - **Battle Tricks**: 4 special moves unlocked by level.
    - **Pet Slots**: Allows purchasing up to 3 pet slots for 500 gems each.
- **Battle Traits**: 4 passive abilities (First Strike, Endurance, Counter, Critical Master) that activate based on pet stats, influencing battle outcomes.
- **Leaderboard**: Global rankings across 4 categories (Overall XP, Battle Wins, Best Streak, Weekly XP), featuring simulated AI competitors and top 10 displays.
- **Streak Tracking**: Daily login streak tracking.

## External Dependencies
- **Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation
- **UI Library**: React Native Paper
- **Storage**: AsyncStorage
- **Icons**: Expo Vector Icons