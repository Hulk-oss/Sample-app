# Setup

## Requirements

- Node.js 18+
- npm 9+
- Modern browser

## Install

```bash
git clone https://github.com/Hulk-oss/Sample-app.git
cd Sample-app
npm install
```

## Development

```bash
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Demo behavior

Authentication, onboarding, CRUD actions, settings, and AI responses use browser state. No secret keys are required.

## Source map

- `src/App.jsx`: product screens and interactions
- `src/styles.css`: visual system and responsive behavior
- `src/data.js`: demo records
- `src/finance.js`: deterministic calculations
- `src/main.jsx`: React entry

For production, move persistence and critical calculations to a trusted backend.
