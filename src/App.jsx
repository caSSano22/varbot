import { useState } from "react";

/* ─── DATA ─── */
const MATCHES = [
  { id:1,  home:"Mexico",      hf:"🇲🇽", away:"South Africa", af:"🇿🇦", group:"A", date:"Jun 12" },
  { id:2,  home:"Spain",       hf:"🇪🇸", away:"Croatia",      af:"🇭🇷", group:"C", date:"Jun 13" },
  { id:3,  home:"Brazil",      hf:"🇧🇷", away:"Germany",      af:"🇩🇪", group:"D", date:"Jun 14" },
  { id:4,  home:"France",      hf:"🇫🇷", away:"Argentina",    af:"🇦🇷", group:"E", date:"Jun 14" },
  { id:5,  home:"England",     hf:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", away:"Portugal",    af:"🇵🇹", group:"F", date:"Jun 15" },
  { id:6,  home:"Netherlands", hf:"🇳🇱", away:"Belgium",      af:"🇧🇪", group:"G", date:"Jun 15" },
  { id:7,  home:"USA",         hf:"🇺🇸", away:"Japan",        af:"🇯🇵", group:"H", date:"Jun 16" },
  { id:8,  home:"Canada",      hf:"🇨🇦", away:"Bosnia",       af:"🇧🇦", group:"B", date:"Jun 13" },
];

const TEAMS = [
  "Argentina 🇦🇷","Brazil 🇧🇷","France 🇫🇷","England 🏴󠁧󠁢󠁥󠁮󠁧󠁿","Spain 🇪🇸","Germany 🇩🇪",
  "Portugal 🇵🇹","Netherlands 🇳🇱","Belgium 🇧🇪","Croatia 🇭🇷","Uruguay 🇺🇾","USA 🇺🇸",
  "Mexico 🇲🇽","Japan 🇯🇵","Morocco 🇲🇦","Senegal 🇸🇳","Australia 🇦🇺","Canada 🇨🇦",
  "Colombia 🇨🇴","Ecuador 🇪🇨","Switzerland 🇨🇭","Denmark 🇩🇰","Poland 🇵🇱","Serbia 🇷🇸",
];

const TOPICS = [
  "Is Messi really the greatest of all time?",
  "Is VAR ruining football?",
  "Can the USA win the World Cup on home soil?",
  "Is Ronaldo's career over after this World Cup?",
  "Will Africa finally win a World Cup in our lifetime?",
  "Is modern football too physical or not physical enough?",
  "Should the World Cup stay at 48 teams or go back to 32?",
];

/* ─── API ─── */
async function callAI(system, user) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, user }),
  });
  const d = await res.json();
  return d.text || "VARBOT is reviewing the footage...";
}

