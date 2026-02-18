# 🐦 Tweety's Interactive Adventure

An interactive story game built with Next.js, featuring choices, mini-games, and a special gift unlock system. Perfect for creating personalized web-based gifts!

## ✨ Features

- 📖 **Interactive Story System** - JSON-based story with branching narratives
- 🎮 **3 Mini-Games**:
  - Catch Hearts - Catch falling hearts before they disappear
  - Simple Puzzle - Drag and drop puzzle solving
  - Match Pairs - Memory card matching game
- 🎁 **Gift Unlock System** - Unlock a special gift screen after winning enough games
- 🎨 **Tweety-Inspired Design** - Cute, playful UI with pastel colors
- 🎬 **Lottie Animations** - Support for animated Tweety character
- 🔊 **Audio Support** - Voice-over audio for each scene
- 📱 **Responsive Design** - Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd D:\Boody\projects\aya
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
aya/
├── public/
│   ├── story/
│   │   └── story.json          # Story data with scenes, choices, and mini-games
│   └── assets/
│       ├── lottie/             # Lottie animation JSON files
│       ├── img/                # Background images and assets
│       └── audio/              # Voice-over audio files
├── src/
│   ├── app/
│   │   ├── layout.jsx          # Root layout
│   │   ├── page.jsx            # Main page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── StoryEngine.jsx     # Main story orchestrator
│   │   ├── SceneRenderer.jsx   # Scene display component
│   │   ├── Choices.jsx          # Choice buttons
│   │   ├── Tweety.jsx          # Lottie animation component
│   │   ├── GiftScreen.jsx      # Gift unlock screen
│   │   └── MiniGames/
│   │       ├── CatchHearts.jsx
│   │       ├── SimplePuzzle.jsx
│   │       └── MatchPairs.jsx
│   └── utils/
│       ├── audioHelper.js      # Audio playback utility
│       └── constants.js        # Game constants
├── tailwind.config.js          # Tailwind configuration
├── next.config.js               # Next.js configuration
└── package.json
```

## 📝 Customizing the Story

Edit `public/story/story.json` to customize your story:

### Scene Structure

```json
{
  "requiredWins": 2,
  "startSceneId": "scene_1",
  "scenes": {
    "scene_1": {
      "id": "scene_1",
      "type": "story",
      "text": "Your story text here",
      "backgroundImage": "/assets/img/scene1-bg.jpg",
      "lottieAnimation": "/assets/lottie/tweety-welcome.json",
      "audio": "/assets/audio/scene1.mp3",
      "choices": [
        {
          "text": "Choice 1",
          "nextSceneId": "scene_2"
        }
      ]
    }
  }
}
```

### Scene Types

- **story** - Regular story scene with text and choices
- **minigame** - Triggers a mini-game
- **gift** - Gift screen (unlocked after winning enough games)

### Mini-Game Types

- `catchHearts` - Catch falling hearts game
- `simplePuzzle` - Drag and drop puzzle
- `matchPairs` - Memory card matching

## 🎨 Adding Assets

### Lottie Animations

1. Download or create Lottie animations from [LottieFiles](https://lottiefiles.com/)
2. Place JSON files in `public/assets/lottie/`
3. Reference them in `story.json` using the path `/assets/lottie/filename.json`

### Images

1. Add background images to `public/assets/img/`
2. Reference them in `story.json` using paths like `/assets/img/scene1-bg.jpg`
3. The game will use gradient backgrounds as fallbacks if images aren't found

### Audio

1. Add MP3 or WAV files to `public/assets/audio/`
2. Reference them in `story.json` using paths like `/assets/audio/scene1.mp3`
3. Audio will auto-play when scenes load (subject to browser autoplay policies)

## 🎮 Mini-Games

### Catch Hearts
- Click/tap falling hearts to catch them
- Catch 15 hearts within 30 seconds to win
- Fully playable and responsive

### Simple Puzzle
- Click pieces to swap them
- Solve the 3x3 puzzle within 60 seconds
- Visual feedback for correct positions

### Match Pairs
- Flip cards to find matching pairs
- Match all 8 pairs to win
- Tracks moves and progress

## 🎁 Gift System

The gift screen unlocks when the player wins enough mini-games (set by `requiredWins` in `story.json`). Customize the gift screen by:

1. Adding a gift image to `public/assets/img/gift.jpg`
2. Editing the `gift_screen` scene in `story.json`
3. Customizing the `GiftScreen.jsx` component

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **lottie-react** - Lottie animation support

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the Tweety color palette:

```js
colors: {
  tweety: {
    yellow: '#FFD54F',
    'yellow-bright': '#FFEB3B',
    pink: '#FFB3D9',
    'sky-blue': '#87CEEB',
    'cloud-white': '#F5F5F5',
  },
}
```

### Animations

Customize animations in `tailwind.config.js` or use Framer Motion props directly in components.

## 📄 License

This project is created as a gift - feel free to customize and use as you wish!

## 💝 Notes

- All asset paths are placeholders - add your own images, animations, and audio
- The game works without assets (uses fallbacks)
- Browser autoplay policies may require user interaction before audio plays
- Test on mobile devices for best responsive experience

---

Made with ❤️ for a special friend!

