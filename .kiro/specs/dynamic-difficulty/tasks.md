# Tasks: Dynamic Difficulty Adjustment

## Task List

### Difficulty Manager
- [x] Create js/difficulty.js with DifficultyManager class (US-030)
- [x] Implement loadMetrics() from localStorage (US-032)
- [x] Implement saveMetrics() to localStorage (US-032)
- [x] Implement difficulty presets (Easy, Medium, Hard) (US-030)
- [x] Implement mode switching logic (US-030)

### Metrics Tracking
- [x] Implement recordGame() method (US-032)
- [x] Track games played count (US-032)
- [x] Track wins and calculate win rate (US-032)
- [x] Track total and average score (US-032)
- [x] Track survival time per game (US-032)
- [x] Implement recentGames array (last 10) (US-032)
- [x] Track current and best streak (US-032)

### Adaptive Calculations
- [x] Implement getWinRate() method (US-031)
- [x] Implement getAvgScore() method (US-031)
- [x] Implement getRecentPerformance() method (US-031)
- [x] Implement calculateAdaptiveSpeed() (US-031)
- [x] Implement calculateAIAggression() (US-031)
- [x] Implement calculateMistakeRate() (US-031)
- [x] Implement adjustDifficulty() with lerp (US-031)
- [x] Call adjustDifficulty() on game over (US-031)

### Skill Estimation
- [x] Implement estimateSkillLevel() method (US-033)
- [x] Implement getSkillLabel() helper (US-033)
- [x] Create skill progress bar UI component (US-033)

### Settings Integration
- [x] Add difficulty selector to Options menu (US-030)
- [x] Implement radio button UI for difficulty (US-030)
- [x] Persist difficulty setting in localStorage (US-030)
- [x] Display current difficulty in status bar (US-030)
- [x] Apply difficulty when game starts (US-030)

### Statistics Dialog
- [x] Create Statistics dialog HTML structure (US-033)
- [x] Style dialog with Win95 modal appearance (US-033)
- [x] Display games played and win rate (US-033)
- [x] Display high score and average score (US-033)
- [x] Display current and best streak (US-033)
- [x] Display skill level with progress bar (US-033)
- [x] Add OK button to close dialog (US-033)
- [x] Add Reset button with confirmation (US-033)
- [x] Implement resetStats() method (US-033)

### Game Integration
- [x] Get gameSpeed from DifficultyManager (US-030)
- [x] Get aiAggression from DifficultyManager (US-031)
- [x] Get aiMistakeRate from DifficultyManager (US-031)
- [x] Call recordGame() when game ends (US-032)

### Testing
- [x] Test manual difficulty selection works (US-030)
- [x] Test adaptive increases after wins (US-031)
- [x] Test adaptive decreases after losses (US-031)
- [x] Test metrics persist across sessions (US-032)
- [x] Test statistics display correctly (US-033)
- [x] Test reset clears all data (US-033)