/* ─── PROMPTS ─── */
const P = {
  predict: `You are VARBOT — elite AI football referee for FIFA World Cup 2026. Sharp, data-driven, slightly arrogant. Respond ONLY in English using this exact structure:

🟡 VERDICT
[One decisive sentence]

📊 PREDICTED SCORE
[e.g. 2–1 to Spain]

🧠 TACTICAL BREAKDOWN
[2–3 sharp sentences on tactics, strengths, weaknesses]

⚠️ VAR FACTOR
[One specific VAR/penalty/key-player scenario that could flip the result]

📈 AI CONFIDENCE: [XX%]
[One sentence why]

📲 POST THIS
[Punchy 2–3 line post for X/Warpcast. Emojis. End with #VARBOT #WorldCup2026 #Base]`,

  roast: `You are VARBOT — the most savage AI football analyst on the internet. You've just watched a match result and you ROAST it mercilessly — the losing team, the referee's mistakes, and anything controversial. You're funny, brutal, and always right. Respond ONLY in English using this structure:

🔥 THE VERDICT
[One devastating one-liner about the result]

😂 ROAST OF THE LOSING SIDE
[2–3 sentences absolutely destroying the losing team's performance]

🟨 REF REVIEW
[Rate the referee 1–10 and mock at least one decision]

💀 PLAYER IN THE SPOTLIGHT
[Call out the worst performer by name — no mercy]

🎭 DRAMA RATING: [X/10]
[One sentence rating how dramatic/chaotic the match was]

📲 POST THIS
[A viral-worthy spicy take for X. Under 280 characters. Savage. Include #VARBOT #WorldCup2026]`,

  scout: `You are VARBOT — elite AI football scout with access to deep historical and tactical data. Produce a detailed scouting report comparing two national teams. Respond ONLY in English using this structure:

⚔️ HEAD-TO-HEAD HISTORY
[2 sentences on their historical rivalry and recent meetings]

🔵 [TEAM A] STRENGTHS & WEAKNESSES
[3 bullet points each, sharp and specific]

🔴 [TEAM B] STRENGTHS & WEAKNESSES  
[3 bullet points each, sharp and specific]

🎯 KEY BATTLEGROUND
[The one tactical duel that will decide any future meeting between these teams]

🏆 EDGE GOES TO
[One team and one sentence why — be decisive]

📲 POST THIS
[Punchy scouting summary for X/Warpcast. Include #VARBOT #WorldCup2026 #Base]`,

  trophy: `You are VARBOT — the most confident AI tournament analyst alive. Give a bold, opinionated World Cup 2026 winner prediction. Respond ONLY in English using this structure:

🏆 VARBOT PICKS THE WINNER
[Country name + flag + one-sentence verdict]

🔝 TOP 4 PREDICTION
1. [Country] — [one reason]
2. [Country] — [one reason]
3. [Country] — [one reason]
4. [Country] — [one reason]

😤 BIGGEST DARK HORSE
[One surprise team and why they could go deep]

💔 BIGGEST DISAPPOINTMENT
[One big team that will underperform and why]

🎲 WILDCARD EVENT
[One dramatic/chaotic thing VARBOT predicts will happen — player drama, VAR controversy, upset]

📲 POST THIS
[A bold, spicy winner prediction post for X. Confident. Include #VARBOT #WorldCup2026 #Base]`,

  hottake: `You are VARBOT — the most controversial AI football pundit on the internet. You give HOT TAKES that provoke debate. Your takes are bold, unapologetic, and designed to go viral. Respond ONLY in English using this structure:

🌶️ VARBOT HOT TAKE
[One explosive, controversial opening statement on the topic]

🧨 THE CASE FOR IT
[2–3 punchy reasons supporting the take]

🛡️ THE COUNTER (that VARBOT dismisses)
[What critics say — then shut it down in one line]

🎤 MIC DROP LINE
[One ultimate one-liner that ends the debate]

📲 POST THIS
[A viral hot take tweet. Under 240 chars. Spicy. Include #VARBOT #WorldCup2026]`,
};

/* ─── STYLES ─── */
const gold = "#F0A500";
const bg = { 0:"#07070a", 1:"#0d0d12", 2:"#111118", 3:"#16161e", 4:"#1c1c26" };
const border = "rgba(255,255,255,0.07)";

