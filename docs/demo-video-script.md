# ClearForm AI — authentic 2:25 hackathon demo plan

**Important:** This is a shot list and English narration, NOT a claim that a demo video has been recorded. Record the actual app running with real Firebase AI Logic enabled; no mock local/cloud status or altered screenshots.

| Time | Live screen actions | Suggested voiceover |
| --- | --- | --- |
| 00:00–00:18 | Start with a dense, fictional bank/renewal notice and ClearForm home | "A short notice can hide a complicated next step. ClearForm makes critical information easier to understand—without making you guess where AI processes it." |
| 00:18–00:39 | Paste the notice; show large text and accessible layout | "Paste a message or import a text file. The goal is clarity: plain-language context, useful actions and details pulled from the source." |
| 00:39–01:02 | Open AI settings and show the connected Firebase web app; hide any sensitive values | "ClearForm is powered by Firebase AI Logic. With cloud fallback off, only the on-device model can answer. That choice is visible and deliberate." |
| 01:02–01:23 | With real Gemini Nano available, run **on-device only** and show actual output source | "On compatible Chrome desktops, the local model can explain the notice without sending its text to a cloud model." |
| 01:23–01:47 | Explicitly enable Cloud fallback and run on a browser without a ready local model; show actual AI Cloud badge | "When local inference is unavailable, the user can opt into Firebase cloud fallback. ClearForm shows what actually happened rather than assuming." |
| 01:47–02:05 | Scroll through summary, checklist, details, terms and questions | "The result is more than a summary. It highlights possible next steps, confusing terminology and follow-up questions." |
| 02:05–02:22 | Tick a task; save locally; export explanation; briefly show source repo | "People can make progress at their own pace. Their saved work stays in this browser, and the implementation is open source." |
| 02:22–02:25 | Logo/closing app screen | "ClearForm AI. Complexity into clarity." |

## Evidence checklist before rendering

- Show real running AI response. If Firebase is not configured, show basic extraction only and explicitly say it is not AI; such footage is not sufficient as the sole AI demonstration.
- Show **actual on-device** and **actual cloud** inference-source badges, ideally including console/network evidence.
- The selected sample must be fictional and contain no personal data. Keep keys, tokens and private fields obscured.
- English narration or English subtitles. No copyrighted music. Keep runtime under three minutes.
- Upload the **finished** original recording publicly on YouTube and replace the pending field in docs/devpost-entry.md.

Suggested YouTube title: **ClearForm AI | Privacy-First Hybrid AI with Firebase AI Logic | #BuildHybridAI 2026**

Suggested description:

ClearForm AI makes difficult notices easier to understand. This hackathon demo shows a React/TypeScript web app using Firebase AI Logic for on-device Gemini Nano and consent-based Gemini cloud fallback. The interface distinguishes real on-device AI, cloud AI, and deterministic basic extraction.

Source code: https://github.com/samertall/clearform-ai-hybrid
Hackathon: https://firebasehybridaihackathon.devpost.com/
Demo site: https://clearform-ai-2026.usefulotter1.chatgpt.site

Built by Samer Tallauze. AI can make mistakes; verify important instructions against their original source.
