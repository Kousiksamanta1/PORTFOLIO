# Operator Archive

A single-page cybersecurity portfolio for **Kousik Kumar Samanta**, built as a premium "digital forensics archive meets terminal interface" experience.

The site presents an MSc Cyber Security profile with a cyber-first visual identity, animated terminal interactions, dossier-style project cards, and a static deployment workflow that works well with GitHub Pages.

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

## Contact Form Setup

The contact form is already wired for Formspree-style submission, but it still contains a placeholder endpoint.

In [index.html](/Users/kousiksamanta/Documents/PORTFOLIO/index.html), replace:

```html
action="https://formspree.io/f/YOUR_FORM_ID"
```

with your real Formspree endpoint, for example:

```html
action="https://formspree.io/f/xzzabcde"
```

Until that is replaced, the interface will show a local status message but will not deliver messages to your inbox.

## Deploy For Free With GitHub Pages

This project works well as a static GitHub Pages site.

### Option 1: User Site

Create a repository named:

```text
YOUR_USERNAME.github.io
```

Your site will be published at:

```text
https://YOUR_USERNAME.github.io/
```

### Option 2: Project Site

Create any repository name, for example:

```text
cyber-portfolio
```

Your site will be published at:

```text
https://YOUR_USERNAME.github.io/cyber-portfolio/
```

### Publish Steps

1. Create a new GitHub repository.
2. Upload the contents of this folder.
3. Go to `Settings` -> `Pages`.
4. Under `Build and deployment`, choose `Deploy from a branch`.
5. Select branch `main` and folder `/(root)`.
6. Save and wait for GitHub Pages to publish the site.

Because this project uses relative asset paths such as `./styles.css`, `./script.js`, and `./MAIN%20CV.pdf`, it works for both user sites and project sites.

## Suggested Next Upgrades

- replace the Formspree placeholder with your real endpoint
- add GitHub links or live repo links to each project dossier
- add screenshots later when ready
- expand each project into a case-study modal or dedicated page
- add certifications, timeline, and security domains sections
- connect a custom domain later if desired

## Notes

- Tailwind is loaded from the CDN inside [index.html](/Users/kousiksamanta/Documents/PORTFOLIO/index.html)
- interaction logic lives in [script.js](/Users/kousiksamanta/Documents/PORTFOLIO/script.js)
- theme styling and visual effects live in [styles.css](/Users/kousiksamanta/Documents/PORTFOLIO/styles.css)
- the CV referenced by the site is [MAIN CV.pdf](/Users/kousiksamanta/Documents/PORTFOLIO/MAIN%20CV.pdf)
