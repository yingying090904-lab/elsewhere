# Elsewhere v2.3 — Bento Home

This version focuses on a cleaner phone-like home screen.

- Compact, theme-correct typography and widget colours
- Bento-style mixed widget sizes on Today
- Default layout: small Clock + small Today + wide Thomas + wide Weather + wide Study
- A visible + button on every home page opens the Widget Gallery directly
- Widgets still support all pages and 1×1 / 2×1 / 2×2 / 4×2 sizes
- Cleaner headers, app labels, settings and feature surfaces
- Existing v2.2 data migrates automatically

Version: `v2.3.0-bento-home`

Run:
```powershell
npm.cmd install
npm.cmd start
```
Open `http://localhost:3000`.


## v2.4.1 iOS touch hotfix
- Global capture-phase touch handling for Safari/PWA.
- Horizontal home-page swipe works through widgets and app icons.
- Swipe up from app pages returns Home.
- Pull down from upper area opens notifications.
- Fixes touch-action conflicts that blocked horizontal gestures on iPhone.
