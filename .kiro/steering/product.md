# Product Requirements Document: Retro Snake AI

## Overview

Retro Snake AI is a browser-based Snake game featuring a Windows 95-style retro aesthetic with modern AI-powered gameplay enhancements. The game combines nostalgic visuals with intelligent AI features powered by Amazon Bedrock.

## Problem Statement

Classic retro games lack modern AI capabilities that could make them more engaging and competitive. Players seeking nostalgic gaming experiences miss out on the personalized, adaptive gameplay that modern AI can provide.

## Solution

A Snake game that:
- Recreates the authentic Windows 95 visual experience
- Features an AI-controlled opponent snake powered by Amazon Bedrock
- Provides entertaining AI-generated commentary during gameplay
- Adapts difficulty dynamically based on player performance

## Target Users

- Developers participating in AI for Bharat hackathon
- Retro gaming enthusiasts
- Players interested in AI-enhanced gaming experiences
- Anyone nostalgic for 90s computing aesthetics

## Core Features

### 1. Classic Snake Gameplay
- Grid-based movement with arrow key controls
- Food collection to grow the snake
- Collision detection (walls, self, opponent)
- Score tracking and high score persistence
- Game states: Start, Playing, Paused, Game Over

### 2. Windows 95 Retro UI
- Authentic Win95 window chrome with title bar
- Classic gray beveled buttons and panels
- Pixelated system fonts (MS Sans Serif style)
- Retro color palette (#c0c0c0 gray, navy blue, etc.)
- Optional CRT scanline effect
- Classic menu bar (Game, Options, Help)
- 8-bit sound effects

### 3. AI Opponent Snake (Amazon Bedrock)
- Second snake controlled by AI
- Competes for the same food items
- Strategic decision-making via Bedrock Claude model
- Configurable aggression levels
- Visual distinction from player snake

### 4. AI Game Commentary
- Real-time witty comments during gameplay
- Triggered by game events (eating food, near misses, scores)
- 90s-themed humor and gaming references
- Displayed in retro text box/ticker
- Rate-limited to avoid API overuse

### 5. Dynamic Difficulty Adjustment
- Tracks player performance metrics
- Adjusts game speed progressively
- Modifies AI opponent behavior
- Provides balanced challenge

## Non-Functional Requirements

### Performance
- 60 FPS game loop minimum
- AI decisions < 500ms response time
- Graceful degradation if AI unavailable
- Works offline for core gameplay

### Browser Support
- Chrome, Firefox, Safari, Edge (latest versions)
- Desktop-first design
- Responsive layout (optional mobile support)

### Accessibility
- Keyboard-only navigation
- High contrast mode option
- Pause functionality

## User Stories

### Epic 1: Core Gameplay
- US1.1: As a player, I want to control a snake using arrow keys so I can navigate the game board
- US1.2: As a player, I want to collect food to grow my snake and increase my score
- US1.3: As a player, I want to see my current score and high score
- US1.4: As a player, I want to pause and resume the game
- US1.5: As a player, I want to restart after game over

### Epic 2: Retro Experience
- US2.1: As a player, I want the game to look like a Windows 95 application
- US2.2: As a player, I want to hear retro sound effects
- US2.3: As a player, I want classic menu options (New Game, Exit, About)

### Epic 3: AI Opponent
- US3.1: As a player, I want to compete against an AI snake
- US3.2: As a player, I want the AI to make intelligent moves
- US3.3: As a player, I want to toggle AI opponent on/off
- US3.4: As a player, I want to select AI difficulty level

### Epic 4: AI Commentary
- US4.1: As a player, I want entertaining commentary during gameplay
- US4.2: As a player, I want comments to react to game events
- US4.3: As a player, I want to toggle commentary on/off

### Epic 5: Difficulty System
- US5.1: As a player, I want the game to adapt to my skill level
- US5.2: As a player, I want to see my current difficulty level
- US5.3: As a player, I want to manually select difficulty

## Success Metrics

- Game is playable and enjoyable
- AI opponent provides meaningful competition
- Commentary enhances entertainment value
- Retro aesthetic is convincing and nostalgic
- All features work reliably in demo

## Out of Scope (v1.0)

- Multiplayer over network
- Mobile touch controls
- Leaderboard system
- Multiple game modes
- Custom themes/skins

## Technical Constraints

- Minimal AWS dependencies (Bedrock only for AI)
- No backend server required (static hosting)
- Client-side game logic
- API calls to Bedrock via browser SDK or simple proxy

## Timeline

5-day development sprint for hackathon submission (deadline: Dec 15, 2025)
