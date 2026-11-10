import test from "node:test";
import assert from "node:assert/strict";
import { analyzeLocally, examples } from "../lib/analyze.ts";

test("extracts explicit date without inventing a date", () => {
  const result = analyzeLocally(examples[1].text);
  assert.equal(result.source, "local-preview");
  assert.ok(result.details.includes("November 28, 2026"));
  assert.ok(!result.details.includes("January 1, 2027"));
});

test("preserves a monetary amount", () => {
  const result = analyzeLocally(examples[2].text);
  assert.ok(result.details.includes("JOD 48.00"));
  assert.ok(result.steps.some(s => /cancel/i.test(s)));
});

test("labels rule-based extraction honestly", () => {
  const result = analyzeLocally("Please review this document and submit your response within 14 calendar days.");
  assert.equal(result.source, "local-preview");
  assert.match(result.summary, /Basic extraction/i);
});

test("provides safe default without action wording", () => {
  const result = analyzeLocally("This is an informational memo about an upcoming event tomorrow.");
  assert.match(result.steps[0], /Read the original/i);
});
