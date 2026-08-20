<div align="center">
  <h1>
    <img src="public/logoBIA.png" alt="Logo LIV.hex"><br>
    LIV.hex
  </h1>
  <p><strong>A Modern, Fast, and Highly Interactive Color Palette Generator</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Angular-18+-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tested_with-Vitest-729B1B?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
    <img src="https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
  </p>
</div>

<br/>

LIV.hex is not just another color picker. It's built from the ground up to focus on **beautiful micro-interactions, premium glassmorphism aesthetics, and strict accessibility**. Powered entirely by modern Angular Signals and structured with a clean Hexagonal Architecture.

---

## ✨ Features

| Feature | Description |
| :--- | :--- |
| 🎨 **Instant Harmonies** | Generate Analogous, Complementary, Triadic, Monochromatic, or **Duotone** palettes in one click. |
| 🎛️ **Precision Tuning** | Real-time HSL sliders and editable HEX input. Harmonic palettes adapt instantly as you adjust values. |
| 🔒 **Palette Lock** | Lock the current palette to freely explore HSL adjustments without accidentally overwriting it. |
| 🎞️ **Editorial Aesthetics** | 3-layer radial gradient background (base + glow + vignette) and a film grain overlay for a premium, cinematic feel. |
| 🌈 **Swatch Bar** | A sticky top-bar showing all palette colors at a glance — clickable to jump between them instantly. |
| 💎 **Glassmorphism UI** | Fluid spring animations, glass-panel overlays, and dynamic CSS gradients driven natively by CSS variables. |
| ♿ **Accessibility First** | Adaptive text colors with real-time WCAG 2.1 contrast ratio calculations (AAA / AA / Fail). |
| 💾 **Smart History** | Automatically saves your last 50 finalized colors to `localStorage` (ignores intermediate slider drags). |
| 📦 **Developer Export** | One-click export to CSS Custom Properties, Tailwind configuration, or structured JSON. |
| 💬 **Feedback** | Built-in feedback form (bug, improvement, or general) powered by Formspree — no backend needed. |

---

## ⌨️ Global Shortcuts

Speed up your workflow with global keyboard bindings (intelligently disabled when typing in inputs):

| Key | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Generate new color / palette |
| <kbd>H</kbd> | Toggle History panel |
| <kbd>E</kbd> | Toggle Export panel |
| <kbd>L</kbd> | Lock / Unlock current palette |
| <kbd>Esc</kbd> | Close all open panels |

---

## 🏗️ Architecture

Built using a strict **Screaming / Hexagonal Architecture** approach. The codebase tells you exactly what the app does at first glance, completely decoupling logic from presentation.

- **`/core`** — The brain. Pure TypeScript domain models (`Color`, `ColorHsl`, `HarmonicType`, `FeedbackPayload`), color math, WCAG contrast logic, keyboard shortcut registry, and Formspree integration service.
- **`/features`** — The muscle. Isolated, standalone UI components built with pure vanilla CSS:
  - `color-display` — Main panel with HEX input and HSL sliders.
  - `generate-button` — Palette mode selector and generator trigger.
  - `palette-display` — Harmonic color swatch grid.
  - `swatch-bar` — Sticky top color strip.
  - `history-panel` — Slide-in history list.
  - `export-panel` — CSS / Tailwind / JSON code builder.
  - `feedback-modal` — Glassmorphic feedback form.
- **`app.ts`** — The orchestrator. The single "smart" container that owns all state signals and delegates to the "dumb" feature components.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Development

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run start
```
Open your browser and navigate to `http://localhost:4200/`.

### Testing & Production Build

```bash
# Run the full Vitest unit test suite
npm run test

# Build for production (AOT optimized)
npm run build
```

---

## ☁️ Deployment

LIV.hex is deployed on **Vercel** with automatic CI/CD — every push to `main` triggers a new production deployment.

The `vercel.json` at the root configures SPA routing rewrites so Angular routes work correctly on page refresh.

---

## 🤝 Contributing & Feedback

Found a bug or have an idea? Use the **💬 feedback button** inside the app to send it directly, or open an issue on GitHub.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
