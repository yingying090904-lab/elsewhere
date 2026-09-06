# Elsewhere v2.6 — Lock Screen + Free Home

Major home-system refresh based on the v2.5.4 build.

## What changed

- New editorial lock screen on every fresh launch/reload.
- Swipe up (or tap the cue) to open the numeric passcode screen.
- Default passcode: `0000`.
- Change the 4-digit passcode in **我 → PHONE LOCK → 修改密码**.
- Home page is denser: widgets + four daily app shortcuts on the first page.
- Later launcher pages are back to normal, consistent 4-column phone-sized app icons.
- Long-press an app/widget to enter home edit mode.
- Apps can be dragged across pages and reordered.
- Widgets can be dragged across pages and reordered.
- Dragging is visually stronger: lifted ghost, source fade, highlighted drop target and folder target.
- Drop one app directly onto another app to create a folder.
- Drop an app onto an existing folder to add it.
- Open a folder and use **改名** to rename it.
- Existing widget size editor and wallpaper tools remain available.
- No generated images were added; the new look is CSS-only.

## Lock note

The passcode is a convenience/privacy UI lock stored locally in the browser. It is not encryption and should not be treated as strong device security.

## Run locally

```powershell
npm.cmd install
npm.cmd start
```

Open `http://localhost:3000`.

## Render

For Gemini AI:

```text
GEMINI_API_KEY=your_key_here
```

Do not commit API keys to GitHub.
