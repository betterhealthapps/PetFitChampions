import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Alert,
  Dimensions,
  ScrollView,
  Easing,
} from 'react-native';
import { BattleContext } from '../context/BattleContext';
import { PetContext } from '../context/PetContext';
import { calculateRunnerReward } from '../utils/battleLogic';
import { saveBattleStats, getBattleStats } from '../utils/storage';
import { STARTER_PETS } from '../data/petTemplates';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GAME_HEIGHT = 500;
const GROUND_HEIGHT = 100;
const PET_SIZE = 50;

const LAND_JUMP_VELOCITY = -450;
const LAND_GRAVITY = 1400;

const FLYING_FLAP_FORCE = -350;
const FLYING_GRAVITY = 800;
const FLYING_MAX_FALL_SPEED = 400;

const INITIAL_SPEED = 250;

export default function RunnerGameScreen({ navigation }) {
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [distance, setDistance] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const { energy, consumeEnergy, hasEnoughEnergy } = useContext(BattleContext);
  const { pet, addGems, addXP } = useContext(PetContext);
  
  const [petConfig, setPetConfig] = useState(null);
  const [isFlying, setIsFlying] = useState(false);

  const [obstacles, setObstacles] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [coinsList, setCoinsList] = useState([]);
  const [powerUps, setPowerUps] = useState([]);

  const [isOnGround, setIsOnGround] = useState(true);
  const [velocityY, setVelocityY] = useState(0);
  const [jumpCount, setJumpCount] = useState(0);
  const [maxJumps, setMaxJumps] = useState(1);

  const [hasExtraLife, setHasExtraLife] = useState(false);
  const [canDestroyObstacles, setCanDestroyObstacles] = useState(false);
  const [canFireBreath, setCanFireBreath] = useState(false);
  const [canResurrect, setCanResurrect] = useState(false);
  const [resurrected, setResurrected] = useState(false);
  const [hasSpeedBoost, setHasSpeedBoost] = useState(false);
  const [speedBoostTimer, setSpeedBoostTimer] = useState(null);

  const [dailyGems, setDailyGems] = useState(0);

  const petY = useRef(new Animated.Value(GROUND_HEIGHT)).current;
  const petRotation = useRef(new Animated.Value(0)).current;
  const petFlap = useRef(new Animated.Value(0)).current;
  const gameLoop = useRef(null);
  const spawnTimer = useRef(null);
  const lastFrameTime = useRef(Date.now());

  useEffect(() => {
    loadGameData();
    return () => {
      if (gameLoop.current) cancelAnimationFrame(gameLoop.current);
      if (spawnTimer.current) clearInterval(spawnTimer.current);
    };
  }, []);

  const loadGameData = async () => {
    try {
      if (!pet) {
        console.error('No pet found');
        return;
      }

      const petKey = pet.id ? pet.id.toUpperCase() : null;
      if (!petKey) {
        console.error('Pet has no ID');
        return;
      }

      const config = STARTER_PETS[petKey];
      if (!config) {
        console.error('Pet config not found for:', pet.id, 'Available keys:', Object.keys(STARTER_PETS));
        return;
      }

      setPetConfig(config);
      setIsFlying(config.category === 'flying');

      switch (config.runnerAbility?.effect) {
        case 'tripleJump':
          setMaxJumps(3);
          break;
        case 'extraLife':
          setHasExtraLife(true);
          break;
        case 'destroyObstacles':
          setCanDestroyObstacles(true);
          break;
        case 'fireBreath':
          setCanFireBreath(true);
          break;
        case 'resurrect':
          setCanResurrect(true);
          break;
        case 'speedOnJump':
          setHasSpeedBoost(true);
          break;
        case 'flappyControl':
          break;
      }

      const battleStats = await getBattleStats();
      if (battleStats && battleStats.runner) {
        setHighScore(battleStats.runner.highScore || 0);
        setDailyGems(battleStats.runner.todayGems || 0);
      }
    } catch (error) {
      console.error('Error loading game data:', error);
    }
  };

  const startGame = () => {
    if (!hasEnoughEnergy(5)) {
      Alert.alert('Not Enough Energy', 'You need 5 energy to play!');
      return;
    }

    consumeEnergy(5);

    setScore(0);
    setCoins(0);
    setDistance(0);
    setSpeed(INITIAL_SPEED);
    setObstacles([]);
    setPlatforms([]);
    setCoinsList([]);
    setPowerUps([]);
    setJumpCount(0);
    setVelocityY(0);
    setIsOnGround(!isFlying);
    setResurrected(false);
    if (speedBoostTimer) {
      clearTimeout(speedBoostTimer);
      setSpeedBoostTimer(null);
    }

    petY.setValue(isFlying ? GROUND_HEIGHT + 250 : GROUND_HEIGHT);
    petRotation.setValue(0);
    petFlap.setValue(0);
    lastFrameTime.current = Date.now();

    setGameState('playing');

    spawnTimer.current = setInterval(spawnGameObjects, 1500);
    gameLoop.current = requestAnimationFrame(updateGame);
  };

  const spawnGameObjects = () => {
    const random = Math.random();

    if (isFlying) {
      if (random < 0.4) {
        spawnFlyingObstacle();
      } else if (random < 0.7) {
        spawnFloatingCoins();
      }
    } else {
      if (random < 0.3) {
        spawnPlatform();
      } else if (random < 0.5) {
        spawnGroundObstacle();
      } else if (random < 0.7) {
        spawnCoins();
      }
    }
  };

  const spawnPlatform = () => {
    const height = 150 + Math.random() * 150;
    const width = 80 + Math.random() * 60;
    setPlatforms(prev => [...prev, {
      id: Date.now() + Math.random(),
      x: SCREEN_WIDTH,
      y: GROUND_HEIGHT + height,
      width,
      height: 20,
    }]);

    const coinCount = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < coinCount; i++) {
      setCoinsList(prev => [...prev, {
        id: Date.now() + Math.random() + i,
        x: SCREEN_WIDTH + (i * 35),
        y: GROUND_HEIGHT + height + 25,
        collected: false,
      }]);
    }
  };

  const spawnGroundObstacle = () => {
    const types = [
      { height: 50, width: 35, icon: '🪨', type: 'rock', destroyable: true },
      { height: 60, width: 30, icon: '🌵', type: 'cactus', destroyable: false },
      { height: 70, width: 40, icon: '🔥', type: 'fire', destroyable: false },
      { height: 45, width: 45, icon: '💀', type: 'spike', destroyable: false },
    ];
    const obstacle = types[Math.floor(Math.random() * types.length)];

    setObstacles(prev => [...prev, {
      id: Date.now(),
      x: SCREEN_WIDTH,
      y: GROUND_HEIGHT,
      ...obstacle,
    }]);
  };

  const spawnFlyingObstacle = () => {
    const minHeight = 120;
    const maxHeight = 350;
    const height = minHeight + Math.random() * (maxHeight - minHeight);
    const types = [
      { icon: '🦅', width: 45, height: 40 },
      { icon: '☁️', width: 60, height: 50 },
      { icon: '⚡', width: 35, height: 45 },
      { icon: '🌪️', width: 50, height: 55 },
    ];

    const obstacle = types[Math.floor(Math.random() * types.length)];

    setObstacles(prev => [...prev, {
      id: Date.now(),
      x: SCREEN_WIDTH,
      y: GROUND_HEIGHT + height,
      ...obstacle,
      type: 'flying',
      destroyable: obstacle.icon === '☁️',
    }]);
  };

  const spawnCoins = () => {
    const pattern = Math.random() < 0.5 ? 'line' : 'arc';
    const coinCount = 5;
    const startHeight = 150 + Math.random() * 100;
    for (let i = 0; i < coinCount; i++) {
      let y;
      if (pattern === 'line') {
        y = GROUND_HEIGHT + startHeight;
      } else {
        const progress = i / (coinCount - 1);
        const arcHeight = Math.sin(progress * Math.PI) * 80;
        y = GROUND_HEIGHT + startHeight + arcHeight;
      }

      setCoinsList(prev => [...prev, {
        id: Date.now() + i,
        x: SCREEN_WIDTH + (i * 40),
        y,
        collected: false,
      }]);
    }
  };

  const spawnFloatingCoins = () => {
    const centerHeight = 200 + Math.random() * 100;
    const coinCount = 4;
    for (let i = 0; i < coinCount; i++) {
      setCoinsList(prev => [...prev, {
        id: Date.now() + i,
        x: SCREEN_WIDTH + (i * 50),
        y: GROUND_HEIGHT + centerHeight + (Math.random() - 0.5) * 100,
        collected: false,
      }]);
    }
  };

  const updateGame = () => {
    const now = Date.now();
    const deltaTime = Math.min((now - lastFrameTime.current) / 1000, 0.05);
    lastFrameTime.current = now;
    if (gameState !== 'playing') return;

    setDistance(prev => prev + speed * deltaTime);
    setScore(prev => prev + deltaTime * 10);
    setSpeed(prev => Math.min(prev + deltaTime * 5, 450));

    updatePlayerPhysics(deltaTime);
    updateGameObjects(deltaTime);

    gameLoop.current = requestAnimationFrame(updateGame);
  };

  const updatePlayerPhysics = (deltaTime) => {
    if (isFlying) {
      setVelocityY(prev => {
        const gravity = FLYING_GRAVITY * deltaTime;
        const newVelocity = Math.min(prev + gravity, FLYING_MAX_FALL_SPEED);
        const currentY = petY._value;
        let newY = currentY - newVelocity * deltaTime;
        
        newY = Math.max(GROUND_HEIGHT, Math.min(newY, GROUND_HEIGHT + 400));
        
        if (newY <= GROUND_HEIGHT) {
          newY = GROUND_HEIGHT + 50;
          return 0;
        }
        
        petY.setValue(newY);
        return newVelocity;
      });
    } else {
      setVelocityY(prev => {
        const newVelocity = prev + LAND_GRAVITY * deltaTime;
        const currentY = petY._value;
        const newY = currentY - newVelocity * deltaTime;

        if (newY <= GROUND_HEIGHT) {
          petY.setValue(GROUND_HEIGHT);
          setIsOnGround(true);
          setJumpCount(0);
          petRotation.setValue(0);
          return 0;
        }

        let onPlatform = false;
        platforms.forEach(platform => {
          if (checkPlatformCollision(currentY, newY, platform)) {
            petY.setValue(platform.y + platform.height);
            setIsOnGround(true);
            setJumpCount(0);
            onPlatform = true;
          }
        });

        if (!onPlatform && newY > GROUND_HEIGHT) {
          setIsOnGround(false);
          petY.setValue(newY);
        }

        return newVelocity;
      });
    }
  };

  const checkPlatformCollision = (oldY, newY, platform) => {
    const petX = 60;
    const petRight = petX + PET_SIZE;
    const platformLeft = platform.x;
    const platformRight = platform.x + platform.width;
    const horizontalOverlap = petRight > platformLeft && petX < platformRight;
    const verticalOverlap = oldY > platform.y && newY <= platform.y + platform.height;

    return horizontalOverlap && verticalOverlap && velocityY > 0;
  };

  const updateGameObjects = (deltaTime) => {
    const moveDistance = speed * deltaTime;

    setObstacles(prev => {
      const updated = prev.map(obs => ({
        ...obs,
        x: obs.x - moveDistance,
      })).filter(obs => obs.x > -100);

      updated.forEach(obs => {
        if (checkObstacleCollision(obs)) {
          if (canDestroyObstacles && obs.destroyable) {
            obs.x = -200;
            setScore(s => s + 20);
          } else if (canFireBreath && obs.destroyable) {
            obs.x = -200;
            setScore(s => s + 25);
          } else {
            handleHit();
          }
        }
      });

      return updated.filter(o => o.x > -200);
    });

    setPlatforms(prev => prev.map(p => ({
      ...p,
      x: p.x - moveDistance,
    })).filter(p => p.x > -150));

    setCoinsList(prev => {
      const updated = prev.map(coin => ({
        ...coin,
        x: coin.x - moveDistance,
      })).filter(coin => coin.x > -30);

      updated.forEach(coin => {
        if (!coin.collected && checkCoinCollision(coin)) {
          coin.collected = true;
          setCoins(c => c + 1);
          setScore(s => s + 10);
        }
      });

      return updated.filter(c => !c.collected);
    });
  };

  const checkObstacleCollision = (obstacle) => {
    const petX = 60;
    const petBottom = petY._value;
    const petTop = petBottom + PET_SIZE;
    const petRight = petX + PET_SIZE;
    const obsLeft = obstacle.x;
    const obsRight = obstacle.x + obstacle.width;
    const obsBottom = obstacle.y;
    const obsTop = obstacle.y + obstacle.height;

    return (
      petRight > obsLeft + 10 &&
      petX < obsRight - 10 &&
      petTop > obsBottom + 5 &&
      petBottom < obsTop - 5
    );
  };

  const checkCoinCollision = (coin) => {
    const petX = 60;
    const petCenter = petY._value + PET_SIZE / 2;
    const distance = Math.sqrt(
      Math.pow(petX + PET_SIZE / 2 - coin.x, 2) +
      Math.pow(petCenter - coin.y, 2)
    );

    return distance < 35;
  };

  const handleHit = () => {
    if (hasExtraLife) {
      setHasExtraLife(false);
      Alert.alert('💚 Extra Life Used!', 'Careful now!');
    } else if (canResurrect && !resurrected) {
      setResurrected(true);
      setScore(s => s + 100);
      Alert.alert('🔥 Phoenix Rebirth!', 'You rise from the ashes!');
    } else {
      endGame();
    }
  };

  const jump = () => {
    if (gameState !== 'playing') return;
    
    if (isFlying) {
      setVelocityY(FLYING_FLAP_FORCE);
      
      Animated.sequence([
        Animated.timing(petFlap, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(petFlap, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      const canJump = isOnGround || jumpCount < maxJumps;

      if (canJump) {
        const agility = pet?.stats?.agility || 50;
        const agilityBonus = Math.min((agility - 50) * 2, 100);
        const jumpPower = LAND_JUMP_VELOCITY - agilityBonus;
        
        setVelocityY(jumpPower);
        setIsOnGround(false);
        setJumpCount(prev => prev + 1);

        if (hasSpeedBoost) {
          setSpeed(prev => Math.min(prev * 1.3, 600));
          if (speedBoostTimer) clearTimeout(speedBoostTimer);
          const timer = setTimeout(() => {
            setSpeed(INITIAL_SPEED);
          }, 1500);
          setSpeedBoostTimer(timer);
        }

        Animated.timing(petRotation, {
          toValue: petRotation._value + 360,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const endGame = async () => {
    setGameState('gameOver');
    if (gameLoop.current) cancelAnimationFrame(gameLoop.current);
    if (spawnTimer.current) clearInterval(spawnTimer.current);

    const finalScore = Math.floor(score);
    const finalCoins = coins;

    try {
      const battleStats = await getBattleStats() || {};
      const currentStats = battleStats.runner || { highScore: 0, totalRuns: 0, todayGems: 0 };

      currentStats.todayGems = currentStats.todayGems ?? currentStats.dailyGems ?? 0;

      const DAILY_GEM_LIMIT = 50;
      const isAtDailyLimit = currentStats.todayGems >= DAILY_GEM_LIMIT;

      let gemsEarned = calculateRunnerReward(finalScore);

      if (isAtDailyLimit) {
        gemsEarned = 0;
      } else if (currentStats.todayGems + gemsEarned > DAILY_GEM_LIMIT) {
        gemsEarned = DAILY_GEM_LIMIT - currentStats.todayGems;
      }

      const xpEarned = Math.min(Math.floor(finalScore / 2), 100);

      if (gemsEarned > 0) {
        await addGems(gemsEarned);
      }
      if (xpEarned > 0) {
        await addXP(xpEarned);
      }

      const newStats = {
        highScore: Math.max(currentStats.highScore, finalScore),
        totalRuns: (currentStats.totalRuns || 0) + 1,
        todayGems: currentStats.todayGems + gemsEarned,
      };

      battleStats.runner = newStats;
      await saveBattleStats(battleStats);

      const isNewHighScore = finalScore > currentStats.highScore;

      let message = `Score: ${finalScore}\nCoins: ${finalCoins}\nDistance: ${Math.floor(distance)}m\n\n`;
      if (isAtDailyLimit) {
        message += `⚠️ Daily limit (50/50)\n\nCome back tomorrow!`;
      } else {
        message += `💎 Gems: ${gemsEarned}\n`;
        message += `⭐ XP: ${xpEarned}\n`;
        message += `Daily: ${newStats.todayGems}/50\n\n`;

        if (isNewHighScore) {
          message += `🎉 NEW HIGH SCORE!`;
        }
      }

      Alert.alert('Game Over!', message, [
        { text: 'Menu', onPress: () => navigation.goBack() },
        { text: 'Again', onPress: () => {
          loadGameData();
          setGameState('ready');
        }},
      ]);
    } catch (error) {
      console.error('Error ending game:', error);
      Alert.alert('Error', 'Failed to save game results');
    }
  };

  if (!petConfig || !pet) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (gameState === 'ready') {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {petConfig.emoji || petConfig.icon} {petConfig.name}'s Adventure
          </Text>
          <Text style={styles.subtitle}>
            {isFlying ? 'Fly through the skies!' : 'Run and jump!'}
          </Text>
        </View>
        
        <View style={styles.abilityCard}>
          <Text style={styles.abilityTitle}>
            ✨ Special Ability: {petConfig.runnerAbility?.name || 'None'}
          </Text>
          <Text style={styles.abilityDesc}>
            {petConfig.runnerAbility?.description || 'No special ability'}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How to Play</Text>
          <Text style={styles.infoText}>
            {isFlying ? '🎮 Tap to flap wings and fly higher' : '🎮 Tap to jump over obstacles'}
          </Text>
          <Text style={styles.infoText}>💎 Collect coins for points</Text>
          <Text style={styles.infoText}>⭐ Grab power-ups</Text>
          <Text style={styles.infoText}>🏆 Survive as long as possible</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>🏆 High Score</Text>
            <Text style={styles.statValue}>{highScore}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>💎 Today</Text>
            <Text style={styles.statValue}>{dailyGems}/50</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.startBtn, !hasEnoughEnergy(5) && styles.startBtnDisabled]}
          onPress={startGame}
          disabled={!hasEnoughEnergy(5)}
        >
          <Text style={styles.startBtnText}>
            {!hasEnoughEnergy(5) ? 'Need 5 Energy' : '▶️ Start Adventure'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  const rotation = petRotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const flapScale = petFlap.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.9],
  });

  const currentIcon = isFlying ?
    (velocityY < 0 ? (petConfig.flyingIcon || petConfig.emoji) : (petConfig.glidingIcon || petConfig.emoji)) :
    (isOnGround ? (petConfig.runningIcon || petConfig.emoji) : (petConfig.jumpingIcon || petConfig.emoji));

  return (
    <TouchableOpacity style={styles.gameContainer} activeOpacity={1} onPress={jump}>
      <View style={styles.hud}>
        <Text style={styles.hudText}>Score: {Math.floor(score)}</Text>
        <Text style={styles.hudText}>💎 {coins}</Text>
        <Text style={styles.hudText}>{Math.floor(distance)}m</Text>
      </View>

      {hasExtraLife && (
        <View style={[styles.abilityIndicator, { top: 80 }]}>
          <Text style={styles.abilityText}>💚 Extra Life</Text>
        </View>
      )}
      {resurrected && (
        <View style={[styles.abilityIndicator, { top: 80 }]}>
          <Text style={styles.abilityText}>🔥 Reborn</Text>
        </View>
      )}
      {speedBoostTimer && (
        <View style={[styles.abilityIndicator, { top: 120 }]}>
          <Text style={styles.abilityText}>⚡ Speed Boost</Text>
        </View>
      )}

      <View style={[styles.gameArea, { height: GAME_HEIGHT }]}>
        <View style={styles.sky} />

        {!isFlying && platforms.map(platform => (
          <View
            key={platform.id}
            style={[
              styles.platform,
              {
                left: platform.x,
                bottom: platform.y - GROUND_HEIGHT,
                width: platform.width,
                height: platform.height,
              },
            ]}
          />
        ))}

        {coinsList.map(coin => (
          <Text
            key={coin.id}
            style={[
              styles.coin,
              {
                left: coin.x,
                bottom: coin.y - GROUND_HEIGHT,
              },
            ]}
          >
            💎
          </Text>
        ))}

        {obstacles.map(obs => (
          <View
            key={obs.id}
            style={[
              styles.obstacle,
              {
                left: obs.x,
                bottom: obs.y - GROUND_HEIGHT,
                width: obs.width,
                height: obs.height,
              },
            ]}
          >
            <Text style={styles.obstacleIcon}>{obs.icon}</Text>
          </View>
        ))}

        <Animated.View
          style={[
            styles.pet,
            {
              bottom: Animated.subtract(petY, GROUND_HEIGHT),
              transform: isFlying ? 
                [{ scale: flapScale }] : 
                [{ rotate: rotation }],
            },
          ]}
        >
          <Text style={styles.petIcon}>{currentIcon}</Text>
        </Animated.View>

        <View style={styles.ground}>
          <View style={styles.groundPattern} />
        </View>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          {isFlying ? '👆 TAP TO FLAP' : '👆 TAP TO JUMP'}
        </Text>
        {maxJumps > 1 && !isFlying && (
          <Text style={styles.instructionSubtext}>
            {maxJumps} jumps available!
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#A463BF',
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  abilityCard: {
    backgroundColor: '#FFE082',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFA000',
  },
  abilityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F57C00',
    marginBottom: 5,
  },
  abilityDesc: {
    fontSize: 14,
    color: '#666',
  },
  infoCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  statsCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A463BF',
  },
  startBtn: {
    backgroundColor: '#A463BF',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  startBtnDisabled: {
    backgroundColor: '#CCC',
  },
  startBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backBtn: {
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 15,
    alignItems: 'center',
  },
  backBtnText: {
    color: '#A463BF',
    fontSize: 16,
  },
  gameContainer: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  hud: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 10,
  },
  hudText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  abilityIndicator: {
    position: 'absolute',
    top: 80,
    left: 20,
    backgroundColor: 'rgba(255,215,0,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 10,
  },
  abilityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  gameArea: {
    width: '100%',
    position: 'relative',
    marginTop: 120,
  },
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: GROUND_HEIGHT,
    backgroundColor: '#87CEEB',
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: GROUND_HEIGHT,
    backgroundColor: '#8B7355',
  },
  groundPattern: {
    height: 3,
    backgroundColor: '#654321',
  },
  pet: {
    position: 'absolute',
    left: 60,
    width: PET_SIZE,
    height: PET_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petIcon: {
    fontSize: 45,
  },
  platform: {
    position: 'absolute',
    backgroundColor: '#8B4513',
    borderRadius: 5,
    borderTopWidth: 3,
    borderTopColor: '#A0522D',
  },
  coin: {
    position: 'absolute',
    fontSize: 25,
  },
  obstacle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  obstacleIcon: {
    fontSize: 40,
  },
  instructions: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  instructionSubtext: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
    marginTop: 5,
  },
});
