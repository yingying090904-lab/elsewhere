# Elsewhere v2.5.1 — Real Controls

## Render

Required environment variable:

```text
GEMINI_API_KEY=your Gemini API key
```

Optional:

```text
GEMINI_MODEL=gemini-3.8-flash
```

Build command: `npm install`
Start command: `npm start`

## What changed
- Thomas and all character chats use Gemini through the server.
- Settings shows Gemini connection status and includes Test AI.
- Failed AI replies are clearly marked LOCAL instead of pretending AI is connected.
- Chat state uses one stable localStorage key and migrates older v2.x state.
- User and AI messages save immediately; state is also saved on route changes, page hide and browser close.
- Removed the fake internal status bar that collided with iPhone status UI.
- Reworked launcher pages into mixed-size bento tiles with one consistent visual system.
- Thomas/chat layout is compact and keeps the message composer at the bottom of the app screen.


## v2.5.1
- Calendar previous/next month controls now work.
- Study custom timer now works.
- Thomas quick actions for Mood and Focus perform real actions.
- Clock widget is no longer rendered as a fake button.
- Service worker cache bumped for the hotfix.


## v2.5.2
- Fixed Customise/装扮 and other long app pages so they scroll vertically on iPhone and desktop.
- Swipe-up-to-home now only activates from a narrow bottom-edge gesture lane, so normal upward scrolling is no longer hijacked.
- Added a control-integrity pass: disabled/decorative elements no longer present themselves as active controls, while real customise controls keep tactile states.
- Added extra bottom safe-area padding so the last customise controls can be reached above the iPhone home indicator.
- Service worker cache bumped to v2.5.2.

## v2.5.3
- Fixes the white strip below the phone on iPhone/Safari by using the dynamic viewport rather than a stale 100% layout height.
- Explicitly suppresses the legacy drawn status bar so it cannot overlap iOS' real status bar.
- Keeps dock and page dots inside the live viewport/safe area.
- Adds restrained CSS-only editorial linework/circles to the Today home page so the open space feels intentional without adding images.

## v2.5.4
- Removed the soft blur overlay from launcher pages for a sharper first page.
- Replaced JS-driven horizontal swiping with native iOS scroll-snap to stop double-scroll jitter.
- Removed expensive live backdrop blur from dock, dots, headers and overlays for smoother mobile performance.
- Simplified app open/close animations to fast translate/fade without blur/scale.
- Rebalanced page 2 into a dense two-size bento grid with no awkward vertical gaps.
- Added restrained CSS line structure to the first page without adding images.
