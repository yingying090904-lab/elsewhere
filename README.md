# Elsewhere v2.4.3 — Thomas Render Fix

This hotfix fixes the root cause of Thomas failing to open on both desktop and mobile.

## Fix
- Thomas chat could crash while rendering the initial assistant message because the generic avatar renderer received a null character object.
- Avatar rendering is now null-safe.
- Thomas assistant messages now explicitly render with Thomas identity.
- Cache bumped to v2.4.3.

Run:
```powershell
npm.cmd install
npm.cmd start
```
Open http://localhost:3000