const gStyle = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:${bg[0]};color:#eee;font-family:'Segoe UI',system-ui,sans-serif}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
  select{background:${bg[3]};color:#ccc;border:1px solid ${border};border-radius:8px;padding:10px 14px;font-size:14px;width:100%;font-family:inherit;cursor:pointer;appearance:none;outline:none}
  select:focus{border-color:rgba(240,165,0,0.4)}
  textarea{background:${bg[3]};color:#ccc;border:1px solid ${border};border-radius:8px;padding:12px 14px;font-size:14px;width:100%;font-family:inherit;resize:none;outline:none;line-height:1.6}
  textarea:focus{border-color:rgba(240,165,0,0.4)}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
`;

/* ─── HELPERS ─── */
const card = (extra={}) => ({
  background: bg[2], border:`1px solid ${border}`,
  borderRadius:12, padding:"16px 18px", ...extra,
});
const label = { fontSize:9, fontWeight:700, letterSpacing:1.8, color:"#3a3a50", textTransform:"uppercase", marginBottom:8 };
const Spinner = () => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, padding:"60px 0" }}>
    <div style={{ width:38,height:38,border:`3px solid rgba(240,165,0,0.12)`,borderTopColor:gold,borderRadius:"50%",animation:"spin .7s linear infinite" }} />
    <div style={{ fontSize:12, color:"#333", letterSpacing:.5 }}>VARBOT is analyzing...</div>
  </div>
);

/* ─── OUTPUT BLOCK ─── */
function Output({ text, onCopy, copied }) {
  if (!text) return null;
  const sections = [];
  const lines = text.split("\n");
  let cur = null, buf = [];
  const flush = () => { if (cur) sections.push({ head: cur, body: buf.join("\n").trim() }); cur=null; buf=[]; };
  for (const ln of lines) {
    const isHead = /^[🟡📊🧠⚠️📈📲🔥😂🟨💀🎭⚔️🔵🔴🎯🏆🔝😤💔🎲🌶️🧨🛡️🎤]/.test(ln.trim());
    if (isHead) { flush(); cur = ln.trim(); }
    else if (cur && ln.trim()) buf.push(ln.trim());
  }
  flush();

  const isShare = (h) => h.includes("POST THIS") || h.includes("📲");

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12, animation:"fadeIn .4s ease" }}>
      {sections.map((s, i) => (
        <div key={i} style={card(isShare(s.head) ? { background:"#0f120f", borderColor:"rgba(240,165,0,0.18)" } : {})}>
          <div style={label}>{s.head}</div>
          <div style={{ fontSize:14, color: isShare(s.head) ? "#777" : s.head.includes("VERDICT") || s.head.includes("PICKS") || s.head.includes("HOT TAKE") ? gold : "#ccc", lineHeight:1.8, fontStyle: isShare(s.head) ? "italic" : "normal", fontWeight: s.head.includes("VERDICT") || s.head.includes("PICKS") || s.head.includes("HOT TAKE") ? 700 : 400, fontSize: s.head.includes("VERDICT") || s.head.includes("PICKS") || s.head.includes("HOT TAKE") ? 16 : 14 }}>
            {s.body}
          </div>
        </div>
      ))}
      {sections.length === 0 && (
        <div style={card()}><div style={{ fontSize:14, color:"#ccc", lineHeight:1.85, whiteSpace:"pre-wrap" }}>{text}</div></div>
      )}
      <button onClick={onCopy} style={{
        padding:"11px 0", borderRadius:8, border:"none", cursor:"pointer",
        background: copied ? "#16301a" : gold, color: copied ? "#22c55e" : "#000",
        fontSize:13, fontWeight:700, letterSpacing:.5, fontFamily:"inherit",
        border: copied ? `1px solid #22c55e` : "none", transition:"all .2s",
      }}>{copied ? "✅  Copied to clipboard!" : "📋  Copy Post Caption"}</button>
    </div>
  );
}

/* ═══════════════════════════════════════
   MODE COMPONENTS
═══════════════════════════════════════ */

