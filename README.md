# LIV.hex — Advanced Color Generator

![LIV.hex](https://img.shields.io/badge/Angular-18+-DD0031.svg?style=flat&logo=angular)
![Vitest](https://img.shields.io/badge/Tested_with-Vitest-729B1B.svg?style=flat&logo=vitest)

LIV.hex is a modern, fast, and highly interactive color palette generator built with **Angular (Standalone Components, Signals)**. It focuses on beautiful micro-interactions, aesthetic UI/UX, and accessibility.

## Features

- **Instant Generation**: Generate random aesthetic colors (constrained saturation/lightness to avoid muddy colors) or harmonic palettes (Analogous, Complementary, Triadic, Monochromatic) with a single click.
- **Micro-interactions & Glassmorphism**: Smooth spring animations, glass-panel overlays, responsive radial background gradients, and premium focus states.
- **Formats & Export**: Copy values in HEX, RGB, HSL, and CMYK. Export whole palettes directly into CSS variables, Tailwind configuration, or JSON.
- **Accessibility (a11y)**: Adaptive text color (WCAG 2.1 compliance) calculating contrast ratios in real-time. Full keyboard support.
- **Keyboard Shortcuts**:
  - `Space`: Generate new color/palette
  - `H`: Toggle History panel
  - `E`: Toggle Export panel
  - `Escape`: Close all panels
- **History**: Keeps track of your last 50 generated colors. Persisted in `localStorage`.

## Tech Stack

- **Framework**: Angular (18+)
- **Reactivity**: Angular Signals (100% Signal-driven state)
- **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid, Glassmorphism)
- **Testing**: Vitest with Angular Testing Library / TestBed

## Architecture (Screaming Architecture & Hexagonal approach)

The app is strictly divided into logical domains:

- **Core (`/src/app/core`)**: Pure logic, models, and domain services.
  - `color.model.ts`: Domain models (`Color`, `ColorHsl`, `HarmonicType`).
  - `color.service.ts`: Color math, WCAG contrast logic, conversions.
  - `history.service.ts`: Local storage persistence and deduplication.
  - `keyboard-shortcut.service.ts`: Global DOM event listeners (ignores input fields).
- **Features (`/src/app/features`)**: Isolated, standalone UI components.
  - `color-display`: The main color preview, text contrast, WCAG score.
  - `export-panel`: Code builders for CSS/Tailwind/JSON.
  - `generate-button`: Palette generation triggers.
  - `history-panel`: The history list.
  - `palette-display`: Harmonic color list.
- **App Shell (`/src/app/app.ts`)**: The orchestrator. Combines all feature components and handles global state (the smart container holding dumb components).

## Development

### Prerequisites

- Node.js
- npm / pnpm / yarn

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run start
   ```
   Navigate to `http://localhost:4200/`.

### Running Tests

Execute the unit test suite using Vitest:
```bash
npm run test
```

### Production Build

To build for production (includes optimizations and AOT compilation):
```bash
npm run build
```
Build artifacts will be stored in the `dist/` directory.
