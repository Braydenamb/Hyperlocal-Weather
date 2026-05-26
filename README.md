# ⚡ HyperWeather — Street-Level Weather Intelligence

HyperWeather is a next-generation, hyperlocal weather intelligence platform that estimates weather street-by-street. Blending Open-Meteo forecasting grids, simulated high-resolution radar sweeps, localized wind-direction modeling, and real-time community weather reports, it delivers ultra-precise microclimate insights.

The user experience feels like a blend between Apple Weather, Windy.com, Arc Browser, Linear, and the Vercel Dashboard — styled under a sleek, glassmorphic dark/light aesthetic.

---

## 🚀 Key Features

* **Real-time Geolocation + Manual Search**: Instant location tracking using the browser's `navigator.geolocation` paired with a premium geocoding auto-complete system (powered by Open-Meteo).
* **Futuristic Visuals**: Heavy glassmorphism, glowing weather gradients, dynamic canvas-based weather particles (rain, snow, storm sweeps), and smooth framer-motion micro-interactions.
* **SaaS Dashboard Layout**: Collapsible premium sidebar, sticky navigation header, and a collapsible utilities right-panel with weather layers and saved locations.
* **Interactive Leaflet Map**: High-performance street-level map using CartoDB dark/light tiles, custom pulsing marker pins, and an animated Canvas-based simulated radar sweeper.
* **Elite Recharts Visualizations**: Hourly temperature curves, barometric pressure profiles, wind direction timelines, and multi-variable humidity/dew-point overlays.
* **Community Intelligence**: An integrated report submission system allowing street-level hazard flags (flooding, severe storms, hail) that instantly render as real-time warning markers on the map.
* **Resilient Dual-Database Architecture**: Built for offline-resilience with instant SQLite fallbacks for local development and direct compatibility with Neon PostgreSQL in production environments.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 16 (App Router), React 19, TypeScript strict mode, Tailwind CSS v4, Framer Motion, Zustand, Recharts, Leaflet, and Lucide React.
* **Backend**: Next.js Route Handlers (Serverless/Web Standard APIs).
* **Database / ORM**: Prisma ORM with SQLite (Local Development) or Neon PostgreSQL (Production/Vercel).

---

## 💻 Local Development Setup

### 1. Clone & Install Dependencies
First, install the package tree:
```bash
npm install
```

### 2. Configure Environment Variables
Create a local environment file `.env.local` with the following variables:
```env
# Database Connection (local SQLite setup)
# Note: For local SQLite, rename database provider inside prisma/schema.prisma to "sqlite" and use:
# DATABASE_URL="file:./dev.db"
# Alternatively, use your PostgreSQL URL directly:
DATABASE_URL="postgresql://user:password@localhost:5432/hyperweather?schema=public"

NEXT_PUBLIC_OPEN_METEO_BASE_URL="https://api.open-meteo.com/v1"
NEXT_PUBLIC_OPEN_METEO_GEOCODING_URL="https://geocoding-api.open-meteo.com/v1"
NEXT_PUBLIC_OPEN_METEO_AIR_QUALITY_URL="https://air-quality-api.open-meteo.com/v1"

NEXT_PUBLIC_DEFAULT_LATITUDE="40.7128"
NEXT_PUBLIC_DEFAULT_LONGITUDE="-74.0060"
```

### 3. Database Initialization (SQLite Local Option)
If you prefer running SQLite for zero-config local development:
1. Open [schema.prisma](file:///prisma/schema.prisma)
2. Change the provider to `sqlite` and update models if necessary (Prisma Client handles translation automatically):
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```
3. Initialize the database and run migrations:
   ```bash
   npx prisma db push
   ```

### 4. Seed Mock Climate Data
Execute the built-in seeding script to populate saved locations, default user settings, and recent community reports:
```bash
npx prisma db seed
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view your dashboard!

---

## 📦 Vercel Production Deployment

HyperWeather is fully Vercel-compatible and optimized for serverless architectures:

### 1. Database Provisioning
HyperWeather uses Neon PostgreSQL for production. Create a database on [Neon](https://neon.tech/) and retrieve your `DATABASE_URL` string.

### 2. Setup Vercel Deploy Options
Install the Vercel CLI or deploy via GitHub integration. Add your environment variables in the Vercel Dashboard settings:
* `DATABASE_URL`: Your Neon PostgreSQL direct connection string.
* `NEXT_PUBLIC_OPEN_METEO_BASE_URL`: `https://api.open-meteo.com/v1`
* `NEXT_PUBLIC_OPEN_METEO_GEOCODING_URL`: `https://geocoding-api.open-meteo.com/v1`
* `NEXT_PUBLIC_OPEN_METEO_AIR_QUALITY_URL`: `https://air-quality-api.open-meteo.com/v1`

### 3. Production Build Validation
Confirm the production compilation succeeds locally:
```bash
npm run build
```

---

## 🎨 Visual Philosophy & Theme System

HyperWeather implements a bespoke global design system:
* **Deep Space Dark Theme**: `#0B1020` base layer with frosted, translucent `rgba(255, 255, 255, 0.06)` panels, creating floating depth.
* **Weather-Tech Light Theme**: `#F7F9FC` minimal backdrop with rich, crisp cards and blue gradients.
* **Ambient Glow Orbs**: Custom `<GlowOrb />` elements render colorful, animated visual backdrops depending on active weather conditions (amber for sun, purple for storms, cyan for clear rain).
