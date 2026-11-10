export type Analysis = {
  headline: string;
  summary: string;
  steps: string[];
  details: string[];
  terms: { term: string; meaning: string }[];
  questions: string[];
  source: "local-preview" | "hybrid-on-device" | "hybrid-cloud";
};

export const examples = [
  { id: "bank", title: "Banking notice", emoji: "🏦", text: "Important account notice: To maintain uninterrupted access to your online banking services, you must complete the identity verification process within 14 calendar days of receiving this notice. Please upload a valid government-issued ID via the secure account portal. Failure to comply may result in temporary suspension of online account access. If you have already completed verification, no further action is required." },
  { id: "school", title: "Scholarship instructions", emoji: "🎓", text: "Scholarship application update: All applicants must submit an official academic transcript and a personal statement of no more than 500 words by November 28, 2026. Documents must be uploaded through the application dashboard. Incomplete applications will not be reviewed. Shortlisted candidates will receive an email invitation for an interview within two weeks of the deadline." },
  { id: "bill", title: "Service renewal", emoji: "🧾", text: "Your annual subscription is scheduled to renew on December 5, 2026, for JOD 48.00. To avoid automatic renewal, cancel before your renewal date through the billing settings in your customer portal. If you take no action, the payment method on file will be charged on the renewal date. You can download previous invoices from the payment history page." },
];

const glossary: Record<string, string> = {
  "remit": "To send a payment.",
  "outstanding balance": "Money that has not yet been paid.",
  "verification": "Checking that provided information is correct.",
  "government-issued id": "An identity document officially issued by a government.",
  "comply": "To follow a stated rule or request.",
  "transcript": "An official record of grades and courses.",
  "shortlisted": "Selected to move to the next stage.",
  "automatic renewal": "A service continues and may charge you again unless you cancel.",
  "suspension": "A temporary pause in service or access.",
  "invoice": "A document showing an amount due for a product or service.",
  "due date": "The last date by which something is expected.",
  "personal statement": "A short written explanation of your background or goals.",
  "calendar days": "All days on the calendar, including weekends.",
  "proof of address": "A document that confirms where you live.",
};

const actionWords = /\b(must|please|need to|required|submit|upload|complete|provide|send|pay|cancel|verify|renew|register|apply|respond|contact|sign|download|update|review)\b/i;
const detailRegex = /(?:\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:,?\s*\d{4})?|\b\d{1,2}\s+(?:calendar\s+)?days\b|\b(?:JOD|USD|EUR|GBP)\s*[\d,.]+\b)/gi;

export function analyzeLocally(input: string): Analysis {
  const clean = input.replace(/\s+/g, " ").trim();
  const sentences = clean.match(/[^.!?]+[.!?]?/g)?.map(s => s.trim()).filter(Boolean) || [clean];
  const actions = sentences.filter(s => actionWords.test(s) && !/no further action is required/i.test(s));
  const steps = actions.slice(0, 4).map(s => s.replace(/^(?:important\s+)?(?:account|service|application)\s+(?:notice|update)\s*:\s*/i, ""));
  if (!steps.length) steps.push("Read the original message carefully and identify what the sender asks you to do.");
  const details = [...new Set([...clean.matchAll(detailRegex)].map(m => m[0]))].slice(0, 5);
  const terms = Object.entries(glossary).filter(([term]) => clean.toLowerCase().includes(term)).slice(0, 5).map(([term, meaning]) => ({ term: term.charAt(0).toUpperCase() + term.slice(1), meaning }));
  const headline = sentences[0]?.replace(/^(?:important\s+)?(?:account|service|application)\s+(?:notice|update)\s*:\s*/i, "").replace(/[.!?]$/, "").slice(0, 70) || "Review this notice";
  return {
    headline: headline.length > 65 ? `${headline.slice(0, 62)}…` : headline,
    summary: `Basic extraction found ${actions.length} sentence${actions.length === 1 ? "" : "s"} that may describe an action${details.length ? ` and ${details.length} date, duration, or amount reference${details.length === 1 ? "" : "s"}` : ""}. This preview does not interpret the intent of the message or verify its accuracy.`,
    steps, details, terms,
    questions: ["Who sent this, and can I verify the sender through an official channel?", "What happens if I do nothing?", "Where can I confirm the deadline or required action?"],
    source: "local-preview",
  };
}
