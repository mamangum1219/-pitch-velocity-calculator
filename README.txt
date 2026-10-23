PITCH VELOCITY CALCULATOR — INSTALLABLE OFFLINE PWA

Files: index.html, app.js, sw.js, manifest.webmanifest, icons/

TO INSTALL ON ANDROID:
1. Upload the entire unzipped folder to an HTTPS static hosting provider (e.g., GitHub Pages, Netlify, or Cloudflare Pages). Ensure the files remain together.
2. Open the hosted URL in Chrome on your Android phone.
3. Choose Install app from Chrome's menu, or tap the Install app button when available.
4. Open it once while connected to the internet. Thereafter it works offline.

IMPORTANT: A PWA cannot normally be installed directly from a ZIP or file:// URL. It must first be served over HTTPS (or localhost for development). This ZIP is the complete deployable app, not an Android APK.

CALCULATION:
Equivalent velocity (MPH) = machine speed (MPH) x 60.5 / release-to-plate distance (ft).
Travel time (seconds) = distance (ft) / (speed (MPH) x 5280 / 3600).
This is a simple constant-speed reaction-time equivalence, not a literal live-pitch speed.

All calculations are performed on-device. Saved presets are stored in browser localStorage. No accounts, tracking, or network APIs.
