# TimelyApp

> TimelyApp is an ADHD-friendly task and time awareness app built with Expo React Native (iOS + Android). It combines a daily task dashboard, Pomodoro-style focus timer, ADHD-friendly task chunking, and a distraction tracker that turns interruptions into data — not guilt. All data is stored locally on-device using SQLite. Activity data (step count) is surfaced via expo-sensors where available, with graceful fallback on unsupported devices. No account or internet connection required.

---

## Features

- **Daily Overview** — See today's tasks, progress rings, and step count at a glance
- **Task List + Chunking** — Create tasks with time estimates; auto-chunk long tasks into bite-sized sub-steps
- **Focus Timer** — Pomodoro-style sessions with configurable work/break intervals and haptic feedback
- **Distraction Tracker** — Log and review distractions with positive, reframing language

## Tech Stack

| | |
|---|---|
| Framework | Expo SDK 51 (managed workflow) |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| UI | React Native Paper |
| Storage | expo-sqlite (local SQLite, no cloud) |
| Activity | expo-sensors (Pedometer, graceful fallback) |

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npx expo start
```

Then scan the QR code with the **Expo Go** app on your device, or press `i` for iOS Simulator / `a` for Android Emulator.

## Project Structure

```
app/          Expo Router screens (tabs, modals, stacks)
src/
  components/ Reusable UI components
  db/         SQLite schema, migrations, and query functions
  store/      Context API + useReducer state management
  hooks/      Custom hooks (timer, tasks, sensors)
  utils/      Time formatting, ADHD chunking, reframe messages
  types/      TypeScript interfaces
```

## Screenshots

_Coming soon_

## Contributing

Pull requests welcome. Please open an issue first to discuss proposed changes.

## License

MIT © Jordan King
