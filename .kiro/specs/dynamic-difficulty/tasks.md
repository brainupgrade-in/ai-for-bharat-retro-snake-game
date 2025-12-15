# Tasks: Dynamic Difficulty Adjustment

## Task List

### Difficulty Manager
- [ ] Create js/difficulty.js with DifficultyManager class (US-030)
- [ ] Implement loadMetrics() from localStorage (US-032)
- [ ] Implement saveMetrics() to localStorage (US-032)
- [ ] Implement difficulty presets (Easy, Medium, Hard) (US-030)
- [ ] Implement mode switching logic (US-030)

### Metrics Tracking
- [ ] Implement recordGame() method (US-032)
- [ ] Track games played count (US-032)
- [ ] Track wins and calculate win rate (US-032)
- [ ] Track total and average score (US-032)
- [ ] Track survival time per game (US-032)
- [ ] Implement recentGames array (last 10) (US-032)
- [ ] Track current and best streak (US-032)

### Adaptive Calculations
- [ ] Implement getWinRate() method (US-031)
- [ ] Implement getAvgScore() method (US-031)
- [ ] Implement getRecentPerformance() method (US-031)
- [ ] Implement calculateAdaptiveSpeed() (US-031)
- [ ] Implement calculateAIAggression() (US-031)
- [ ] Implement calculateMistakeRate() (US-031)
- [ ] Implement adjustDifficulty() with lerp (US-031)
- [ ] Call adjustDifficulty() on game over (US-031)

### Skill Estimation
- [ ] Implement estimateSkillLevel() method (US-033)
- [ ] Implement getSkillLabel() helper (US-033)
- [ ] Create skill progress bar UI component (US-033)

### Settings Integration
- [ ] Add difficulty selector to Options menu (US-030)
- [ ] Implement radio button UI for difficulty (US-030)
- [ ] Persist difficulty setting in localStorage (US-030)
- [ ] Display current difficulty in status bar (US-030)
- [ ] Apply difficulty when game starts (US-030)

### Statistics Dialog
- [ ] Create Statistics dialog HTML structure (US-033)
- [ ] Style dialog with Win95 modal appearance (US-033)
- [ ] Display games played and win rate (US-033)
- [ ] Display high score and average score (US-033)
- [ ] Display current and best streak (US-033)
- [ ] Display skill level with progress bar (US-033)
- [ ] Add OK button to close dialog (US-033)
- [ ] Add Reset button with confirmation (US-033)
- [ ] Implement resetStats() method (US-033)

### Game Integration
- [ ] Get gameSpeed from DifficultyManager (US-030)
- [ ] Get aiAggression from DifficultyManager (US-031)
- [ ] Get aiMistakeRate from DifficultyManager (US-031)
- [ ] Call recordGame() when game ends (US-032)

### Testing
- [ ] Test manual difficulty selection works (US-030)
- [ ] Test adaptive increases after wins (US-031)
- [ ] Test adaptive decreases after losses (US-031)
- [ ] Test metrics persist across sessions (US-032)
- [ ] Test statistics display correctly (US-033)
- [ ] Test reset clears all data (US-033)
