# Design: Dynamic Difficulty Adjustment

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Game Engine                        │
│                       │                              │
│              Game Over Event                         │
│                       │                              │
│                       ▼                              │
│            ┌─────────────────────┐                   │
│            │ DifficultyManager   │                   │
│            │ - recordGame()      │                   │
│            │ - adjustDifficulty()│                   │
│            └──────────┬──────────┘                   │
│                       │                              │
│         ┌─────────────┼─────────────┐                │
│         │             │             │                │
│         ▼             ▼             ▼                │
│   ┌───────────┐ ┌───────────┐ ┌───────────┐         │
│   │  Metrics  │ │  Presets  │ │ Adaptive  │         │
│   │  Storage  │ │  (E/M/H)  │ │Calculator │         │
│   └───────────┘ └───────────┘ └───────────┘         │
│                       │                              │
│                       ▼                              │
│            ┌─────────────────────┐                   │
│            │   Game Parameters   │                   │
│            │   - gameSpeed       │                   │
│            │   - aiAggression    │                   │
│            │   - aiMistakeRate   │                   │
│            └─────────────────────┘                   │
└─────────────────────────────────────────────────────┘
```

## Components

### DifficultyManager Class
```javascript
class DifficultyManager {
  mode: 'EASY' | 'MEDIUM' | 'HARD' | 'ADAPTIVE'
  metrics: Metrics
  currentSpeed: number
  currentAggression: number
  currentMistakeRate: number

  constructor()
  loadMetrics(): Metrics
  saveMetrics()
  recordGame(result: GameResult)
  getWinRate(): number
  getAvgScore(): number
  getRecentPerformance(): number
  calculateAdaptiveDifficulty()
  getGameSpeed(): number
  getAIAggression(): number
  getAIMistakeRate(): number
  estimateSkillLevel(): number
  resetStats()
}
```

### Metrics Schema
```javascript
{
  gamesPlayed: number,
  gamesWon: number,
  totalScore: number,
  highScore: number,
  totalSurvivalTime: number,
  recentGames: Array<{
    won: boolean,
    score: number,
    survivalTime: number
  }>,
  currentStreak: number,
  bestStreak: number
}
```

### GameResult Schema
```javascript
{
  won: boolean,
  score: number,
  survivalTime: number,
  aiScore: number
}
```

## Difficulty Presets

| Level | Speed (ms) | AI Aggression | AI Mistakes |
|-------|------------|---------------|-------------|
| EASY | 200 | 0.3 | 20% |
| MEDIUM | 150 | 0.5 | 5% |
| HARD | 100 | 0.8 | 0% |
| ADAPTIVE | Dynamic | Dynamic | Dynamic |

### Speed Range
- Minimum (fastest): 75ms
- Maximum (slowest): 250ms

## Adaptive Algorithm

### Speed Calculation
```javascript
function calculateAdaptiveSpeed(metrics) {
  let speed = 150; // Base: Medium

  const winRate = this.getWinRate();

  // Winning too much? Speed up
  if (winRate > 0.7) speed -= 25;
  else if (winRate > 0.6) speed -= 15;

  // Losing too much? Slow down
  if (winRate < 0.3) speed += 25;
  else if (winRate < 0.4) speed += 15;

  // Recent performance adjustment
  const recent = this.getRecentPerformance();
  if (recent > 0.8) speed -= 15;
  else if (recent < 0.4) speed += 15;

  // Clamp to valid range
  return Math.max(75, Math.min(250, speed));
}
```

### AI Aggression Calculation
```javascript
function calculateAIAggression(metrics) {
  let aggression = 0.5; // Base

  const winRate = this.getWinRate();

  if (winRate > 0.6) aggression += 0.2;
  else if (winRate < 0.4) aggression -= 0.2;

  return Math.max(0.1, Math.min(0.9, aggression));
}
```

### AI Mistake Rate
```javascript
function calculateMistakeRate(metrics) {
  const winRate = this.getWinRate();

  if (winRate > 0.7) return 0;
  if (winRate > 0.5) return 0.05;
  if (winRate > 0.3) return 0.15;
  return 0.25;
}
```

### Gradual Adjustment
```javascript
function adjustDifficulty() {
  if (this.mode !== 'ADAPTIVE') return;

  const targetSpeed = calculateAdaptiveSpeed();
  const targetAggression = calculateAIAggression();
  const targetMistake = calculateMistakeRate();

  // Lerp at 10% per adjustment
  this.currentSpeed = lerp(this.currentSpeed, targetSpeed, 0.1);
  this.currentAggression = lerp(this.currentAggression, targetAggression, 0.1);
  this.currentMistakeRate = lerp(this.currentMistakeRate, targetMistake, 0.1);
}

function lerp(current, target, factor) {
  return current + (target - current) * factor;
}
```

## Skill Estimation

```javascript
function estimateSkillLevel() {
  const winWeight = 0.4;
  const scoreWeight = 0.3;
  const streakWeight = 0.3;

  const winScore = Math.min(this.getWinRate() / 0.7, 1);
  const avgNorm = Math.min(this.getAvgScore() / 30, 1);
  const streakNorm = Math.min(this.metrics.bestStreak / 10, 1);

  const skill = (winScore * winWeight) +
                (avgNorm * scoreWeight) +
                (streakNorm * streakWeight);

  return Math.round(skill * 100);
}

function getSkillLabel(percent) {
  if (percent >= 90) return 'Expert';
  if (percent >= 70) return 'Advanced';
  if (percent >= 50) return 'Intermediate';
  if (percent >= 30) return 'Beginner';
  return 'Novice';
}
```

## Statistics Dialog UI

```
┌─────────────────────────────────────────┐
│          Your Statistics                │
├─────────────────────────────────────────┤
│                                         │
│  Games Played:     47                   │
│  Games Won:        23                   │
│  Win Rate:         48.9%                │
│                                         │
│  High Score:       34                   │
│  Average Score:    12.4                 │
│                                         │
│  Current Streak:   3                    │
│  Best Streak:      7                    │
│                                         │
│  Skill Level:      ████████░░ 78%       │
│  Rank:             Advanced             │
│                                         │
├─────────────────────────────────────────┤
│            [ OK ]  [ Reset ]            │
└─────────────────────────────────────────┘
```

## localStorage Schema

```javascript
// Key: 'snakeMetrics'
{
  "gamesPlayed": 47,
  "gamesWon": 23,
  "totalScore": 583,
  "highScore": 34,
  "totalSurvivalTime": 4520,
  "recentGames": [
    {"won": true, "score": 12, "survivalTime": 95},
    {"won": false, "score": 8, "survivalTime": 72},
    // ... last 10 games
  ],
  "currentStreak": 3,
  "bestStreak": 7
}

// Key: 'snakeSettings'
{
  "difficulty": "ADAPTIVE",
  "aiEnabled": true,
  "commentaryEnabled": true,
  "soundEnabled": true
}
```

## Menu Integration

```
Options
├── AI Opponent     [✓]
├── Commentary      [✓]
├── Sound           [✓]
├── ─────────────────
├── Difficulty      ►  ┌──────────────┐
│                      │ ○ Easy       │
│                      │ ○ Medium     │
│                      │ ○ Hard       │
│                      │ ● Adaptive   │
│                      └──────────────┘
└── ─────────────────

Help
├── How to Play
├── Statistics...
└── About
```
