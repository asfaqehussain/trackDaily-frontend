# trackDaily

A smart task & habit tracker built with React Native (Expo + TypeScript). Features an interactive calendar view, habit streaks, offline-first support with optimistic updates, and pull-to-refresh on all main screens.

## Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo (blank-typescript) |
| Data Fetching | TanStack Query v5 |
| Offline Storage | react-native-mmkv v3 |
| Navigation | React Navigation v7 (native-stack + bottom-tabs) |
| HTTP | Axios |
| Icons | Custom SVG icons |
| Network Detection | expo-network (polling) |
| Fonts | DM Sans, Fraunces, JetBrains Mono |

## Folder Structure

```
src/
├── api/           # Axios client + per-resource API functions
├── components/    # Reusable UI (CalendarView, HabitRow, TaskItem, etc.)
├── hooks/         # useAuth, useTasks, useHabits, useNetworkStatus
├── navigation/    # AppNavigator, AuthStack, MainTabs
├── screens/       # auth/, habits/, tasks/, today/ screens
├── store/         # MMKV stores (auth, tasks, habits, queue)
├── sync/          # Offline queue replay manager
├── theme/         # Colors, typography, spacing, shadows
├── types/         # TypeScript interfaces
└── utils/         # date helpers, streak computation
```

## Screens

| Screen | Description |
|---|---|
| **Today** | Dashboard showing today's pending tasks and habits due |
| **Tasks** | Calendar view with monthly navigation, dots for days with tasks, per-day task list |
| **Habits** | Habit list with streak tracking, check-in circles, longest streak banner |
| **Profile** | User profile and settings |

## Setup

### Environment

Create a `.env` file (or set in `app.config.ts`):

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

Default is `http://localhost:3000` if unset.

### Development Build

`react-native-mmkv` does **not** work with Expo Go. You must use a development build:

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

### EAS Build

```bash
npm install -g eas-cli
eas build --profile development --platform ios
```

## Running

```bash
npm install
npx expo run:ios   # or run:android
```

## Features

### Interactive Calendar
- Monthly calendar with swipeable month navigation
- Dots indicate days with tasks
- Tap a date to view its tasks
- "Today" button to jump back to current date
- Pull-to-refresh to sync latest data

### Task Management
- Create, edit, delete tasks with title, description, due date, time, and category
- Visual categories (Work, Personal, Health, Learning, Finance, Other)
- Mark tasks complete from the list view
- Optimistic UI updates for instant feedback

### Habit Tracking
- Create habits with custom icons and colors
- Daily/weekdays/custom repeat schedules
- Check in with a single tap
- Automatic streak computation from check-in history
- Progress dots showing streak level
- Detail view with stats and heatmap grid

### Offline-First
- All data cached in MMKV for instant loading
- Mutations queued when offline, replayed automatically when back online
- Optimistic updates ensure UI responds immediately
- Offline banner shows current sync status

## API Endpoints

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/auth/signup` | Register → `{ token, user }` |
| POST | `/auth/login` | Login → `{ token, user }` |
| POST | `/auth/verify-email` | Resend verification email |

### Tasks
| Method | Path | Description |
|---|---|---|
| GET | `/tasks` | Get all tasks |
| POST | `/tasks` | Create task |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

### Habits
| Method | Path | Description |
|---|---|---|
| GET | `/habits` | Get all habits |
| POST | `/habits` | Create habit |
| POST | `/habits/:id/checkin` | Check in for `{ date }` |
| DELETE | `/habits/:id` | Delete habit |

## Offline Behavior

1. **Offline mutations** are queued in MMKV (`offline_action_queue`) and applied optimistically to the local cache
2. UI shows an **OfflineBanner** with queued action count
3. When back online, `syncManager.replayQueue()` triggers automatically (network polled every 5s)
4. Failed replays retry up to **3 times**, then discarded

## Auth Flow

```
Signup → EmailVerification screen
Login  → 403 if unverified → prompt to verify
       → 200 + token → MainTabs
```

Token and user persisted in MMKV. Auto-logs in on restart.

## Streak Logic

Streaks computed **locally** from `checkIns` array (ISO date strings):
- Sorted descending, consecutive days counted from today or yesterday
- Gap of 2+ days resets streak to 0
- Check-in is idempotent per day
