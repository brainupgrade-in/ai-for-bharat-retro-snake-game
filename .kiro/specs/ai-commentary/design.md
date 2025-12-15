# Design: AI Game Commentary

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Game Engine                       │
│                        │                             │
│              Game Events Emitted                     │
│    ┌──────────┬────────┴────────┬──────────┐        │
│    │          │                 │          │        │
│    ▼          ▼                 ▼          ▼        │
│ PLAYER_EAT  AI_EAT         NEAR_MISS   GAME_OVER   │
└────┬──────────┬─────────────────┬──────────┬───────┘
     │          │                 │          │
     └──────────┴────────┬────────┴──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  CommentaryManager  │
              │  - Rate limiter     │
              │  - Event queue      │
              │  - Priority handler │
              └──────────┬──────────┘
                         │
           ┌─────────────┼─────────────┐
           │             │             │
           ▼             ▼             ▼
    ┌───────────┐ ┌───────────┐ ┌───────────┐
    │  Bedrock  │ │ Fallback  │ │  Display  │
    │   API     │ │ Comments  │ │  Manager  │
    └───────────┘ └───────────┘ └───────────┘
```

## Components

### CommentaryManager Class
```javascript
class CommentaryManager {
  enabled: boolean
  lastCommentTime: number
  cooldown: number
  queue: Array<Event>
  aiService: AIService

  constructor(aiService, config)
  triggerEvent(event)
  async generateCommentary(event): Promise<string>
  displayCommentary(text)
  buildPrompt(event): string
  getFallbackComment(event): string
}
```

### Event Types
```javascript
const EVENT_TYPES = {
  PLAYER_EAT: { priority: 'medium', template: 'player_score' },
  AI_EAT: { priority: 'medium', template: 'ai_score' },
  SCORE_MILESTONE: { priority: 'high', template: 'milestone' },
  NEAR_MISS: { priority: 'low', template: 'close_call' },
  PLAYER_WIN: { priority: 'critical', template: 'player_victory' },
  AI_WIN: { priority: 'critical', template: 'ai_victory' },
  DRAW: { priority: 'critical', template: 'draw' },
  COMEBACK: { priority: 'high', template: 'comeback' }
};
```

## UI Layout

```
┌─────────────────────────────────────────────┐
│ [Title Bar]                                 │
├─────────────────────────────────────────────┤
│ [Menu Bar]                                  │
├─────────────────────────────────────────────┤
│                                             │
│              [Game Canvas]                  │
│                                             │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ "Totally tubular! That's 5 points!" 🎮  │ │ ← Commentary Box
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ [Status Bar]                                │
└─────────────────────────────────────────────┘
```

### Commentary Box Styling
```css
.commentary-box {
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 12px;
  background: #FFFFFF;
  border: 2px inset #808080;
  padding: 8px;
  min-height: 24px;
  text-align: center;
  overflow: hidden;
}
```

## Bedrock Prompt Template

```
You are a witty 1990s video game show host commentating on a Snake game.

Event: {eventType}
Details: {eventDetails}
Score: Player {playerScore} - AI {aiScore}

Generate a short, funny comment (10-15 words max).
Requirements:
- Use 90s slang (radical, tubular, bogus, all that, etc.)
- Match the energy of the event
- Keep it family-friendly

Reply with just the commentary text.
```

### Event-Specific Details
```javascript
const EVENT_DETAILS = {
  PLAYER_EAT: 'Player just scored! Now has {score} points.',
  AI_EAT: 'AI just scored! Now has {score} points. Tease the player.',
  SCORE_MILESTONE: 'Player hit {score} points! Big milestone!',
  NEAR_MISS: 'Player almost crashed into {obstacle}! Close call!',
  PLAYER_WIN: 'Player won with {score} points! Celebrate!',
  AI_WIN: 'AI won with {score} points. Console the player.',
  DRAW: 'Both snakes crashed! It\'s a tie!',
  COMEBACK: 'Trailing player just took the lead!'
};
```

## Rate Limiting Logic

```javascript
async triggerEvent(event) {
  if (!this.enabled) return;

  const now = Date.now();
  const eventConfig = EVENT_TYPES[event.type];

  // Critical events override cooldown
  if (eventConfig.priority !== 'critical') {
    if (now - this.lastCommentTime < this.cooldown) {
      return; // Still in cooldown
    }
  }

  this.lastCommentTime = now;

  try {
    const comment = await this.generateCommentary(event);
    this.displayCommentary(comment);
  } catch (error) {
    const fallback = this.getFallbackComment(event);
    this.displayCommentary(fallback);
  }
}
```

## Display Animation

```javascript
async displayCommentary(text) {
  const box = document.getElementById('commentary-box');

  // Typing effect
  box.textContent = '';
  for (let i = 0; i < text.length; i++) {
    box.textContent += text[i];
    await sleep(25);
  }

  // Auto-clear after 4 seconds
  setTimeout(() => {
    box.textContent = '';
  }, 4000);
}
```

## Fallback Comments

```javascript
const FALLBACK_COMMENTS = {
  PLAYER_EAT: [
    "Nice catch!",
    "Score! Keep it up!",
    "Nom nom nom!",
    "That's how it's done!"
  ],
  AI_EAT: [
    "AI strikes back!",
    "Competition heating up!",
    "The AI is hungry too!"
  ],
  SCORE_MILESTONE: [
    "Milestone reached!",
    "You're on fire!",
    "Impressive score!"
  ],
  NEAR_MISS: [
    "Whoa, close call!",
    "That was close!",
    "Watch out!"
  ],
  PLAYER_WIN: [
    "Victory! Well played!",
    "You win! Champion!",
    "Game over - You won!"
  ],
  AI_WIN: [
    "AI wins this round.",
    "Better luck next time!",
    "The AI got you!"
  ],
  DRAW: [
    "It's a draw!",
    "Both down! Tie game!",
    "Mutual destruction!"
  ]
};
```

## Sample Generated Comments

| Event | Example Comment |
|-------|-----------------|
| PLAYER_EAT | "All that and a bag of chips! Radical score!" |
| AI_EAT | "Uh oh! The AI's getting phat! Step it up, dawg!" |
| SCORE_MILESTONE | "Five points! That's totally tubular, dude!" |
| NEAR_MISS | "Whoa! Almost pulled a Titanic there! Close call!" |
| PLAYER_WIN | "PLAYER WINS! That was phat! You're the bomb!" |
| AI_WIN | "Bogus! AI takes it. Don't have a cow, man!" |
| COMEBACK | "Plot twist! Underdog takes the lead! As if!" |

## Error Handling

| Scenario | Action |
|----------|--------|
| API timeout | Use fallback comment |
| Invalid response | Use fallback comment |
| Rate limited | Skip comment |
| Network error | Use fallback comment |
