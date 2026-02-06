# 🎤 mic_wave

Live audio visualization web app that captures microphone input and displays real-time frequency waveforms.

## Tech Stack

- **Vanilla JavaScript** (ES6 modules)
- **Web Audio API** - Microphone capture and audio analysis
- **Canvas API** - Real-time waveform rendering
- **Vite** - Build tool and dev server

## Features

- 🎙️ Real-time microphone audio capture
- 📊 Live frequency visualization (32-bar spectrum analyzer)
- 🎨 Beautiful gradient waveform display
- 📱 Responsive design
- 🔒 Browser compatibility checks

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Deploy to Vercel via GitHub

1. **Push to GitHub:**
   ```bash
   # Create a new repository on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/mic_wave.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "New Project"
   - Import your `mic_wave` repository
   - Vercel will auto-detect Vite settings
   - Click "Deploy"

3. **That's it!** Your app will be live at `https://your-project.vercel.app`

### Manual Deployment

Alternatively, you can deploy using Vercel CLI:
```bash
npm i -g vercel
vercel
```

## Usage

1. Click the "Record" button
2. Allow microphone permissions when prompted
3. Watch the live waveform visualization
4. Click "Stop" to end recording

## Browser Support

Requires modern browsers with support for:
- `navigator.mediaDevices.getUserMedia()`
- `AudioContext` or `webkitAudioContext`

Works best in Chrome, Firefox, Safari, and Edge.

## Status

✅ Complete - Ready for deployment
