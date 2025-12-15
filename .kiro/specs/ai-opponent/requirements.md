# Requirements: AI Opponent Snake

## Overview
An AI-controlled snake powered by Amazon Bedrock that competes against the player for food, providing challenging and intelligent gameplay.

## User Stories

### US-010: AI Snake Existence
**As a** player
**I want to** compete against an AI-controlled snake
**So that** the game is more challenging and engaging

**Acceptance Criteria:**
- [ ] WHEN AI is enabled THE SYSTEM SHALL display a second snake on the game board
- [ ] WHEN rendering THE SYSTEM SHALL give the AI snake a distinct color (orange)
- [ ] WHEN the game runs THE SYSTEM SHALL move the AI snake independently
- [ ] WHEN food spawns THE SYSTEM SHALL have the AI compete for it

### US-011: Intelligent Movement
**As a** player
**I want** the AI to make smart moves
**So that** it provides a fair challenge

**Acceptance Criteria:**
- [ ] WHEN making decisions THE SYSTEM SHALL use Amazon Bedrock for AI logic
- [ ] WHEN moving THE SYSTEM SHALL navigate the AI toward food
- [ ] WHEN near walls THE SYSTEM SHALL have the AI avoid collisions
- [ ] WHEN near its body THE SYSTEM SHALL have the AI avoid self-collision
- [ ] WHEN near player THE SYSTEM SHALL have the AI attempt to avoid collision

### US-012: AI Toggle
**As a** player
**I want to** enable/disable the AI opponent
**So that** I can choose single or versus mode

**Acceptance Criteria:**
- [ ] WHEN in Options menu THE SYSTEM SHALL provide an AI toggle
- [ ] WHEN toggled THE SYSTEM SHALL persist the setting in localStorage
- [ ] WHEN AI disabled THE SYSTEM SHALL run classic single-player mode
- [ ] WHEN displaying status bar THE SYSTEM SHALL show AI on/off indicator

### US-013: AI Difficulty
**As a** player
**I want to** adjust AI difficulty level
**So that** I can match my skill level

**Acceptance Criteria:**
- [ ] WHEN on Easy THE SYSTEM SHALL make the AI miss optimal moves 20% of time
- [ ] WHEN on Medium THE SYSTEM SHALL make the AI play competently
- [ ] WHEN on Hard THE SYSTEM SHALL make the AI play aggressively and optimally
- [ ] WHEN difficulty changes THE SYSTEM SHALL adjust AI decision quality

### US-014: Offline Fallback
**As a** player
**I want** the AI to work without internet
**So that** I can play anywhere

**Acceptance Criteria:**
- [ ] WHEN Bedrock API fails THE SYSTEM SHALL use local A* pathfinding
- [ ] WHEN offline THE SYSTEM SHALL provide comparable AI behavior
- [ ] WHEN API times out (>500ms) THE SYSTEM SHALL fall back immediately

## Constraints

- AI response time: < 500ms
- Bedrock model: Claude 3 Haiku
- Fallback: A* pathfinding algorithm
- API calls: Max 1 per game tick