/* ── 1. PREDICT ── */
function Predict() {
  const [sel, setSel] = useState(null);
  const [out, setOut] = useState(""); const [busy, setBusy] = useState(false); const [copied, setCopied] = useState(false);
  async function go(m) {
    setSel(m); setOut(""); setBusy(true); setCopied(false);
    try { setOut(await callAI(P.predict, `Group ${m.group} match: ${m.home} vs ${m.away} — FIFA World Cup 2026, ${m.date}.`)); }
    catch { setOut("⚠️ Connection error. Try again."); } finally { setBusy(false); }
  }
  function doCopy() {
    const lines = out.split("\n"); const idx = lines.findIndex(l => l.includes("POST THIS") || l.includes("📲"));
    navigator.clipboard.writeText(idx >= 0 ? lines.slice(idx+1).filter(l=>l.trim()).join("\n") : out.split("\n").slice(-4).join("\n"));
    setCopied(true); setTimeout(()=>setCopied(false), 2400);
  }
  return (
    <div style={{ display:"flex", gap:0, flex:1, overflow:"hidden" }}>
      <div style={{ width:248, background:bg[1], borderRight:`1px solid ${border}`, overflowY:"auto", flexShrink:0 }}>
        <div style={{ padding:"11px 15px 8px", fontSize:9, fontWeight:700, letterSpacing:1.6, color:"#2a2a3a", borderBottom:`1px solid ${border}`, textTransform:"uppercase" }}>Group Stage · Jun 2026</div>
        {MATCHES.map(m => {
          const active = sel?.id === m.id;
          return (
            <div key={m.id} onClick={()=>go(m)} style={{ padding:"11px 15px", borderBottom:`1px solid rgba(255,255,255,0.04)`, borderLeft:`3px solid ${active?gold:"transparent"}`, background:active?"rgba(240,165,0,0.05)":"transparent", cursor:"pointer", transition:"all .12s" }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.4, color:gold, marginBottom:6 }}>GROUP {m.group} · {m.date}</div>
              <div style={{ fontSize:13, fontWeight:500, display:"flex", gap:6, marginBottom:3 }}><span>{m.hf}</span><span style={{color:"#ddd"}}>{m.home}</span></div>
              <div style={{ fontSize:10, color:"#2a2a3a", marginLeft:20, marginBottom:3 }}>vs</div>
              <div style={{ fontSize:13, fontWeight:500, display:"flex", gap:6 }}><span>{m.af}</span><span style={{color:"#ddd"}}>{m.away}</span></div>
            </div>
          );
        })}
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:24 }}>
        {!sel && !busy && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", gap:12, opacity:.35 }}>
            <div style={{ fontSize:52 }}>🟡</div>
            <div style={{ fontSize:16, fontWeight:700, letterSpacing:1, color:"#555" }}>SELECT A MATCH</div>
            <div style={{ fontSize:12, color:"#333", textAlign:"center", maxWidth:240, lineHeight:1.7 }}>Pick a fixture. VARBOT predicts the score, analyzes tactics, and writes your post.</div>
          </div>
        )}
        {busy && <Spinner />}
        {out && !busy && (
          <>
            <div style={{ background:bg[1], border:`1px solid ${border}`, borderRadius:12, padding:"20px 22px", marginBottom:16 }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.5, color:gold, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ display:"inline-block", width:16, height:2, background:gold, borderRadius:1 }} />VARBOT MATCH ANALYSIS · FIFA WORLD CUP 2026
              </div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:38 }}>{sel.hf}</span>
                  <div><div style={{ fontSize:18, fontWeight:800, letterSpacing:1, textTransform:"uppercase" }}>{sel.home}</div></div>
                </div>
                <div style={{ fontSize:20, fontWeight:900, color:"#222", letterSpacing:3 }}>VS</div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ textAlign:"right" }}><div style={{ fontSize:18, fontWeight:800, letterSpacing:1, textTransform:"uppercase" }}>{sel.away}</div></div>
                  <span style={{ fontSize:38 }}>{sel.af}</span>
                </div>
              </div>
            </div>
            <Output text={out} onCopy={doCopy} copied={copied} />
          </>
        )}
      </div>
    </div>
  );
}

