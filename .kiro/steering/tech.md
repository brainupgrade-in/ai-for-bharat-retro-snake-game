# Technology Stack

## Overview
Retro Snake AI is built with minimal dependencies, focusing on vanilla JavaScript and Amazon Bedrock for AI features.

## Frontend

### Core Technologies
- **Language:** JavaScript (ES6+)
- **Rendering:** HTML5 Canvas API
- **Styling:** CSS3 with Win95 aesthetic
- **Build Tool:** Vite (optional, for development)

### No Framework Dependencies
- Pure vanilla JavaScript for maximum compatibility
- No React, Vue, or Angular
- Zero runtime dependencies for core gameplay

## AI Integration

### Amazon Bedrock
- **Model:** Claude 3 Haiku (anthropic.claude-3-haiku-20240307-v1:0)
- **SDK:** @aws-sdk/client-bedrock-runtime
- **Use Cases:**
  - AI opponent decision-making
  - Commentary generation

### Fallback Systems
- A* pathfinding algorithm for offline AI
- Pre-written fallback comments

## Styling

### CSS Framework
- Custom Win95 CSS or 98.css library
- Retro fonts (MS Sans Serif style)
- Classic color palette (#C0C0C0, #000080)

## Storage

### Client-Side Only
- localStorage for:
  - High scores
  - Player metrics
  - User preferences
  - Difficulty settings

## Hosting

### Static Deployment
- GitHub Pages (primary)
- AWS S3 + CloudFront (optional)
- No backend server required

## Development Tools

### Recommended
- VS Code or Kiro IDE
- Live Server extension
- Chrome DevTools

### Optional
- Vite for hot reload
- ESLint for code quality

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

## AWS Services

| Service | Purpose | Required |
|---------|---------|----------|
| Amazon Bedrock | AI inference | Yes |
| Cognito | Auth (optional) | No |
| S3 | Hosting (optional) | No |
| CloudFront | CDN (optional) | No |
