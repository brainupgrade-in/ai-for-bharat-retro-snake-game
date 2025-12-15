# Tasks: AI Game Commentary

## Task List

### Commentary Manager
- [ ] Create js/commentary.js with CommentaryManager class (US-020)
- [ ] Implement event listener registration (US-020)
- [ ] Implement rate limiting with cooldown timer (US-022)
- [ ] Implement priority-based event handling (US-022)
- [ ] Add event queue for pending comments (US-022)

### Bedrock Integration
- [ ] Design commentary prompt template (US-020)
- [ ] Implement generateCommentary() with Bedrock call (US-020)
- [ ] Implement response parsing (US-020)
- [ ] Add temperature setting for creative responses (US-020)

### Event Triggers
- [ ] Implement PLAYER_EAT event trigger (US-021)
- [ ] Implement AI_EAT event trigger (US-021)
- [ ] Implement SCORE_MILESTONE event (every 5 points) (US-021)
- [ ] Implement NEAR_MISS detection and event (US-021)
- [ ] Implement PLAYER_WIN event (US-021)
- [ ] Implement AI_WIN event (US-021)
- [ ] Implement DRAW event (US-021)
- [ ] Implement COMEBACK event (lead change) (US-021)

### UI Components
- [ ] Create commentary display box HTML element (US-020)
- [ ] Style box with Win95 inset border (US-020)
- [ ] Implement typing effect animation (US-020)
- [ ] Implement auto-clear after 4 seconds (US-020)
- [ ] Position box below game canvas (US-020)

### Fallback System
- [ ] Create fallback comment arrays per event type (US-024)
- [ ] Implement getFallbackComment() method (US-024)
- [ ] Handle API errors with fallback (US-024)
- [ ] Handle timeout with fallback (US-024)

### Settings
- [ ] Add commentary toggle in Options menu (US-023)
- [ ] Implement toggle persistence in localStorage (US-023)
- [ ] Skip API calls when disabled (US-023)
- [ ] Show/hide commentary box based on setting (US-023)

### Testing
- [ ] Test commentary appears on player score (US-021)
- [ ] Test cooldown prevents rapid comments (US-022)
- [ ] Test critical events override cooldown (US-022)
- [ ] Test fallback comments work offline (US-024)
- [ ] Test toggle disables all commentary (US-023)
