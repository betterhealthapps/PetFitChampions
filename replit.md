# PetFit Champions

## Overview
PetFit Champions is a gamified React Native mobile application where users track daily health activities to earn XP, level up virtual pets, and battle AI opponents in three distinct game modes. The project integrates health and fitness with engaging pet-centric gameplay, offering a unique blend of wellness and entertainment. This is the Phase 1 MVP implementation, featuring complete core tracking, pet progression, and battle mechanics.

## Recent Changes (November 10, 2025)
- **Pet-Specific Runner Mechanics**: Complete rewrite of RunnerGameScreen with unique mechanics for land pets (jump/run physics) vs flying pets (flap/glide physics). Each of the 4 starter pets now has a unique ability:
  - **Vigor (Dog)**: Sprint Burst - 30% speed boost for 1.5s when jumping
  - **Zen (Cat)**: Nine Lives - survives one extra hit
  - **Atlas (Bear)**: Tough Hide - destroys obstacles on contact
  - **Swift (Bird)**: Graceful Glide - flying pet with tap-to-flap controls
- **Pet Data Structure Enhancement**: Expanded petTemplates.js with runner-specific fields including category (land/flying), animation icons (runningIcon, jumpingIcon for land; flyingIcon, glidingIcon for flying), and runnerAbility objects defining pet-specific powers.
- **Physics & Ability System Fixes**:
  - Fixed speed boost closure issue using useRef to properly restore speed after boost ends
  - Implemented ability flag reset system to prevent cross-pet ability accumulation when switching pets
  - Fixed agility-scaled jump velocity with safe additive bonus (prevents negative velocity blow-ups)
  - Fixed flying pet altitude initialization and ground collision with bounce-back mechanics
- **Pet Evolution Fix**: Added explicit Number() coercion to currentTier variable in PetScreen.js, ensuring Tier 1 → 2 evolution at level 16 (was comparing string "1" vs number 1).
- **Bot Arena & Battle Systems**: Fully functional turn-based battle system with three difficulty levels, trait-aware AI, stats persistence, and BotArenaResultScreen with rewards breakdown.
- **Cosmetics Stat Boost System**: All 15 cosmetic items display specific stat bonuses in the Gem Shop with visual pills, making cosmetic choices strategically meaningful.

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
- **Pet System**: Users select from 4 starter pets, each with unique stat specializations and runner abilities. Pets level up (1-50) by earning XP, gaining +2 stats per level, and can evolve through 3 tiers at levels 16 and 36, receiving 50% stat boosts. Each pet has a unique runner ability:
  - Vigor (Dog): Sprint Burst on jump
  - Zen (Cat): Extra life
  - Atlas (Bear): Obstacle destruction
  - Swift (Bird): Flying controls
- **Health Tracking**: Manual input for 8 activities (steps, sleep, mood, water, meditation, meals, journal, breathing), with configurable XP conversion rates and a daily completion bonus.
- **XP & Leveling**: Automatic XP calculation and level progression system with gem rewards upon leveling up.
- **Battle System**: Features a unified Battle Mode Selector with three fully implemented modes:
    - **PvP Arena**: Turn-based combat against AI opponents, costing 20 energy, with 10-30 gem rewards for victory/loss tracking.
    - **Bot Arena**: Practice battles with three difficulties (Easy/Medium/Hard), costing 10 energy. Features trait-aware AI strategy, stat scaling from player baseline, and difficulty-based rewards (Easy: 4-6 gems, 25 XP; Medium: 7-10 gems, 40 XP; Hard: 11-14 gems, 60 XP). Defeats result in negative gem loss (-1/-3/-5) and reduced XP (25% of win amount).
    - **Pet Runner**: An endless runner mini-game with pet-specific mechanics, costing 5 energy. Land pets (Vigor, Zen, Atlas) use jump/run physics with agility-scaled jumps, while flying pets (Swift) use tap-to-flap controls with altitude management. Features obstacle avoidance, platforms, coins, score-based gem rewards (5-25 gems based on distance), XP rewards (score/2, max 100), and a 50 gem daily earning cap to prevent farming. Each pet's unique ability (speed boost, extra life, obstacle destruction, flying) creates distinct gameplay experiences.
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