# ClearForm AI — Devpost entry (updated 2026-11-17; not yet submitted)

**Project title:** ClearForm AI — Complex information, simply explained
**Tagline:** An accessible, privacy-conscious document explainer that can reason on-device and—with permission—fall back to Firebase AI in the cloud.
**Category:** Web / Chrome Desktop
**Public repository:** https://github.com/samertall/clearform-ai-hybrid
**Public web deployment (verified HTTP 200):** https://clearform-ai-hybrid-2026-samertalls-projects.vercel.app/
**Original browser preview:** https://clearform-ai-2026.usefulotter1.chatgpt.site
**YouTube video (1:47, illustrated overview):** https://youtu.be/hwarzgLJ6Ew
**Video limitation:** This is an illustrated product overview with narrated interface concepts, not a screen recording proving real Firebase AI Logic inference. To meet the contest's functional demo expectations, record authentic app footage showing the deployed application and, when possible, actual AI results.

## Inspiration

Important information often arrives in language that creates unnecessary cognitive load: bank verification notices, renewal conditions, insurance letters, and bureaucratic instructions. Asking people to paste that content into a cloud AI tool can create another barrier: privacy. ClearForm AI explores a more inclusive path—explain the content clearly while visibly controlling the location of AI processing.

## What it does

A person pastes a notice or imports a plain-text file. ClearForm organizes it into a short headline, a plain-language explanation, a checklist of possible next steps, important details, jargon definitions, and clarification questions. Users can tick steps, enlarge text, copy or export explanations, and save selected analyses only in local browser storage.

Three visibly distinct experiences are supported:

1. **Basic extraction (no AI):** works immediately without Firebase credentials, and is clearly marked as deterministic.
2. **On-device AI (private mode):** when Firebase is connected, uses Gemini Nano via Firebase AI Logic and does not permit cloud fallback.
3. **Hybrid AI (explicit opt-in):** prefers on-device inference, with Firebase AI Logic cloud fallback if the model cannot run locally. The result displays its reported inference source.

The default AI mode avoids cloud fallback until the person opts in.

## How we built it

The app uses React, TypeScript, modern CSS, Vinext, Firebase JavaScript SDK, the Firebase AI Logic Hybrid Inference API, Firebase App Check, and Chrome's Prompt API through Firebase. Its actual TypeScript source imports GoogleAIBackend, getAI, getGenerativeModel and InferenceMode from firebase/ai; on the user's action it initializes the on-device model and calls generateContent. Firebase App Check uses a reCAPTCHA v3 provider. The UI does not label deterministic output as model output, and does not guess the inference source if the SDK does not identify it.

A separate local extraction engine supports an offline/non-AI preview. The prompt explicitly treats source text as untrusted and asks the model not to fabricate important obligations or dates.

## Challenges we encountered

Hybrid inference depends on device support, model downloads, browser settings, App Check and the cloud provider. A confusing fallback could violate user expectations, so we made cloud use an explicit choice. A production judge-ready demo still requires real Firebase configuration and live testing of both inference paths. The public video is an illustrated overview; it must not be represented as verified local/cloud inference footage.

## What we learned

The most useful part of an AI explanation is not only a summary: it is traceability of source details, readable actions, and transparency about where processing happens. Hybrid architecture creates a design responsibility to make data movement understandable.

## Existing-app update disclosure (required)

ClearForm AI existed on November 9, 2026, before the November 11 contest opening. Work completed during the official submission window on November 17 includes an on-device-only AI setting, explicit opt-in for cloud fallback, source-label validation, readiness handling, CI validation workflow and a judge acceptance test matrix. The project should be entered as a significantly updated existing application; the team must assess eligibility against the final rules.

## What's next / known limitations

The public Vercel deployment (November 17) serves the complete standalone web frontend and its deterministic non-AI extraction. It does **not** include a shared Firebase AI Logic configuration. Actual model responses, production App Check, and a full live demonstration have **not** yet been verified. Those items must be completed before a truthful fully functional hackathon submission, and claims updated to match observed tests.

## Built with

React, TypeScript, Vinext, Firebase AI Logic, Firebase App Check, Gemini Nano, Chrome Prompt API, CSS, Lucide.

## Submission fields for Devpost

- **Project name:** ClearForm AI
- **Elevator pitch:** Explain complex notices with accessible next steps and privacy-first control over on-device versus cloud AI.
- **Platform:** Web (Chrome)
- **Repo URL:** https://github.com/samertall/clearform-ai-hybrid
- **Demo URL:** https://clearform-ai-hybrid-2026-samertalls-projects.vercel.app/
- **Video URL:** https://youtu.be/hwarzgLJ6Ew
- **Technologies:** TypeScript, React, Vite, Vinext, CSS, Firebase AI Logic SDK, Firebase App Check, Gemini Nano, Lucide.
- **Current preview scope:** working user interface and deterministic basic extraction without Firebase credentials; Firebase inference paths require configuration and real-world tests.
- **Eligibility:** Existing project first created November 9; November 17 modifications detailed above.

## AI use disclosure

AI coding assistance was used for implementation, refactoring, tests, and documentation under Samer Tallauze's direction. No fabricated user research, traction, or success metrics are claimed.
