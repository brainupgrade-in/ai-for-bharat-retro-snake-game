# Requirements: AI Game Commentary

## Overview
Real-time AI-generated witty commentary that reacts to game events, providing entertainment value and a nostalgic 90s game show experience.

## User Stories

### US-020: Event-Based Commentary
**As a** player
**I want** entertaining comments during gameplay
**So that** the game is more fun and engaging

**Acceptance Criteria:**
- [ ] WHEN an event occurs THE SYSTEM SHALL display commentary in a retro text box
- [ ] WHEN generating THE SYSTEM SHALL create witty, 90s-themed comments
- [ ] WHEN displayed THE SYSTEM SHALL not obstruct the gameplay area
- [ ] WHEN generating THE SYSTEM SHALL use Amazon Bedrock for AI commentary

### US-021: Commentary Events
**As a** player
**I want** comments on important game moments
**So that** achievements feel celebrated

**Acceptance Criteria:**
- [ ] WHEN the player eats food THE SYSTEM SHALL trigger commentary
- [ ] WHEN the AI eats food THE SYSTEM SHALL trigger commentary
- [ ] WHEN a score milestone is reached (every 5 pts) THE SYSTEM SHALL trigger commentary
- [ ] WHEN a near miss occurs THE SYSTEM SHALL trigger commentary
- [ ] WHEN the game ends THE SYSTEM SHALL trigger game over commentary

### US-022: Rate Limiting
**As a** player
**I want** commentary to be spaced out
**So that** it doesn't become overwhelming

**Acceptance Criteria:**
- [ ] WHEN a comment is shown THE SYSTEM SHALL wait 5 seconds before the next
- [ ] WHEN a critical event occurs THE SYSTEM SHALL override the cooldown
- [ ] WHEN the API is busy THE SYSTEM SHALL queue the event

### US-023: Commentary Toggle
**As a** player
**I want to** turn commentary on/off
**So that** I can play without distractions if preferred

**Acceptance Criteria:**
- [ ] WHEN in Options menu THE SYSTEM SHALL provide a commentary toggle
- [ ] WHEN disabled THE SYSTEM SHALL not make any commentary API calls
- [ ] WHEN toggled THE SYSTEM SHALL persist the setting in localStorage

### US-024: Offline Fallback
**As a** player
**I want** commentary even when offline
**So that** the feature works without internet

**Acceptance Criteria:**
- [ ] WHEN API fails THE SYSTEM SHALL use pre-written fallback comments
- [ ] WHEN offline THE SYSTEM SHALL still show relevant comments

## Constraints

- Comment cooldown: 5 seconds
- Max comment length: 50 characters
- Bedrock model: Claude 3 Haiku
- Comment display time: 4 seconds
