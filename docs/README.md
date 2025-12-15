# 🐍 Retro Snake AI - Production Build

A nostalgic recreation of the classic Snake game with authentic Windows 95 styling and modern AI-powered enhancements using Amazon Bedrock.

## 🎮 **Live Demo**

This is the production build ready for deployment on GitHub Pages or any static hosting service.

## 🚀 **Features**

### Core Gameplay
- ✅ Classic Snake mechanics with arrow key controls
- ✅ Authentic Windows 95 UI with proper window chrome
- ✅ Smooth 60 FPS gameplay with pixelated rendering
- ✅ High score persistence with localStorage
- ✅ Responsive design (desktop to mobile)

### AI-Powered Enhancements
- 🤖 **AI Opponent Snake** - Powered by Amazon Bedrock Claude 3 Haiku
- 💬 **Real-time AI Commentary** - Witty 90s-themed gaming humor
- 📈 **Dynamic Difficulty Adjustment** - Adapts to player skill level
- 🔄 **Intelligent Fallback Systems** - Works offline with A* pathfinding

### Audio & Mobile
- 🔊 **Retro 8-bit Sound Effects** - Generated with Web Audio API
- 📱 **Mobile Touch Controls** - Touch-friendly interface
- 🎚️ **Interactive Sound Controls** - Volume adjustment and muting

## 🔧 **Setup Instructions**

### For AI Features (Optional)
1. Get AWS credentials with Bedrock access
2. Open the game and go to **Options → AWS Settings**
3. Enter your credentials:
   - **Region:** `ap-south-1` (or your preferred region)
   - **Access Key ID:** Your AWS access key
   - **Secret Access Key:** Your AWS secret key
4. Click **"Test"** to verify connection
5. Enable **AI Opponent** and **Commentary** in Options menu

### Required AWS Permissions
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel"
            ],
            "Resource": [
                "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-20240307-v1:0"
            ]
        }
    ]
}
```

## 🌐 **Deployment**

### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Set source to `docs/` folder
3. Game will be available at `https://username.github.io/repository-name/`

### Other Static Hosts
- **Netlify:** Drag and drop the `docs/` folder
- **Vercel:** Deploy from GitHub with build directory set to `docs/`
- **AWS S3:** Upload contents of `docs/` folder to S3 bucket

## 🎯 **Game Controls**

### Desktop
- **Arrow Keys** - Move snake
- **SPACE** - Start game
- **P or ESC** - Pause/Resume
- **R** - Restart after game over

### Mobile
- **Touch Controls** - On-screen directional buttons
- **Tap** - Interact with menus and buttons

### Sound Controls
- **Click sound icon** - Toggle sound on/off
- **Right-click sound icon** - Adjust volume
- **Scroll on sound icon** - Quick volume adjust

## 🏗️ **Technical Stack**

- **Frontend:** Vanilla JavaScript (ES6+), HTML5 Canvas, CSS3
- **AI Integration:** Amazon Bedrock with Claude 3 Haiku
- **Authentication:** AWS Signature Version 4 (custom implementation)
- **Audio:** Web Audio API for retro sound generation
- **Storage:** localStorage for settings and high scores
- **Deployment:** Static files (no backend required)

## 📊 **Performance**

- **Game Loop:** 60 FPS
- **AI Response Time:** < 500ms (with fallback)
- **Bundle Size:** < 500KB (no external dependencies)
- **Browser Support:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 🎨 **Author**

**Rajesh Gheware**  
[LinkedIn](https://linkedin.com/in/rajesh-gheware)

*Created for the AI for Bharat hackathon*

## 📄 **License**

This project is open source and available under the MIT License.

---

**Enjoy the nostalgic gaming experience with modern AI enhancements!** 🎮🤖