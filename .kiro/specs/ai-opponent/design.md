# Design: AI Opponent Snake

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Game Engine                       │
│  ┌─────────────┐         ┌─────────────────────┐    │
│  │Player Snake │         │     AI Snake        │    │
│  │ (keyboard)  │         │  (AIService)        │    │
│  └─────────────┘         └──────────┬──────────┘    │
│                                     │               │
└─────────────────────────────────────┼───────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
            ┌───────────┐    ┌───────────────┐   ┌──────────┐
            │  Bedrock  │    │   A* Fallback │   │  Cache   │
            │   API     │    │   Algorithm   │   │ (last    │
            │           │    │               │   │  move)   │
            └───────────┘    └───────────────┘   └──────────┘
```

## Components

### AIService Class
```javascript
class AIService {
  client: BedrockRuntimeClient | null
  enabled: boolean
  model: string
  fallbackEnabled: boolean
  lastMove: string
  pendingRequest: Promise | null

  constructor(config)
  async initialize(credentials)
  async getAIMove(gameState): Promise<string>
  getLocalAIMove(gameState): string
  buildPrompt(gameState): string
  parseResponse(response): string
}
```

### AI Snake Configuration
```javascript
{
  body: [{x: 15, y: 15}, {x: 16, y: 15}, {x: 17, y: 15}],
  direction: 'LEFT',
  color: '#FF6600',
  headColor: '#FF3300',
  enabled: true,
  aggression: 0.5,
  mistakeRate: 0.05
}
```

## Bedrock Integration

### Request Format
```javascript
{
  modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
  contentType: 'application/json',
  accept: 'application/json',
  body: JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 10,
    temperature: 0.3,
    messages: [{
      role: 'user',
      content: prompt
    }]
  })
}
```

### Prompt Template
```
You are playing Snake. Grid is 20x20 (0-19 valid).

Your head: (8, 5)
Your body: [(8,5), (7,5), (6,5)]
Current direction: RIGHT
Food at: (15, 12)
Enemy head: (3, 3)
Enemy body: [(3,3), (3,4), (3,5)]

Rules:
- Cannot reverse direction
- Must avoid walls (x<0, x>19, y<0, y>19)
- Must avoid your body
- Should avoid enemy snake
- Goal: reach food before enemy

Reply with exactly one word: UP, DOWN, LEFT, or RIGHT
```

### Response Parsing
```javascript
function parseResponse(response) {
  const text = response.content[0].text.trim().toUpperCase();
  const valid = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

  if (valid.includes(text)) return text;

  // Extract from longer response
  for (const dir of valid) {
    if (text.includes(dir)) return dir;
  }

  return null; // Trigger fallback
}
```

## A* Fallback Algorithm

```javascript
function aStar(start, goal, obstacles, gridSize) {
  const openSet = [start];
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();

  gScore.set(key(start), 0);
  fScore.set(key(start), heuristic(start, goal));

  while (openSet.length > 0) {
    const current = getLowestF(openSet, fScore);

    if (current.x === goal.x && current.y === goal.y) {
      return reconstructPath(cameFrom, current);
    }

    openSet.splice(openSet.indexOf(current), 1);

    for (const neighbor of getNeighbors(current, gridSize)) {
      if (obstacles.has(key(neighbor))) continue;

      const tentativeG = gScore.get(key(current)) + 1;

      if (tentativeG < (gScore.get(key(neighbor)) ?? Infinity)) {
        cameFrom.set(key(neighbor), current);
        gScore.set(key(neighbor), tentativeG);
        fScore.set(key(neighbor), tentativeG + heuristic(neighbor, goal));

        if (!openSet.find(n => n.x === neighbor.x && n.y === neighbor.y)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return null; // No path found
}

function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
```

## Decision Flow

```
Game Tick
    │
    ▼
┌─────────────────┐
│ Get Game State  │
│ - AI position   │
│ - Food position │
│ - Player pos    │
│ - Obstacles     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Check Cache     │
│ (< 150ms old?)  │
└────────┬────────┘
         │
    ┌────┴────┐
    │ Cached? │
    └────┬────┘
         │
    Yes  │  No
    ┌────┴────┐
    │         ▼
    │  ┌─────────────────┐
    │  │ Call Bedrock    │
    │  │ (with timeout)  │
    │  └────────┬────────┘
    │           │
    │      ┌────┴────┐
    │      │ Success?│
    │      └────┬────┘
    │           │
    │      Yes  │  No
    │      ┌────┴────┐
    │      │         ▼
    │      │  ┌─────────────┐
    │      │  │ A* Fallback │
    │      │  └──────┬──────┘
    │      │         │
    │      ▼         ▼
    │   ┌─────────────────┐
    │   │ Parse Response  │
    │   └────────┬────────┘
    │            │
    ▼            ▼
┌─────────────────────┐
│ Apply Move to Snake │
└─────────────────────┘
```

## Difficulty Settings

| Level | Temp | Mistake % | Aggression | Speed Mod |
|-------|------|-----------|------------|-----------|
| Easy | 0.7 | 20% | 0.3 | +50ms |
| Medium | 0.3 | 5% | 0.5 | 0ms |
| Hard | 0.1 | 0% | 0.8 | -25ms |

### Mistake Implementation
```javascript
function applyMistake(optimalMove, mistakeRate) {
  if (Math.random() < mistakeRate) {
    const moves = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    const others = moves.filter(m => m !== optimalMove);
    return others[Math.floor(Math.random() * others.length)];
  }
  return optimalMove;
}
```

## Collision Rules

| Scenario | Outcome |
|----------|---------|
| AI hits wall | AI dies, player wins |
| AI hits self | AI dies, player wins |
| AI hits player body | AI dies, player wins |
| Player hits AI body | Player dies, AI wins |
| Head-to-head | Both die, draw |
| AI eats food | AI grows, new food |

## Error Handling

| Error | Action |
|-------|--------|
| Network timeout | Use A* fallback |
| API error | Use A* fallback |
| Invalid response | Use last valid move |
| No path found | Pick safe random move |
