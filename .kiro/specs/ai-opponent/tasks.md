# Tasks: AI Opponent Snake

## Task List

### AI Service Setup
- [x] Create js/ai-service.js with AIService class (US-011)
- [ ] Set up AWS SDK for Bedrock (browser bundle) (US-011)
- [ ] Implement Bedrock client initialization (US-011)
- [ ] Create game state serialization for prompt (US-011)
- [ ] Design and implement AI move prompt template (US-011)
- [ ] Implement getAIMove() method with Bedrock call (US-011)
- [ ] Implement response parsing and validation (US-011)

### Fallback System
- [x] Create js/ai-pathfinding.js with A* algorithm (US-014)
- [ ] Implement heuristic function (Manhattan distance) (US-014)
- [ ] Implement path reconstruction (US-014)
- [ ] Implement getLocalAIMove() fallback method (US-014)
- [ ] Add timeout handling (500ms max) (US-014)
- [ ] Implement safe random move when no path found (US-014)

### AI Snake Integration
- [x] Add AI snake to Game class (US-010)
- [ ] Configure AI snake with distinct color (orange) (US-010)
- [ ] Integrate AI moves into game loop (US-010)
- [ ] Handle AI-player collision detection (US-010)
- [ ] Handle AI-food collision (grow + respawn) (US-010)
- [ ] Handle AI-wall collision (AI loses) (US-010)
- [ ] Handle AI self-collision (AI loses) (US-010)
- [ ] Handle head-to-head collision (draw) (US-010)

### Toggle & Settings
- [ ] Add AI toggle option in Options menu (US-012)
- [ ] Implement toggle persistence in localStorage (US-012)
- [ ] Add AI status indicator in status bar (US-012)
- [ ] Implement single-player mode when AI disabled (US-012)

### Difficulty System
- [ ] Implement Easy difficulty (20% mistakes) (US-013)
- [ ] Implement Medium difficulty (5% mistakes) (US-013)
- [ ] Implement Hard difficulty (0% mistakes) (US-013)
- [ ] Add difficulty selector in Options menu (US-013)
- [ ] Apply mistake rate to AI decisions (US-013)
- [ ] Adjust Bedrock temperature per difficulty (US-013)

### Error Handling
- [ ] Handle Bedrock API timeout gracefully (US-014)
- [ ] Handle network errors with fallback (US-014)
- [ ] Handle invalid API responses (US-014)
- [ ] Cache last valid move for emergencies (US-011)
- [ ] Log AI decision errors for debugging (US-011)

### Testing
- [ ] Test AI spawns correctly when enabled (US-010)
- [ ] Test AI moves toward food (US-011)
- [ ] Test AI avoids walls (US-011)
- [ ] Test AI fallback works offline (US-014)
- [ ] Test AI toggle works correctly (US-012)
- [ ] Test difficulty levels affect behavior (US-013)
