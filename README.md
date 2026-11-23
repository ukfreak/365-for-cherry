# 365 — A Reason Every Day ❤️

A beautiful, romantic, installable Progressive Web App (PWA) designed as a personal birthday gift from a girl to her boyfriend.

Every day, the app unlocks one new reason explaining why she loves him, accompanied by a daily push reminder, photo memories, and voice notes — culminating in a grand anniversary finale on **Day 365**.

---

## 🌟 Key Features

### 1. 💌 Daily Reasons System (365 Unique Reasons)
- Contains **365 unique, authentic, intimate reasons** written in first-person across 10 categories:
  - *His Personality*
  - *His Smile & Expressions*
  - *His Habits & Quirks*
  - *His Kindness & Warmth*
  - *His Efforts & Dedication*
  - *His Little Imperfections*
  - *Our Memories*
  - *The Way He Makes Me Feel*
  - *Things I Admire About Him*
  - *Our Future Together*
- **Personalization Editor**: Every single reason can be reviewed, edited, rewritten, or personalized before gifting.
- **Sealed Love Card**: Each day's reason starts with a sealed wax heart seal. Tapping reveals the reason with an animated card opening and romantic confetti!
- **Favorites & Notes**: Mark reasons as favorites and attach personal notes or memories.

### 2. 📅 Days Counter & Journey Tracking
- Strictly calculated from the configured `journeyStartDate` (not simply incremented upon refresh).
- Prominent counter showing:
  - Current Day (e.g., `Day 047 of 365`)
  - Days Completed & Days Remaining
  - Progress percentage with moving heart indicator
- **Anti-Spoiler Guard**: Future days are locked with a lock badge and the exact calendar date when they unlock.

### 3. 🔔 Reliable Daily Notifications & Push Infrastructure
- **Time Picker**: Choose the preferred daily reminder time (e.g., `09:00 AM`).
- **Web Push + Service Worker**:
  - Full Web Push implementation using VAPID keys and standard Service Worker (`sw.js`).
  - Does NOT pretend that closed browsers can run client-side `setTimeout` timers.
  - Included Node/Express push server (`server/index.js`) with `node-cron` scheduler that runs in the background and sends push notifications at the scheduled time in the user's timezone.
  - Notification payload: *"A little reminder from someone who loves you ❤️"*.
  - Tapping notification directly opens the app to the day's reason without spoiling future reasons.
- **Test Reminder Button**: Instant test notification button to verify permissions on phone or desktop.

### 4. 📸 "Our Little Memories" (Romantic Scrapbook)
- Vintage Polaroid layout with washi tape, gentle tilts, and date stamps.
- Upload romantic couple photographs (stored client-side in **IndexedDB**, never compressed to low quality).
- Add titles, dates, tags, and heartfelt story captions.
- Fullscreen Lightbox viewer with romantic zoom.
- Add, edit, and delete memories.

### 5. 🎙️ "A Little Something for You" (Voice Notes Diary)
- Direct microphone recording via `MediaRecorder` API.
- Microphone permission requested only when user initiates recording.
- Real-time animated audio waveforms and recording timer.
- In-app preview player before saving.
- Cassette-style audio diary with play/pause, seek slider, and duration counters.
- Audio blobs stored securely in **IndexedDB**.

### 6. 🎁 Day 365 Grand Surprise
- The emotional climax of the year!
- Locked until Day 365 (with countdown remaining).
- Unlocked with a dramatic golden wax-sealed anniversary letter.
- Exploding heart & flower petal confetti.
- Features the exact required tribute:
  > *"365 days. 365 reasons. And somehow, I still haven't run out of reasons to love you. This was never just about counting days. It was about reminding you, every single day, how special you are to me. And if I had another 365 days, I'd choose you all over again."*
- Couple's celebration photo upload and personalized letter editor.

### 7. 🔒 Girlfriend Preparation / "Preview Mode"
- In **Settings**, toggle **Preview / God Mode**:
  - Allows unlocking all days for review.
  - Lets you simulate any day from 1 to 365 (e.g., test Day 365 immediately).
  - Perfect for the girlfriend to review and customize everything before handing over the gift!

### 8. 💾 Backup & Transfer (Export / Import)
- Export all customized reasons, memories, voice notes, and settings as a single `.json` backup file.
- Easily import onto his phone or browser.

---

## 🎨 Romantic Design Palette
- **Pastel Pink**: `#F8DDE6`
- **Blush Pink**: `#F3C6D5`
- **Cream**: `#FFF9F5`
- **Soft Lavender**: `#E9E2F5`
- **Muted Rose**: `#C77D98`
- **Dark Warm Brown**: `#59434A`
- **Typography**: Playfair Display, Great Vibes / Dancing Script, Plus Jakarta Sans.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Frontend Development Server
```bash
npm run dev
```
The app will run at `http://localhost:5173`.

### 3. Run Web Push Notification Server (Optional for background push)
```bash
npm run server
```
The server will run at `http://localhost:3001` and automatically generate your VAPID keys in `server/vapid.json`.

### 4. Build for Production
```bash
npm run build
```

---

## 📱 PWA Installation Guide

### On iPhone / iPad (iOS 16.4+)
1. Open Safari and navigate to the app URL.
2. Tap the **Share** button (box with upward arrow).
3. Tap **Add to Home Screen**.
4. Tap **Add**.
5. Launch the app from the Home Screen icon. Notifications and offline support will be fully active!

### On Android
1. Open Chrome.
2. An **Install** button will appear in the top header, or tap the three dots and select **Install App**.
3. The app installs with standalone display and native badge notifications.
