# Tasks: AI Opponent Snake

## Task List

### AI Service Setup
- [x] Create js/ai-service.js with AIService class (US-011)
- [x] Set up AWS SDK for Bedrock (browser bundle) (US-011)
- [x] Implement Bedrock client initialization (US-011)
- [x] Create game state serialization for prompt (US-011)
- [x] Design and implement AI move prompt template (US-011)
- [x] Implement getAIMove() method with Bedrock call (US-011)
- [x] Implement response parsing and validation (US-011)

### Fallback System
- [x] Create js/ai-pathfinding.js with A* algorithm (US-014)
- [x] Implement heuristic function (Manhattan distance) (US-014)
- [x] Implement path reconstruction (US-014)
- [x] Implement getLocalAIMove() fallback method (US-014)
- [x] Add timeout handling (500ms max) (US-014)
- [x] Implement safe random move when no path found (US-014)

### AI Snake Integration
- [x] Add AI snake to Game class (US-010)
- [x] Configure AI snake with distinct color (orange) (US-010)
- [x] Integrate AI moves into game loop (US-010)
- [x] Handle AI-player collision detection (US-010)
- [x] Handle AI-food collision (grow + respawn) (US-010)
- [x] Handle AI-wall collision (AI loses) (US-010)
- [x] Handle AI self-collision (AI loses) (US-010)
- [x] Handle head-to-head collision (draw) (US-010)

### Toggle & Settings
- [x] Add AI toggle option in Options menu (US-012)
- [x] Implement toggle persistence in localStorage (US-012)
- [x] Add AI status indicator in status bar (US-012)
- [x] Implement single-player mode when AI disabled (US-012)

### Difficulty System
- [x] Implement Easy difficulty (20% mistakes) (US-013)
- [x] Implement Medium difficulty (5% mistakes) (US-013)
- [x] Implement Hard difficulty (0% mistakes) (US-013)
- [x] Add difficulty selector in Options menu (US-013)
- [x] Apply mistake rate to AI decisions (US-013)
- [x] Adjust Bedrock temperature per difficulty (US-013)

### Error Handling
- [x] Handle Bedrock API timeout gracefully (US-014)
- [x] Handle network errors with fallback (US-014)
- [x] Handle invalid API responses (US-014)
- [x] Cache last valid move for emergencies (US-011)
- [x] Log AI decision errors for debugging (US-011)

### Testing
- [ ] Test AI spawns correctly when enabled (US-010)
- [ ] Test AI moves toward food (US-011)
- [ ] Test AI avoids walls (US-011)
- [ ] Test AI fallback works offline (US-014)
- [ ] Test AI toggle works correctly (US-012)
- [ ] Test difficulty levels affect behavior (US-013)
