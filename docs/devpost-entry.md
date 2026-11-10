# ClearForm AI — Devpost draft

**Tagline:** Complex information, simply explained — with privacy-first hybrid AI.

**Demo:** https://clearform-ai-2026.usefulotter1.chatgpt.site (basic preview verified; live Firebase connection pending).
**Repository:** https://github.com/samertall/clearform-ai-hybrid
**Video:** Pending original screen recording and upload.

## Inspiration

Important messages are often technically correct but difficult to understand. Notices, renewal conditions, verification requests, and forms place a heavy reading burden on people. ClearForm AI asks whether accessible explanations and visible privacy controls can help.

## What it does

Paste a confusing message or import a text file. ClearForm turns it into a headline, summary, possible-action checklist, important dates and amounts, jargon definitions, and clarifying questions. You can tick steps, enlarge text, copy, export, and explicitly save results in your browser.

It implements Firebase AI Logic hybrid inference, favoring compatible on-device Chrome models and allowing cloud fallback. Each response displays whether it came from on-device AI, cloud AI, or a clearly labeled rule-based basic preview.

## How we built it

React, TypeScript, Vinext, modern CSS, Firebase JavaScript SDK, Firebase AI Logic, Firebase App Check, and Lucide icons. We instruct the model to treat pasted source content as untrusted data and not to follow embedded commands. An independent deterministic extraction function allows safe exploration without Firebase setup.

## Challenges

Local AI improves privacy, but browser availability varies. A trustworthy fallback must be obvious and App Check must protect any cloud API usage. We emphasized clear source labels, meaningful failure behavior, and an accessible workflow.

## What we learned

Good AI UX includes explicit privacy boundaries and credible limitations. People need to understand where their information goes and be able to check important instructions against the original.

## What's next

Verify real Firebase on-device and cloud modes, improve screen-reader coverage, add source references, and investigate permission-based PDF parsing.

## Built with

React, TypeScript, Vinext, Firebase AI Logic, Firebase App Check, Gemini, Chrome Prompt API, CSS, Lucide.

## AI disclosure

An AI coding assistant significantly generated and revised application code, styling, tests, prompts, and project documentation. The project began in November 2026. Update this draft after actually verifying Firebase and the final official rules. Do not claim live Firebase inference was tested before verification.
