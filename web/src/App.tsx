"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDownToLine, ArrowRight, BookOpenText, Check, CheckCircle2, ChevronRight, CircleAlert, ClipboardCopy, Cloud, FileText, History, KeyRound, Lightbulb, LockKeyhole, Menu, MessageCircleQuestion, Plus, RotateCcw, ScanText, Settings2, ShieldCheck, Sparkles, Trash2, UploadCloud, WandSparkles, X } from "lucide-react";
import { analyzeLocally, examples, type Analysis } from "./lib/analyze";
import { runHybridAnalysis, type FirebaseConnection } from "./lib/hybrid-ai";

type SavedItem = { id: string; title: string; created: string; text: string; result: Analysis };
const HISTORY_KEY = "clearform:history:v1";
const CONNECTION_KEY = "clearform:firebase:v1";
const MAX_CHARS = 9000;

function downloadResult(result: Analysis, original: string) {
  const sections = [
    "CLEARFORM AI — EXPLANATION", "", result.headline, result.summary,
    "", "WHAT TO DO", ...result.steps.map((s, i) => `${i + 1}. ${s}`),
    "", "TERMS", ...result.terms.map(t => `${t.term}: ${t.meaning}`),
    "", "DETAILS FROM ORIGINAL TEXT", ...(result.details.length ? result.details : ["None explicitly detected"]),
    "", "QUESTIONS", ...result.questions.map(q => `• ${q}`),
    "", "ORIGINAL TEXT", original, "",
    "Check the original source before acting. This is informational, not legal, medical, or financial advice."
  ].join("\n");
  const url = URL.createObjectURL(new Blob([sections], { type: "text/plain;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = "clearform-explanation.txt"; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);
  const [view, setView] = useState<"workspace" | "history">("workspace");
  const [history, setHistory] = useState<SavedItem[]>([]);
  const [connection, setConnection] = useState<FirebaseConnection | null>(null);
  const [allowCloudFallback, setAllowCloudFallback] = useState(false);
  const [configText, setConfigText] = useState("");
  const [captchaKey, setCaptchaKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [checked, setChecked] = useState<number[]>([]);
  const [selectedExample, setSelectedExample] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const upload = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      if (Array.isArray(saved)) setHistory(saved.slice(0, 10));
      const stored = JSON.parse(localStorage.getItem(CONNECTION_KEY) || "null");
      if (stored?.firebaseConfig?.apiKey && stored?.appCheckSiteKey) {
        setConnection(stored);
        setConfigText(JSON.stringify(stored.firebaseConfig, null, 2));
        setCaptchaKey(stored.appCheckSiteKey);
      }
    } catch { /* Ignore malformed local data. */ }
  }, []);

  const clearWorkspace = () => {
    setText(""); setResult(null); setChecked([]); setError(""); setSelectedExample("");
    setView("workspace");
    setTimeout(() => textarea.current?.focus(), 0);
  };

  const loadExample = (sample: typeof examples[number]) => {
    setText(sample.text); setResult(null); setSelectedExample(sample.id);
    setChecked([]); setError(""); setView("workspace"); setMobileNav(false);
  };

  const analyze = useCallback(async () => {
    const clean = text.trim();
    if (clean.length < 30) { setError("Please enter at least 30 characters to provide enough context."); return; }
    setBusy(true); setChecked([]); setError("");
    try {
      setResult(connection ? await runHybridAnalysis(clean, connection, allowCloudFallback) : analyzeLocally(clean));
    } catch (err) {
      setError(err instanceof Error ? `Hybrid AI failed: ${err.message}. A labeled basic extraction is shown below.` : "Hybrid AI unavailable.");
      setResult(analyzeLocally(clean));
    } finally { setBusy(false); }
  }, [text, connection, allowCloudFallback]);

  const save = () => {
    if (!result) return;
    const next = [{ id: String(Date.now()), title: result.headline, created: new Date().toISOString(), text, result }, ...history].slice(0, 10);
    setHistory(next); localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  };

  const deleteSaved = (id: string) => {
    const next = history.filter(h => h.id !== id);
    setHistory(next); localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  };

  const saveConnection = () => {
    try {
      const firebaseConfig = JSON.parse(configText);
      if (!firebaseConfig.apiKey || !firebaseConfig.appId || !firebaseConfig.projectId) throw new Error("Firebase config needs apiKey, appId and projectId.");
      if (!captchaKey.trim()) throw new Error("Enter the public reCAPTCHA v3 site key for App Check.");
      const next: FirebaseConnection = { firebaseConfig, appCheckSiteKey: captchaKey.trim() };
      setConnection(next);
      localStorage.setItem(CONNECTION_KEY, JSON.stringify(next));
      setShowSettings(false); setError(""); setResult(null);
    } catch (err) { setError(err instanceof Error ? err.message : "Invalid JSON configuration."); }
  };

  const importFile = async (file?: File) => {
    if (!file) return;
    if (!/\.(txt|md)$/i.test(file.name) || file.size > 100000) {
      setError("Only .txt and .md files under 100 KB are supported. PDF import is not supported yet."); return;
    }
    const content = await file.text();
    setText(content.slice(0, MAX_CHARS)); setResult(null); setSelectedExample("");
    setView("workspace");
    setError(content.length > MAX_CHARS ? "Only the first 9,000 characters were imported." : "");
  };

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText([result.headline, result.summary, ...result.steps.map((s,i)=>`${i+1}. ${s}`)].join("\n"));
      setCopyState(true); setTimeout(() => setCopyState(false), 1800);
    } catch { setError("Copy was blocked by this browser. Use Export instead."); }
  };

  return (
    <div className={largeText ? "shell large-text" : "shell"}>
      <aside className={mobileNav ? "sidebar sidebar-open" : "sidebar"} aria-label="Main navigation">
        <button className="brand" onClick={clearWorkspace} aria-label="ClearForm AI — new explanation">
          <span className="brand-icon"><ScanText size={22}/></span>
          <span className="brand-name">clearform<span>.</span></span><span className="brand-tag">AI</span>
        </button>
        <p className="sidebar-label">YOUR WORKSPACE</p>
        <nav className="side-nav">
          <button className={view === "workspace" ? "nav-link active" : "nav-link"} onClick={() => {setView("workspace");setMobileNav(false);}}><Sparkles size={18}/> New explanation <ChevronRight className="end-icon" size={16}/></button>
          <button className={view === "history" ? "nav-link active" : "nav-link"} onClick={() => {setView("history");setMobileNav(false);}}><History size={18}/> Saved explanations <span className="count">{history.length}</span></button>
        </nav>
        <div className="side-divider"/>
        <p className="sidebar-label">QUICK START</p>
        <div className="side-examples">
          {examples.map(s => <button className={selectedExample === s.id ? "example-link chosen" : "example-link"} key={s.id} onClick={() => loadExample(s)}><span>{s.emoji}</span>{s.title}<ChevronRight className="end-icon" size={15}/></button>)}
        </div>
        <div className="side-fill"/>
        <div className="side-privacy"><span className="privacy-shield"><LockKeyhole size={17}/></span><strong>Built for privacy</strong><p>Basic extraction and on-device AI stay local. Cloud fallback requires your explicit consent.</p><button onClick={() => setShowSettings(true)}>How it works <ArrowRight size={14}/></button></div>
        <div className="profile"><span className="avatar">S</span><span><strong>Guest workspace</strong><small>No account required</small></span><span className="profile-dot"/></div>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left"><button className="mobile-menu icon-button" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation"><Menu size={21}/></button><span>Workspace</span><ChevronRight size={14}/><strong>{view === "workspace" ? "New explanation" : "Saved explanations"}</strong></div>
          <div className="topbar-right"><span className={connection ? "status status-online" : "status"}><span className="status-dot"/>{connection ? "Hybrid AI connected" : "Basic preview mode"}</span><button className="type-button" onClick={() => setLargeText(!largeText)} aria-pressed={largeText}>Aa <span>{largeText ? "Standard text" : "Larger text"}</span></button><button className="icon-button" onClick={() => {setError("");setShowSettings(true);}} aria-label="Configure Firebase AI"><Settings2 size={19}/></button></div>
        </header>
        {view === "workspace" ? <main className="content">
          <section className="intro"><p className="eyebrow">✦ A LITTLE MORE CLARITY, EVERY DAY</p><h1>Complex information.<br/><em>Simply explained.</em></h1><p>Turn confusing documents, notices, and instructions into plain language and practical next steps — with you in control.</p></section>
          <div className="workspace-title"><div><p className="section-kicker">THE EXPLAINER</p><h2>What would you like to understand?</h2></div><button className="reset-button" onClick={clearWorkspace}><RotateCcw size={15}/> Start over</button></div>
          <div className="work-grid">
            <section className="input-card" aria-label="Original text">
              <div className="card-header"><span className="card-icon"><FileText size={21}/></span><div><h3>Your original text</h3><p>Paste an email, letter, notice, or form instruction.</p></div></div>
              <label className="input-label" htmlFor="source-text">TEXT TO EXPLAIN</label>
              <div className="text-container">
                <textarea id="source-text" ref={textarea} value={text} maxLength={MAX_CHARS} onChange={e=>{setText(e.target.value);setResult(null);setSelectedExample("");setError("");}} placeholder={"Paste the confusing message here…\n\nFor example: 'Please remit the outstanding balance within 14 days of the invoice date to avoid account suspension.'"} aria-describedby="text-privacy"/>
                <div className="text-tools"><span>{text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters</span><button onClick={() => upload.current?.click()}><UploadCloud size={15}/> Import text file</button><input ref={upload} type="file" className="sr-only" accept=".txt,.md" onChange={e => {void importFile(e.target.files?.[0]);e.target.value="";}}/></div>
              </div>
              <p className="privacy-note" id="text-privacy"><ShieldCheck size={17}/>{connection ? (allowCloudFallback ? "Hybrid enabled: if on-device AI is unavailable, your text may be sent to Google's cloud." : "Private-only mode: AI runs on your device, or it reports an error. No cloud fallback.") : "Basic preview is local. Your text isn't sent to an AI service."}</p>
              {connection && <label className="cloud-fallback-option"><input type="checkbox" checked={allowCloudFallback} onChange={e => {setAllowCloudFallback(e.target.checked);setResult(null);}}/><span><strong>Allow cloud fallback</strong><small>Optional. If local Gemini Nano is unavailable, Firebase may send your text to Google's Gemini service. Turn off for on-device only.</small></span></label>}
              <button className="main-cta" onClick={() => void analyze()} disabled={busy || text.trim().length < 30}><WandSparkles size={19}/>{busy ? "Working on it…" : connection ? (allowCloudFallback ? "Explain with hybrid AI" : "Explain on-device only") : "Create a basic explanation"}<ArrowRight className="cta-arrow" size={19}/></button>
              {error && <div className="error" role="alert"><CircleAlert size={16}/><span>{error}</span></div>}
              <div className="card-footer"><span><LockKeyhole size={13}/> You control your information</span><button onClick={()=>{setError("");setShowSettings(true);}}>{connection ? "AI settings" : "Enable hybrid AI"} <ChevronRight size={14}/></button></div>
            </section>
            <section className={result ? "output-card filled" : "output-card"} aria-live="polite" aria-busy={busy}>
              {result ? <>
                <div className="result-top"><span><CheckCircle2 size={17}/> YOUR EXPLANATION</span><small className={result.source === "local-preview" ? "mode-chip demo" : "mode-chip"}>{result.source === "local-preview" ? "Basic extraction · No AI" : result.source === "hybrid-on-device" ? "AI · On-device" : "AI · Cloud"}</small></div>
                <h3 className="result-headline">{result.headline}</h3><p className="result-summary">{result.summary}</p>
                <div className="result-separator"/>
                <div className="result-section"><span className="small-icon"><Check size={17}/></span><div><h4>Your next steps</h4><small>Tick off steps as you go</small></div><small className="progress">{checked.length}/{result.steps.length}</small></div>
                <div className="checklist">{result.steps.map((step,i)=><label className={checked.includes(i) ? "check-row done" : "check-row"} key={i}><input type="checkbox" checked={checked.includes(i)} onChange={e=>setChecked(v=>e.target.checked?[...v,i]:v.filter(n=>n!==i))}/><span className="custom-check"><Check size={13}/></span><span>{step}</span></label>)}</div>
                {!!result.details.length && <div className="details"><strong>DETAILS FROM YOUR TEXT</strong>{result.details.map((d,i)=><span key={i}><i/>{d}</span>)}</div>}
                <div className="result-section extra"><span className="small-icon pale"><BookOpenText size={17}/></span><h4>In simpler words</h4></div>
                <div className="terms">{result.terms.length ? result.terms.map((term,i)=><div key={i}><strong>{term.term}</strong><span>{term.meaning}</span></div>) : <p>No common technical terms detected.</p>}</div>
                <div className="result-section extra"><span className="small-icon pale"><MessageCircleQuestion size={17}/></span><h4>Questions worth asking</h4></div>
                <ul className="questions">{result.questions.map((q,i)=><li key={i}>{q}</li>)}</ul>
                {result.source === "local-preview" && <p className="demo-warning"><CircleAlert size={17}/><span>This is a rule-based preview, not an AI interpretation. It only extracts potential actions and keywords. <button onClick={()=>setShowSettings(true)}>Connect Firebase AI</button> for the full experience.</span></p>}
                <div className="result-buttons"><button onClick={()=>void copy()}><ClipboardCopy size={15}/>{copyState ? "Copied!" : "Copy"}</button><button onClick={()=>downloadResult(result,text)}><ArrowDownToLine size={15}/>Export</button><button onClick={save}><Plus size={15}/>Save locally</button></div>
              </> : <div className="empty"><div className="empty-illustration"><div className="paper-back"/><div className="paper-front"><i/><i/><i/><i/></div><span className="spark-a">✦</span><span className="spark-b">✦</span><span className="art-check"><Check size={21}/></span></div><span className="empty-kicker">YOUR CLARITY SPACE</span><h3>Make sense of it all.</h3><p>Add your text and click explain. Your actionable breakdown will appear here.</p><span className="ready"><i/> Ready when you are</span></div>}
            </section>
          </div>
          <div className="benefits"><div><span><LockKeyhole size={20}/></span><div><strong>Privacy comes first</strong><small>No automatic uploads</small></div></div><div><span><Lightbulb size={20}/></span><div><strong>Clarity over jargon</strong><small>Words you can understand</small></div></div><div><span><CheckCircle2 size={20}/></span><div><strong>Accessible by design</strong><small>Readable and keyboard-friendly</small></div></div></div>
        </main> : <main className="content history-page"><p className="eyebrow">YOUR PERSONAL SPACE</p><h1>Saved <em>explanations.</em></h1><p>Saved only in this browser. Nothing is synced to an account or server.</p><div className="history-title"><h2>Previously saved</h2><small>{history.length} items</small></div>{history.length ? <div className="saved-list">{history.map(item=><article key={item.id}><span className="saved-icon"><FileText size={21}/></span><div><h3>{item.title}</h3><p>{new Date(item.created).toLocaleString()} · {item.result.source === "local-preview" ? "Basic preview" : "Hybrid AI"}</p></div><button aria-label={`Open ${item.title}`} onClick={()=>{setText(item.text);setResult(item.result);setView("workspace");setChecked([]);}}><ArrowRight size={18}/></button><button aria-label={`Delete ${item.title}`} onClick={()=>deleteSaved(item.id)}><Trash2 size={17}/></button></article>)}</div> : <div className="history-empty"><History size={36}/><h3>Nothing saved yet</h3><p>When you explain a document, click “Save locally” to keep it here.</p><button className="main-cta" onClick={()=>setView("workspace")}>Start an explanation <ArrowRight size={17}/></button></div>}</main>}
        <footer className="footer"><span>© 2026 ClearForm AI · A hackathon prototype by Samer Tallauze</span><span>AI can make mistakes. Always verify important details.</span></footer>
      </div>
      {mobileNav && <button className="nav-overlay" onClick={()=>setMobileNav(false)} aria-label="Close navigation"/>}
      {showSettings && <div className="modal-overlay" onMouseDown={e=>{if(e.target===e.currentTarget){setShowSettings(false);setError("");}}}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-top"><span className="modal-icon"><Cloud size={22}/></span><button aria-label="Close settings" onClick={()=>{setShowSettings(false);setError("");}}><X size={19}/></button></div><h2 id="modal-title">Connect hybrid AI</h2><p>Bring your own Firebase project to run on-device AI. Optional hybrid cloud fallback is disabled until you explicitly enable it.</p><div className="security-tip"><ShieldCheck size={20}/><span>Firebase web config is public metadata, not a secret. Never paste private credentials. Enable App Check with reCAPTCHA v3 in your Firebase console.</span></div><label htmlFor="firebase-json">Firebase web configuration (JSON)</label><textarea id="firebase-json" rows={6} spellCheck={false} value={configText} onChange={e=>setConfigText(e.target.value)} placeholder={'{\n  "apiKey": "...",\n  "authDomain": "...",\n  "projectId": "...",\n  "appId": "..."\n}'}/><label htmlFor="captcha-key">App Check reCAPTCHA v3 public site key</label><input id="captcha-key" value={captchaKey} onChange={e=>setCaptchaKey(e.target.value)} placeholder="Public site key"/>{error && <div className="error" role="alert"><CircleAlert size={16}/>{error}</div>}<button className="main-cta" onClick={saveConnection}><KeyRound size={18}/> Save Firebase connection <ArrowRight size={17}/></button>{connection && <button className="disconnect" onClick={()=>{setConnection(null);setAllowCloudFallback(false);localStorage.removeItem(CONNECTION_KEY);setShowSettings(false);setError("");setResult(null);}}>Disconnect Firebase from this browser</button>}<p className="modal-help">Requires a Firebase AI Logic-enabled project and approved domain. Follow <a target="_blank" rel="noreferrer" href="https://firebase.google.com/docs/ai-logic/hybrid/web/get-started">Google's official setup guide ↗</a>.</p></div></div>}
    </div>
  );
}
