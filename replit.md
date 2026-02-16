# VeriSmart - Educational Bluetooth Learning Device App

## Overview

VeriSmart is a mobile/web application built for VeriTon's educational hardware device. It allows students (Grades 1-4) to browse science/electronics projects and execute them on a connected VeriSmart microcontroller board via Bluetooth. The app has three main screens: a home screen with grade selection, a project list screen per grade, and a project detail screen with execute/stop controls that send Bluetooth commands to the physical device.

The app uses Expo (React Native) for the frontend with file-based routing via expo-router, and an Express.js backend server. The architecture is a monorepo with shared schema definitions used by both client and server.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Expo / React Native)
- **Framework**: Expo SDK 54 with React Native 0.81, targeting iOS, Android, and Web platforms
- **Routing**: expo-router v6 with file-based routing in the `app/` directory. Three main routes:
  - `app/index.tsx` - Home screen with grade selection buttons
  - `app/grade/[id].tsx` - Project list for a selected grade
  - `app/project/[gradeId]/[projectId].tsx` - Project detail with execute/stop Bluetooth controls
- **State Management**: React Query (`@tanstack/react-query`) for server state, React Context for Bluetooth connection state (`lib/bluetooth-context.tsx`)
- **Styling**: React Native StyleSheet with a custom color theme (`constants/colors.ts`), using dark navy/blue theme. Fonts loaded via `@expo-google-fonts/poppins`
- **Animations**: `react-native-reanimated` for entry animations and pulsing effects
- **Data**: Project and grade data is hardcoded in `constants/data.ts` - includes project names, procedures, and Bluetooth command codes (3-digit strings like "101", "201", etc.). Stop command is "000"

### Bluetooth Communication
- **Web Bluetooth API only** (`lib/bluetooth.ts`) - uses `navigator.bluetooth` for BLE communication
- **BLE Service UUID**: `0000ffe0-0000-1000-8000-00805f9b34fb` (common HM-10/HC-08 module UUID)
- **BLE Characteristic UUID**: `0000ffe1-0000-1000-8000-00805f9b34fb`
- Only works in Chrome on Android/Desktop; not supported in Safari/iOS browsers or Expo Go native
- Bluetooth state is managed via React Context (`BluetoothProvider`) wrapping the entire app

### Backend (Express.js)
- **Server**: Express v5 running on the same Replit instance, serves API routes and static web build
- **Entry point**: `server/index.ts` with routes registered in `server/routes.ts`
- **Storage**: Currently uses in-memory storage (`server/storage.ts` with `MemStorage` class), has a basic user model but no active API routes yet
- **CORS**: Configured to allow Replit dev domains and localhost origins
- **Static serving**: In production, serves the Expo web build from `dist/` directory; in development, proxies to Metro bundler
- **Build**: Server is bundled with esbuild for production (`server_dist/`)

### Database Schema
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema** (`shared/schema.ts`): Currently only has a `users` table with `id` (UUID), `username`, and `password` fields
- **Validation**: Uses `drizzle-zod` for generating Zod schemas from Drizzle table definitions
- **Migrations**: Managed via `drizzle-kit push` command
- **Note**: The database schema is minimal and not actively used by the app's core functionality yet. The app's project/grade data is all client-side constants

### Build & Deployment
- **Development**: Two processes run together - `expo:dev` for Metro bundler and `server:dev` for Express
- **Production build**: `expo:static:build` creates a static web export, `server:build` bundles the server, then `server:prod` serves everything
- **Build script** (`scripts/build.js`): Custom Node.js script that starts Metro, waits for it, then fetches the web bundle for static export

## External Dependencies

### Core Services
- **PostgreSQL**: Database via `DATABASE_URL` environment variable (configured in `drizzle.config.ts`), used by Drizzle ORM but minimally utilized currently
- **Web Bluetooth API**: Browser-native BLE API for communicating with VeriSmart hardware device

### Key npm Packages
- **expo** (~54.0.27): Core framework for cross-platform React Native development
- **expo-router** (~6.0.17): File-based routing
- **express** (^5.0.1): Backend HTTP server
- **drizzle-orm** (^0.39.3) + **drizzle-kit**: Database ORM and migration tooling
- **@tanstack/react-query** (^5.83.0): Async state management
- **react-native-reanimated** (~4.1.1): Animations
- **expo-linear-gradient**, **expo-haptics**, **expo-image-picker**, **expo-location**: Various Expo modules
- **pg** (^8.16.3): PostgreSQL client driver
- **http-proxy-middleware** (^3.0.5): Proxying Metro dev server requests through Express in development

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required for Drizzle)
- `REPLIT_DEV_DOMAIN`: Set by Replit, used for dev server URLs and CORS
- `REPLIT_DOMAINS`: Set by Replit for production domains
- `EXPO_PUBLIC_DOMAIN`: Public domain for API calls from the Expo client