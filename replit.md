# PetFit Champions

## Overview
PetFit Champions is a gamified React Native mobile application where users track daily health activities to earn XP, level up virtual pets, and battle AI opponents in three distinct game modes. The project integrates health and fitness with engaging pet-centric gameplay, offering a unique blend of wellness and entertainment. This is the Phase 1 MVP implementation, featuring complete core tracking, pet progression, and battle mechanics.

## Recent Changes (November 10, 2025)
- **Bot Arena Implementation**: Fully functional turn-based battle system with three difficulty levels (Easy/Medium/Hard), trait-aware AI, player-baseline stat scaling, and balanced reward distribution.
- **Pet Runner Implementation**: Complete endless runner mini-game with obstacle avoidance, score-based progression, gem/XP rewards, and anti-farming daily gem cap (50/day).
- **Battle Logic Enhancement**: Implemented comprehensive battle utilities with trait-aware AI strategy, dodge mechanics, damage calculation, and reward balancing across all modes.
- **Critical Bug Fixes (Latest Session)**:
  - Fixed Bot Arena stats persistence by consolidating all battle modes to use getBattleStats/saveBattleStats consistently
  - Added BotArenaResultScreen with proper navigation to show battle outcomes, rewards breakdown, and difficulty-specific win/loss records
  - Fixed Pet evolution button: Tier type coercion (string to number) now allows pets to evolve from Tier 1 to Tier 2 at level 16
  - Implemented backward-compatible migration for Runner stats (dailyGems→todayGems) to prevent NaN totals
- **Cosmetics Stat Boost System**: All 15 cosmetic items (5 hats, 5 accessories, 5 skins) now display specific stat bonuses in the Gem Shop with visual stat boost pills, making cosmetic choices strategically meaningful in battles.

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
- **Battle System**: Features a unified Battle Mode Selector with three fully implemented modes:
    - **PvP Arena**: Turn-based combat against AI opponents, costing 20 energy, with 10-30 gem rewards for victory/loss tracking.
    - **Bot Arena**: Practice battles with three difficulties (Easy/Medium/Hard), costing 10 energy. Features trait-aware AI strategy, stat scaling from player baseline, and difficulty-based rewards (Easy: 4-6 gems, 25 XP; Medium: 7-10 gems, 40 XP; Hard: 11-14 gems, 60 XP). Defeats result in negative gem loss (-1/-3/-5) and reduced XP (25% of win amount).
    - **Pet Runner**: An endless runner mini-game, costing 5 energy. Features obstacle avoidance, score-based gem rewards (5 gems at <50 score, scaling to 25 gems at 500+ score), XP rewards (score/2, max 100), and a 50 gem daily earning cap to prevent farming. Tracks high scores and total runs.
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