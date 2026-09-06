# Elsewhere v2.6.2 — Pinterest Pages + iOS Swipe Fix

Home-layout refinement based on v2.6.1.

- Stock widgets are intentionally split across page 1 and page 2:
  - Page 1: Clock, Today, Thomas
  - Page 2: Weather, Study
- Existing installs migrate those five stock widgets once; custom widgets keep their own pages.
- Page 1 now carries up to eight normal-size app shortcuts under the widgets.
- Page 2+ returns to a strict normal 4-column icon grid.
- iOS home swiping now uses native movement plus a touch-end settle, so a page cannot remain stuck halfway between screens.
- Drag visuals are stronger and clearer while keeping the grid still.
- Widget drag target bug from v2.6.1 is fixed.
- No generated images were added. The Pinterest-inspired look is CSS-only.

Run locally:

```powershell
npm.cmd install
npm.cmd start
```

Render Gemini variable:

```text
GEMINI_API_KEY=your_key_here
```
