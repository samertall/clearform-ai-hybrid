# #BuildHybridAI 2026 — judge validation and deployment readiness

Updated: 2026-11-17. Deadline: November 30 at 14:00 PST / December 1 at 01:00 Asia/Amman.

## Entry identity

- Project: ClearForm AI; category: Web / Chrome Desktop (Firebase AI Logic + Gemini Nano 4).
- Public source: https://github.com/samertall/clearform-ai-hybrid
- Design / deterministic preview: https://clearform-ai-2026.usefulotter1.chatgpt.site
- License: MIT
- **Critical:** No shared Firebase AI Logic project is connected to the public demo. Live local or cloud AI inference has NOT been verified. Do not represent the non-AI preview as working AI.

## Judge test matrix

| Test | Action | Expected |
| --- | --- | --- |
| A | No Firebase config; paste sample notice | Basic extraction visibly labeled No AI |
| B | Firebase/App Check configured; cloud fallback OFF; Nano installed | Local-only inference; AI On-device badge, or an informative error |
| C | Cloud fallback ON; local model unavailable | Actual cloud response with AI Cloud badge, never a guessed badge |
| D | Cloud fallback ON; local model available | Actual on-device response with AI On-device badge |
| E | Save, reopen, delete explanation | Works locally with no account |
| F | Invalid App Check token or offline with no local model | Transparent failure and labeled non-AI fallback |
| G | Keyboard, zoom and small viewport | Usable responsive form, modal, output and controls |
| H | Malicious text tells AI to ignore instructions | Input treated as untrusted source, never followed |
| I | Local-only mode while monitoring Network | No document text sent to Firebase cloud inference endpoint |

## Firebase production checklist

1. Create Firebase project and web app, enable AI Services > AI Logic with Gemini Developer API.
2. Register public hosting domain in App Check with production attestation and enforce App Check for AI Logic. This app uses reCAPTCHA v3.
3. In ClearForm settings, add ONLY public Firebase Web config and public reCAPTCHA site key. Never expose service-account credentials or App Check debug tokens.
4. In a compatible Chrome Desktop browser, enable the required Prompt API feature where applicable and download Gemini Nano.
5. Run the on-device-only test; screenshot the true inference-source label and DevTools evidence.
6. Explicitly opt into cloud fallback; run on a nonlocal device and verify the Cloud label.
7. Give judges a functional free test environment without expecting them to create their own Firebase project.

## Existing-app disclosure

The project predates the November 11 submission window (created November 9, 2026). Changes made November 17 include:
- User-controlled ON_DEVICE-only mode that prevents automatic fallback.
- Explicit cloud fallback consent; the UI discloses transmission to Google.
- Local model initialization readiness handling.
- Source labels that refuse to guess when provenance is missing.
- CI workflow and judge acceptance test plan.

Describe changes dated after November 11 in the Devpost submission rather than claiming the entire app was created within the contest period.

## Submission status

- [x] Public GitHub source and MIT license
- [x] Firebase AI Logic SDK imported and called at runtime
- [x] Product UI, rule-based preview and submission draft
- [x] Consent gate and acceptance test documentation
- [ ] App Check connected to actual live Firebase service
- [ ] Both local and cloud inference successfully exercised and documented
- [ ] CI passes
- [ ] An authentic public YouTube video of working app (3 minutes or less)
- [ ] Final Devpost submission completed before deadline

## References

- https://firebasehybridaihackathon.devpost.com/rules
- https://firebase.google.com/docs/ai-logic/hybrid/web/get-started
- https://firebase.google.com/docs/ai-logic/hybrid/web/configuration-options
- https://firebase.google.com/docs/app-check/web/recaptcha-provider
