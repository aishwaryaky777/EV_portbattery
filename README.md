# VoltShare — EV Battery Sharing Network

A smart EV battery-sharing and charging reservation platform.

**Live site:** https://clinquant-kataifi-55b081.netlify.app

## Features
- Live GPS current location with watchPosition
- Real EV charging station data via OpenStreetMap Nominatim
- AI-powered queue management for charging slots
- Multiple independently bookable charging slots per station
- Interactive station map with dynamic bounds
- Battery swap / charging reservation flow

## Setup

```bash
npm install
npm run dev
```

### Optional: Open Charge Map API (richer station data)
Create a `.env` file:
```
VITE_OCM_API_KEY=your-key-from-openchargemap.org
```

## Build & Deploy

```bash
npm run build
# Drag the dist/ folder to https://app.netlify.com/sites/clinquant-kataifi-55b081/deploys
```
