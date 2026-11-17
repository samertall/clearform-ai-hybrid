# ClearForm AI

**Complex information. Simply explained.**

ClearForm AI is an accessible, privacy-conscious web app that helps people understand confusing notices and form instructions. Paste text or import a TXT/Markdown file to see a plain-English explanation, possible actions, key details, jargon definitions, and questions worth asking.

Created November 9, 2026 for the [Google #BuildHybridAI 2026 challenge](https://firebasehybridaihackathon.devpost.com/).

**Public demo:** https://clearform-ai-2026.usefulotter1.chatgpt.site  
**Source:** https://github.com/samertall/clearform-ai-hybrid

## Key features

- Firebase AI Logic hybrid inference with **explicit privacy modes**: ONLY_ON_DEVICE by default; optional PREFER_ON_DEVICE with cloud fallback after the user's consent.
- Firebase App Check with reCAPTCHA v3 to protect the AI Logic proxy.
- Transparent output labels: AI on-device, AI cloud, or Basic extraction (not AI).
- Working no-credential preview extracts literal dates, durations, amounts, action-like sentences, and familiar terms; it does not use AI.
- Accessible responsive layout, larger-text control, keyboard focus, checkbox steps, copy, export, optional local history.

## Stack

React 19, TypeScript, Next-compatible Vinext, Firebase JS SDK 13, Firebase AI Logic, Firebase App Check, CSS, Lucide icons, Cloudflare Worker hosting.

## Run locally

Requires Node.js 22.13+ and pnpm 11.x:

    pnpm install
    pnpm dev

Basic extraction works immediately without credentials. To enable the actual AI:

1. Create a [Firebase project](https://console.firebase.google.com/) and register a web app.
2. In AI Services → AI Logic, enable the Gemini Developer API provider.
3. In Security → App Check, configure reCAPTCHA v3 and enforce App Check for AI Logic.
4. Authorize your web domain.
5. Open ClearForm settings and enter your public Firebase web configuration JSON and public reCAPTCHA v3 site key. Never enter private service-account credentials.
6. Test on a compatible Chrome desktop device. The on-device model may require enabling the Chrome Prompt API multimodal flag and downloading the model; otherwise the SDK may use cloud fallback.

Official setup: https://firebase.google.com/docs/ai-logic/hybrid/web/get-started

## Privacy behavior

| Mode | Sends original text to cloud? |
| --- | --- |
| Basic extraction, no Firebase | No |
| Firebase on-device only (default after connecting Firebase) | No |
| Firebase hybrid, optional cloud fallback enabled | **Possibly** — cloud fallback transmits the submitted text if local inference is unavailable |

Basic extraction is never labeled AI. Saved history is only written to browser local storage after the user clicks Save locally. Public Firebase configuration is optionally stored in the browser, not any server-side secret.

## Limitations and testing

The deployed public demo has no shared Firebase project configured; bring your own Firebase config to exercise AI. **The Firebase on-device and cloud modes have not yet been tested end to end.** An App Check-protected shared deployment is required before judges can meaningfully test both inference paths. Rule-based extraction may miss context and is not a reliable interpretation. No PDF, OCR, automatic synchronization, or multilingual guarantee. Browser-side inference is experimental. No legal, medical, or financial advice is provided.

Run:

    node --experimental-strip-types --test tests/analyze.test.mjs
    pnpm exec tsc --noEmit
    pnpm build

## Attribution and AI disclosure

An AI coding assistant significantly contributed to TypeScript, design implementation, prompts, tests, and documentation under Samer Tallauze's direction. Disclose this in the hackathon entry. No user study or efficacy metrics are claimed. The fictional sample notices were written for this prototype. Firebase AI Logic, Gemini, Chrome Prompt API, React, Vinext, and Lucide remain the works of their respective owners. Original project source is MIT licensed.

## #BuildHybridAI 2026 submission readiness

The original app existed before the official November 11 contest opening. Updates during the contest period (November 17) include explicit consent before cloud fallback, an on-device-only privacy mode, improved inference-source validation, a CI check, and a judge validation matrix. These changes must be disclosed as an update to an existing app, not as an entirely new project.

- [Official contest / judging rules](https://firebasehybridaihackathon.devpost.com/rules)
- [Judge test matrix and readiness](docs/judge-validation.md)
- [Devpost entry draft](docs/devpost-entry.md)
- [Two-minute demonstration script](docs/demo-video-script.md)

**Unfinished requirements:** verify actual Firebase inference on-device and in the cloud; configure production App Check for the hosted demo; record a genuine public YouTube video (up to 3 minutes); submit the entry on Devpost by **December 1, 2026 at 01:00 in Amman**.
