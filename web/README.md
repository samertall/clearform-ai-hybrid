# ClearForm AI — portable Vite web build

This directory provides a deployable static React/TypeScript build of the same ClearForm AI functionality from the existing Cloudflare/Vinext prototype.

## Install / develop

```sh
cd web
npm install
npm run dev
npm run build
```

## Vercel deployment

Set **Root Directory** to `web`, **Framework** to `Vite`, **Build Command** to `npm run build`, and **Output Directory** to `dist`.

This build deliberately includes **no Firebase API credentials**. When deployed, the basic deterministic preview works by default. For real Firebase AI Logic hybrid inference, configure an App Check-protected Firebase project and enter only the public Firebase Web configuration and public reCAPTCHA site key in the app's Settings. To give judges a one-click AI demo, connect a shared production Firebase project (with strict quotas, App Check, and permitted deployment domain).

Privacy modes: on-device-only by default after Firebase connection; cloud fallback only after explicit opt-in. Do not claim cloud/on-device model execution until tested on real devices.

The repository remains MIT licensed. Source of truth: `../app/page.tsx`, `../lib/hybrid-ai.ts`. Keep this portable app in sync when modifying shared product behavior.