/* ── 2. ROAST ── */
function Roast() {
  const [winner, setWinner] = useState(TEAMS[0]);
  const [loser, setLoser]   = useState(TEAMS[2]);
  const [score, setScore]   = useState("");
  const [out, setOut]       = useState(""); const [busy, setBusy] = useState(false); const [copied, setCopied] = useState(false);
  async function go() {
    if (!score.trim()) return;
    setOut(""); setBusy(true); setCopied(false);
    try { setOut(await callAI(P.roast, `Match result: ${winner} defeated ${loser} with a score of ${score}. Roast this match.`)); }
    catch { setOut("⚠️ Roast engine offline. Try again."); } finally { setBusy(false); }
  }
  function doCopy() {
    const lines = out.split("\n"); const idx = lines.findIndex(l => l.includes("POST THIS") || l.includes("📲"));
    navigator.clipboard.writeText(idx >= 0 ? lines.slice(idx+1).filter(l=>l.trim()).join("\n") : out.split("\n").slice(-3).join("\n"));
    setCopied(true); setTimeout(()=>setCopied(false), 2400);
  }
  return (
    <div style={{ maxWidth:660, margin:"0 auto", padding:28 }}>
      <div style={card({ marginBottom:16 })}>
        <div style={{ fontSize:11, fontWeight:700, color:gold, letterSpacing:1, marginBottom:16 }}>🔥 ENTER MATCH RESULT TO ROAST</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:12, alignItems:"center", marginBottom:14 }}>
          <div>
            <div style={{ ...label, marginBottom:5 }}>Winner</div>
            <select value={winner} onChange={e=>setWinner(e.target.value)}>{TEAMS.map(t=><option key={t}>{t}</option>)}</select>
          </div>
          <div style={{ fontSize:13, color:"#333", fontWeight:700, paddingTop:18 }}>def.</div>
          <div>
            <div style={{ ...label, marginBottom:5 }}>Loser</div>
            <select value={loser} onChange={e=>setLoser(e.target.value)}>{TEAMS.map(t=><option key={t}>{t}</option>)}</select>
          </div>
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={{ ...label, marginBottom:5 }}>Final Score (e.g. 3–0)</div>
          <input value={score} onChange={e=>setScore(e.target.value)} placeholder="e.g. 4–1"
            style={{ background:bg[3], color:"#ccc", border:`1px solid ${border}`, borderRadius:8, padding:"10px 14px", fontSize:14, width:"100%", fontFamily:"inherit", outline:"none" }} />
        </div>
        <button onClick={go} disabled={busy || !score.trim()} style={{ width:"100%", padding:"11px 0", borderRadius:8, border:"none", cursor:"pointer", background:(!score.trim()||busy)?"#1a1a22":gold, color:(!score.trim()||busy)?"#333":"#000", fontSize:13, fontWeight:700, letterSpacing:.5, fontFamily:"inherit", transition:"all .2s" }}>
          {busy ? "Roasting..." : "🔥 Generate Roast"}
        </button>
      </div>
      {busy && <Spinner />}
      {out && !busy && <Output text={out} onCopy={doCopy} copied={copied} />}
    </div>
  );
}

/* ── 3. SCOUT ── */
function Scout() {
  const [t1, setT1] = useState(TEAMS[0]);
  const [t2, setT2] = useState(TEAMS[2]);
  const [out, setOut] = useState(""); const [busy, setBusy] = useState(false); const [copied, setCopied] = useState(false);
  async function go() {
    setOut(""); setBusy(true); setCopied(false);
    try { setOut(await callAI(P.scout, `Produce a full scouting report comparing ${t1} vs ${t2} for the 2026 FIFA World Cup.`)); }
    catch { setOut("⚠️ Scout database offline."); } finally { setBusy(false); }
  }
  function doCopy() {
    const lines = out.split("\n"); const idx = lines.findIndex(l => l.includes("POST THIS") || l.includes("📲"));
    navigator.clipboard.writeText(idx >= 0 ? lines.slice(idx+1).filter(l=>l.trim()).join("\n") : out.split("\n").slice(-3).join("\n"));
    setCopied(true); setTimeout(()=>setCopied(false), 2400);
  }
  return (
    <div style={{ maxWidth:660, margin:"0 auto", padding:28 }}>
      <div style={card({ marginBottom:16 })}>
        <div style={{ fontSize:11, fontWeight:700, color:gold, letterSpacing:1, marginBottom:16 }}>⚔️ HEAD-TO-HEAD SCOUTING REPORT</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:12, alignItems:"center", marginBottom:14 }}>
          <div>
            <div style={{ ...label, marginBottom:5 }}>Team A</div>
            <select value={t1} onChange={e=>setT1(e.target.value)}>{TEAMS.map(t=><option key={t}>{t}</option>)}</select>
          </div>
          <div style={{ fontSize:18, color:"#222", fontWeight:900, paddingTop:18 }}>⚔️</div>
          <div>
            <div style={{ ...label, marginBottom:5 }}>Team B</div>
            <select value={t2} onChange={e=>setT2(e.target.value)}>{TEAMS.map(t=><option key={t}>{t}</option>)}</select>
          </div>
        </div>
        <button onClick={go} disabled={busy} style={{ width:"100%", padding:"11px 0", borderRadius:8, border:"none", cursor:"pointer", background:busy?"#1a1a22":gold, color:busy?"#333":"#000", fontSize:13, fontWeight:700, letterSpacing:.5, fontFamily:"inherit", transition:"all .2s" }}>
          {busy ? "Scouting..." : "⚔️ Run Scout Report"}
        </button>
      </div>
      {busy && <Spinner />}
      {out && !busy && <Output text={out} onCopy={doCopy} copied={copied} />}
    </div>
  );
}

