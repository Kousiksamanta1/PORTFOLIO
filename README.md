# Operator Archive

A single-page cybersecurity portfolio for **Kousik Kumar Samanta**, built as a premium "digital forensics archive meets terminal interface" experience.

The site presents an MSc Cyber Security profile with a cyber-first visual identity, animated terminal interactions, and dossier-style project cards.

## Overview

This portfolio is designed to feel like a live operator dossier rather than a standard personal website.

It combines:

- a terminal-inspired boot sequence
- a file-directory sidebar
- a command palette and command shell
- classified project dossiers
- a responsive contact console

The current portfolio highlights practical work in:

- SOC operations
- phishing analysis
- wireless auditing
- security automation
- offensive security foundations

## Tech Stack

- HTML5
- Tailwind CSS via CDN
- Vanilla JavaScript
- Custom CSS for CRT scanlines, grid glow, dossier effects, and motion
- JetBrains Mono from Google Fonts

## Current Features

- 2-second `System Initializing` boot sequence with scrolling fake logs
- responsive file-directory navigation sidebar
- command palette with `Ctrl/Cmd + K`
- sidebar terminal input with commands like `help`, `about`, `projects`, `contact`, `copy email`, and `cv`
- active section highlighting while scrolling
- hero section with real profile details
- personnel bio and cyber-focused background summary
- arsenal section styled as a system readout
- three dossier-style project cards:
  - `SIEM-Commander`
  - `Phishing Triage Pipeline`
  - `Auto-Sentinel`
- glitch-style restricted overlay on project cards
- contact console with copy-to-clipboard controls
- Formspree-ready contact form
- mobile-friendly navigation and tap-safe interactions
- reduced-motion support

## Design Direction

The UI uses a refined cyber-forensics palette instead of raw neon-only terminal green.

- Background: `#0b0f12`
- Primary accent: `#2cff88`
- Warning accent: `#ff5a5f`
- Secondary accent: `#66e3ff`
- Font: `JetBrains Mono`

Atmosphere and effects:

- subtle CRT scanlines
- glowing archive grid
- terminal panel gradients
- green/red status glow
- motion-tied UI depth on scroll

## Project Structure

```text
PORTFOLIO/
├── index.html
├── styles.css
├── script.js
├── MAIN CV.pdf
├── README.md
├── desktop-home.png
├── mobile-home.png
└── other local preview screenshots
```

## Run Locally

No build step is required.

1. Open the project folder.
2. Start a local server:

```bash
python3 -m http.server 4173
```

3. Visit `http://127.0.0.1:4173`

You can open `index.html` directly, but a local server is better for testing links and deployment parity.
