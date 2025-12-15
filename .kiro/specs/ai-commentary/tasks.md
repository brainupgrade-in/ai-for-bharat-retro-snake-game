# Tasks: AI Game Commentary

## Task List

### Commentary Manager
- [x] Create js/commentary.js with CommentaryManager class (US-020)
- [x] Implement event listener registration (US-020)
- [x] Implement rate limiting with cooldown timer (US-022)
- [x] Implement priority-based event handling (US-022)
- [x] Add event queue for pending comments (US-022)

### Bedrock Integration
- [x] Design commentary prompt template (US-020)
- [x] Implement generateCommentary() with Bedrock call (US-020)
- [x] Implement response parsing (US-020)
- [x] Add temperature setting for creative responses (US-020)

### Event Triggers
- [x] Implement PLAYER_EAT event trigger (US-021)
- [x] Implement AI_EAT event trigger (US-021)
- [x] Implement SCORE_MILESTONE event (every 5 points) (US-021)
- [x] Implement NEAR_MISS detection and event (US-021)
- [x] Implement PLAYER_WIN event (US-021)
- [x] Implement AI_WIN event (US-021)
- [x] Implement DRAW event (US-021)
- [x] Implement COMEBACK event (lead change) (US-021)

### UI Components
- [x] Create commentary display box HTML element (US-020)
- [x] Style box with Win95 inset border (US-020)
- [x] Implement typing effect animation (US-020)
- [x] Implement auto-clear after 4 seconds (US-020)
- [x] Position box below game canvas (US-020)

### Fallback System
- [x] Create fallback comment arrays per event type (US-024)
- [x] Implement getFallbackComment() method (US-024)
- [x] Handle API errors with fallback (US-024)
- [x] Handle timeout with fallback (US-024)

### Settings
- [x] Add commentary toggle in Options menu (US-023)
- [x] Implement toggle persistence in localStorage (US-023)
- [x] Skip API calls when disabled (US-023)
- [x] Show/hide commentary box based on setting (US-023)

### Testing
- [x] Test commentary appears on player score (US-021)
- [x] Test cooldown prevents rapid comments (US-022)
- [x] Test critical events override cooldown (US-022)
- [x] Test fallback comments work offline (US-024)
- [x] Test toggle disables all commentary (US-023)