/* ── 4. TROPHY RACE ── */
function Trophy() {
  const [out, setOut] = useState(""); const [busy, setBusy] = useState(false); const [copied, setCopied] = useState(false);
  async function go() {
    setOut(""); setBusy(true); setCopied(false);
    try { setOut(await callAI(P.trophy, "Give your bold World Cup 2026 winner prediction with full tournament analysis.")); }
    catch { setOut("⚠️ Trophy predictor offline."); } finally { setBusy(false); }
  }
  function doCopy() {
    const lines = out.split("\n"); const idx = lines.findIndex(l => l.includes("POST THIS") || l.includes("📲"));
    navigator.clipboard.writeText(idx >= 0 ? lines.slice(idx+1).filter(l=>l.trim()).join("\n") : out.split("\n").slice(-3).join("\n"));
    setCopied(true); setTimeout(()=>setCopied(false), 2400);
  }
  return (
    <div style={{ maxWidth:660, margin:"0 auto", padding:28 }}>
      <div style={card({ marginBottom:16, textAlign:"center" })}>
        <div style={{ fontSize:48, marginBottom:12 }}>🏆</div>
        <div style={{ fontSize:17, fontWeight:800, letterSpacing:1, color:"#eee", marginBottom:6 }}>WORLD CUP 2026 TROPHY RACE</div>
        <div style={{ fontSize:13, color:"#444", lineHeight:1.7, marginBottom:18 }}>VARBOT predicts the champion, top 4, biggest dark horse, and the wildcard event that will shake the tournament.</div>
        <button onClick={go} disabled={busy} style={{ padding:"12px 32px", borderRadius:8, border:"none", cursor:"pointer", background:busy?"#1a1a22":gold, color:busy?"#333":"#000", fontSize:14, fontWeight:700, letterSpacing:.5, fontFamily:"inherit", transition:"all .2s" }}>
          {busy ? "Predicting..." : "🏆 VARBOT, Who Wins?"}
        </button>
      </div>
      {busy && <Spinner />}
      {out && !busy && <Output text={out} onCopy={doCopy} copied={copied} />}
    </div>
  );
}

/* ── 5. HOT TAKE ── */
function HotTake() {
  const [topic, setTopic] = useState("");
  const [out, setOut] = useState(""); const [busy, setBusy] = useState(false); const [copied, setCopied] = useState(false);
  async function go(t) {
    const useTopic = t || topic; if (!useTopic.trim()) return;
    setTopic(useTopic); setOut(""); setBusy(true); setCopied(false);
    try { setOut(await callAI(P.hottake, `Generate a hot take on this football topic: "${useTopic}"`)); }
    catch { setOut("⚠️ Hot take generator offline."); } finally { setBusy(false); }
  }
  function doCopy() {
    const lines = out.split("\n"); const idx = lines.findIndex(l => l.includes("POST THIS") || l.includes("📲"));
    navigator.clipboard.writeText(idx >= 0 ? lines.slice(idx+1).filter(l=>l.trim()).join("\n") : out.split("\n").slice(-3).join("\n"));
    setCopied(true); setTimeout(()=>setCopied(false), 2400);
  }
  return (
    <div style={{ maxWidth:660, margin:"0 auto", padding:28 }}>
      <div style={card({ marginBottom:16 })}>
        <div style={{ fontSize:11, fontWeight:700, color:gold, letterSpacing:1, marginBottom:16 }}>🌶️ HOT TAKE GENERATOR</div>
        <div style={{ marginBottom:12 }}>
          <div style={{ ...label, marginBottom:5 }}>Your Topic</div>
          <textarea value={topic} onChange={e=>setTopic(e.target.value)} rows={2} placeholder="e.g. Is VAR ruining football? / Can Mbappe carry France alone? / Is 48 teams too many?" />
        </div>
        <button onClick={()=>go()} disabled={busy || !topic.trim()} style={{ width:"100%", padding:"11px 0", borderRadius:8, border:"none", cursor:"pointer", background:(!topic.trim()||busy)?"#1a1a22":gold, color:(!topic.trim()||busy)?"#333":"#000", fontSize:13, fontWeight:700, letterSpacing:.5, fontFamily:"inherit", transition:"all .2s", marginBottom:14 }}>
          {busy ? "Generating..." : "🌶️ Drop the Take"}
        </button>
        <div style={{ fontSize:10, color:"#2a2a3a", marginBottom:8, fontWeight:600, letterSpacing:1, textTransform:"uppercase" }}>Or pick one:</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
          {TOPICS.map(t => (
            <button key={t} onClick={()=>go(t)} disabled={busy} style={{ fontSize:11, padding:"5px 11px", borderRadius:20, border:`1px solid ${border}`, background:bg[3], color:"#555", cursor:"pointer", fontFamily:"inherit", transition:"all .12s" }}>{t}</button>
          ))}
        </div>
      </div>
      {busy && <Spinner />}
      {out && !busy && <Output text={out} onCopy={doCopy} copied={copied} />}
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN APP
═══════════════════════════════════════ */
const TABS = [
  { id:"predict", icon:"🟡", label:"Predict",     sub:"Match forecast" },
  { id:"roast",   icon:"🔥", label:"Roast",       sub:"Post-match roast" },
  { id:"scout",   icon:"⚔️", label:"Scout",       sub:"H2H analysis" },
  { id:"trophy",  icon:"🏆", label:"Trophy Race", sub:"Who wins it all?" },
  { id:"hottake", icon:"🌶️", label:"Hot Takes",   sub:"Viral opinions" },
];

export default function App() {
  const [tab, setTab] = useState("predict");
  return (
    <>
      <style>{gStyle}</style>
      <div style={{ minHeight:"100vh", background:bg[0], display:"flex", flexDirection:"column" }}>

        {/* HEADER */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", height:56, background:bg[1], borderBottom:`1px solid ${border}`, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:11 }}>
            <div style={{ width:34, height:34, background:gold, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>⚽</div>
            <div>
              <div style={{ fontSize:18, fontWeight:800, letterSpacing:2.5, color:gold, lineHeight:1 }}>$VARBOT</div>
              <div style={{ fontSize:9, color:"#2a2a3a", letterSpacing:1.4, marginTop:2 }}>AI REFEREE · WORLD CUP 2026 · BASE NETWORK</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <span style={{ fontSize:10, fontWeight:600, padding:"4px 10px", borderRadius:20, border:"1px solid rgba(34,197,94,0.3)", color:"#22c55e", background:"rgba(34,197,94,0.06)", letterSpacing:.5 }}>⬤ LIVE AI</span>
            <span style={{ fontSize:10, fontWeight:600, padding:"4px 10px", borderRadius:20, border:`1px solid ${border}`, color:"#333", background:bg[2], letterSpacing:.5 }}>Clanker · Base</span>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display:"flex", background:bg[1], borderBottom:`1px solid ${border}`, flexShrink:0, overflowX:"auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              display:"flex", alignItems:"center", gap:8, padding:"12px 20px",
              background:"none", border:"none", cursor:"pointer", fontFamily:"inherit",
              borderBottom:`2px solid ${tab===t.id?gold:"transparent"}`,
              transition:"all .12s", flexShrink:0,
            }}>
              <span style={{ fontSize:15 }}>{t.icon}</span>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontSize:12, fontWeight:700, color:tab===t.id?gold:"#555", letterSpacing:.3 }}>{t.label}</div>
                <div style={{ fontSize:9, color:"#2a2a3a", marginTop:1 }}>{t.sub}</div>
              </div>
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
          {tab === "predict" && <Predict />}
          {tab === "roast"   && <div style={{ flex:1, overflowY:"auto" }}><Roast /></div>}
          {tab === "scout"   && <div style={{ flex:1, overflowY:"auto" }}><Scout /></div>}
          {tab === "trophy"  && <div style={{ flex:1, overflowY:"auto" }}><Trophy /></div>}
          {tab === "hottake" && <div style={{ flex:1, overflowY:"auto" }}><HotTake /></div>}
        </div>
      </div>
    </>
  );
}
