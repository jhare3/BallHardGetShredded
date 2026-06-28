import React, { useState, useEffect, useRef } from 'react';

// ── Asset imports (from src/assets/) ─────────────────────────────────
import iconDunk    from './assets/dunk.png';
import iconWeights from './assets/wieghts.png';
import iconCardio  from './assets/cardio.png';
import iconHeat    from './assets/heatingup.png';
import iconBall    from './assets/ballislife.png';

// ── Constitution data ─────────────────────────────────────────────────
const C = {
  goals: {
    body: {
      aesthetic: ["6-pack abs", "No hunch back", "Shredded upper body"],
      foundation: ["Bulletproof ankles, Achilles & calves", "Strong toes, feet, legs & core"],
    },
    basketball: [
      "Starting PG-level ballhandler",
      "Shoot 40% from 3",
      "Dynamic contested shooter off catch & dribble",
    ],
  },
  habits: [
    { label: "40 min exercise",   icon: "🏃" },
    { label: "15 min sunlight",   icon: "☀️" },
    { label: "5 min meditation",  icon: "🧘" },
    { label: "10 min Kegel/core", icon: "💪" },
  ],
  schedule: {
    Monday:    { loc: "The Edge SB",     focus: "Upper Body",        blocks: { "6–7:30am": ["Dynamic stretch / Chi Gong", "Short workout", "Breakfast & sunlight"], "7:30am–5:30pm": ["Pushups & core between meetings", "Eat snacks", "Lunch 12–12:30"], "5:30–8pm": ["Full upper body (Chest · Back · Shoulders · Arms · Traps)", "Dinner"] } },
    Tuesday:   { loc: "The Edge Essex",  focus: "Basketball & Legs", blocks: { "6–7:30am": ["Dynamic stretch / Chi Gong", "Short workout", "Breakfast & sunlight"], "7:30am–5:30pm": ["Pushups & core between meetings", "Eat snacks", "Lunch 12–12:30"], "5:30–8pm": ["Basketball (Shooting · Handles · Jumps)", "Legs (Quads · Hamstrings · Calves · Tibialis)", "Dinner"] } },
    Wednesday: { loc: "Home",            focus: "Light Strength",    blocks: { "6–7:30am": ["Dynamic stretch / Chi Gong", "Short workout", "Breakfast & sunlight"], "7:30am–5:30pm": ["Pushups & core between meetings", "Eat snacks", "Lunch 12–12:30"], "5:30–8pm": ["Home workout (Bands · Yoga · Plyo · Bodyweight)", "Dinner"] } },
    Thursday:  { loc: "Running Path",    focus: "Cardio & Full Body",blocks: { "6–7:30am": ["Dynamic stretch / Chi Gong", "Short workout", "Breakfast & sunlight"], "7:30am–5:30pm": ["Pushups & core between meetings", "Eat snacks", "Lunch 12–12:30"], "5:30–8pm": ["Run (cardio)", "Full body workout", "Dinner"] } },
    Friday:    { loc: "The Edge SB",     focus: "Full Body",         blocks: { "6–7:30am": ["Dynamic stretch / Chi Gong", "Short workout", "Breakfast & sunlight"], "7:30am–5:30pm": ["Pushups & core between meetings", "Eat snacks", "Lunch 12–12:30"], "5:30–8pm": ["Full body workout", "Dinner"] } },
    Saturday:  { loc: "The Edge Essex",  focus: "Game Prep",         blocks: { "Daytime": ["Full workout (game prep & maintenance)", "Shooting · Handles · Skill moves · Jumping"] } },
    Sunday:    { loc: "Burlington HS",   focus: "League Game Day",   blocks: { "Game time": ["Men's League Basketball Game 🏀"] } },
  },
  foods: [
    { name: "Grilled Chicken", g: "150g",    protein: 40, cal: 220, color: "#E8532A" },
    { name: "Sirloin Beef",    g: "150g",    protein: 35, cal: 290, color: "#C94B22" },
    { name: "Shrimp",          g: "150g",    protein: 28, cal: 180, color: "#E8532A" },
    { name: "Protein Shake",   g: "1 scoop", protein: 30, cal: 210, color: "#5B8AF0" },
    { name: "Peanut Butter",   g: "2 tbsp",  protein: 8,  cal: 190, color: "#B8861A" },
    { name: "Sweet Potato",    g: "1 medium",protein: 2,  cal: 160, color: "#D4721A" },
    { name: "Rice Bowl",       g: "1 cup",   protein: 4,  cal: 200, color: "#7A9A5A" },
    { name: "Broccoli",        g: "1 cup",   protein: 3,  cal: 55,  color: "#4A8A3A" },
    { name: "Banana",          g: "1 large", protein: 1,  cal: 105, color: "#D4B218" },
    { name: "Watermelon",      g: "2 cups",  protein: 1,  cal: 85,  color: "#D63B5A" },
    { name: "Body Armour",     g: "1 bottle",protein: 0,  cal: 90,  color: "#5B8AF0" },
  ],
};

const DAYS  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DABBR = { Sunday:"SUN", Monday:"MON", Tuesday:"TUE", Wednesday:"WED", Thursday:"THU", Friday:"FRI", Saturday:"SAT" };

const TABS = [
  { id:"today", label:"Today", icon: iconDunk    },
  { id:"fuel",  label:"Fuel",  icon: iconWeights },
  { id:"burn",  label:"Burn",  icon: iconCardio  },
  { id:"timer", label:"Timer", icon: iconHeat    },
  { id:"goals", label:"Goals", icon: iconBall    },
];

// ── Design tokens ─────────────────────────────────────────────────────
const P = {
  bg:      "#F2EFE9",
  surface: "#FFFFFF",
  sf2:     "#ECEAE4",
  border:  "rgba(0,0,0,0.07)",
  text:    "#1A1814",
  muted:   "#8A8780",
  orange:  "#E8532A",
  blue:    "#3A6FE8",
  green:   "#3DAA6A",
  amber:   "#D4961A",
  red:     "#E84040",
};

// ── Components ────────────────────────────────────────────────────────

const Card = ({ children, style = {} }) => (
  <div style={{ background: P.surface, borderRadius: 24, padding: "20px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: `1px solid ${P.border}`, ...style }}>
    {children}
  </div>
);

const Label = ({ children, color = P.muted, style = {} }) => (
  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color, marginBottom: 4, ...style }}>{children}</div>
);

const Ring = ({ pct, size = 80, stroke = 8, color = P.orange, children }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(100, Math.max(0, pct)) / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={P.sf2} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
};

const Bar = ({ pct, color = P.orange, height = 6 }) => (
  <div style={{ width: "100%", height, background: P.sf2, borderRadius: 99, overflow: "hidden" }}>
    <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.4s ease" }} />
  </div>
);

const Btn = ({ onClick, children, bg = P.orange, color = "#fff", style = {} }) => (
  <button onClick={onClick} style={{ background: bg, color, border: "none", borderRadius: 99, padding: "13px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: "-0.01em", boxShadow: `0 3px 12px ${bg}44`, width: "100%", ...style }}>
    {children}
  </button>
);

const GhostBtn = ({ onClick, children, style = {} }) => (
  <button onClick={onClick} style={{ background: P.sf2, color: P.text, border: "none", borderRadius: 99, padding: "13px 20px", fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%", ...style }}>
    {children}
  </button>
);

const CheckItem = ({ label, checked, onToggle, accent = P.orange }) => (
  <div onClick={onToggle} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 16, background: checked ? `${accent}12` : P.sf2, cursor: "pointer", border: checked ? `1.5px solid ${accent}30` : "1.5px solid transparent", transition: "all 0.15s" }}>
    <div style={{ width: 22, height: 22, borderRadius: 7, background: checked ? accent : "transparent", border: checked ? "none" : `2px solid rgba(0,0,0,0.15)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
      {checked && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9.5L10 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
    <span style={{ fontSize: 14, fontWeight: checked ? 600 : 500, color: checked ? P.text : P.muted, flex: 1, lineHeight: 1.4 }}>{label}</span>
  </div>
);

const NInput = ({ value, onChange, placeholder, style = {} }) => (
  <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ background: P.sf2, border: "none", borderRadius: 14, padding: "13px 16px", fontSize: 15, fontWeight: 600, color: P.text, outline: "none", width: "100%", boxSizing: "border-box", ...style }} />
);

const TInput = ({ value, onChange, placeholder, style = {} }) => (
  <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ background: P.sf2, border: "none", borderRadius: 14, padding: "13px 16px", fontSize: 15, fontWeight: 500, color: P.text, outline: "none", width: "100%", boxSizing: "border-box", ...style }} />
);

// ── Main App ──────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]           = useState("today");
  const [day, setDay]           = useState("");
  const [today, setToday]       = useState("");
  const [checks, setChecks]     = useState({});
  const [weight, setWeight]     = useState(170);
  const [protein, setProtein]   = useState(0);
  const [cals, setCals]         = useState(0);
  const [burned, setBurned]     = useState(0);
  const [reps, setReps]         = useState(0);
  const [foods, setFoods]       = useState([]);
  const [sessions, setSessions] = useState([]);
  const [custP, setCustP]       = useState("");
  const [custC, setCustC]       = useState("");
  const [custAct, setCustAct]   = useState("");
  const [custBurn, setCustBurn] = useState("");
  const [secs, setSecs]         = useState(0);
  const [running, setRunning]   = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const d = DAYS[new Date().getDay()]; setToday(d); setDay(d);
    const w = localStorage.getItem("bhgs_w"); if (w) setWeight(+w);
  }, []);

  useEffect(() => {
    if (!day) return;
    const g = k => localStorage.getItem(`bhgs_${day}_${k}`);
    setChecks(g("c")  ? JSON.parse(g("c"))  : {});
    setProtein(g("p") ? +g("p")             : 0);
    setCals(g("k")    ? +g("k")             : 0);
    setBurned(g("b")  ? +g("b")             : 0);
    setReps(g("r")    ? +g("r")             : 0);
    setFoods(g("f")   ? JSON.parse(g("f"))  : []);
    setSessions(g("s")? JSON.parse(g("s"))  : []);
    setSecs(g("t")    ? +g("t")             : 0);
  }, [day]);

  const sv = (k, v) => day && localStorage.setItem(`bhgs_${day}_${k}`, typeof v === "object" ? JSON.stringify(v) : v);
  const addP = n => { const x = Math.max(0, protein + n); setProtein(x); sv("p", x); };
  const addC = n => { const x = Math.max(0, cals + n);   setCals(x);    sv("k", x); };
  const addB = n => { const x = Math.max(0, burned + n); setBurned(x);  sv("b", x); };
  const addR = n => { const x = Math.max(0, reps + n);   setReps(x);    sv("r", x); };
  const setCheck = (k, v) => { const u = {...checks,[k]:v}; setChecks(u); sv("c", u); };

  const startTimer = () => {
    if (running) return; setRunning(true);
    timerRef.current = setInterval(() => setSecs(s => { const n = s+1; sv("t", n); return n; }), 1000);
  };
  const pauseTimer = () => { clearInterval(timerRef.current); setRunning(false); };
  const resetTimer = () => { clearInterval(timerRef.current); setRunning(false); setSecs(0); sv("t", 0); };

  const fmtTime = s => {
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sc = s%60;
    return [h > 0 ? String(h).padStart(2,"0") : null, String(m).padStart(2,"0"), String(sc).padStart(2,"0")].filter(Boolean).join(":");
  };

  const logFood = food => {
    addP(food.protein); addC(food.cal);
    const e = { id: Date.now(), name: food.name, protein: food.protein, cal: food.cal, at: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) };
    const u = [e, ...foods]; setFoods(u); sv("f", u);
  };
  const removeFood = (id, p, c) => { const u = foods.filter(f=>f.id!==id); setFoods(u); sv("f",u); addP(-p); addC(-c); };

  const logSession = () => {
    if (!custAct.trim()) return;
    const b = +custBurn || 0; addB(b);
    const e = { id: Date.now(), name: custAct.trim(), burned: b, at: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) };
    const u = [e, ...sessions]; setSessions(u); sv("s", u); setCustAct(""); setCustBurn("");
  };
  const removeSession = (id, b) => { const u = sessions.filter(s=>s.id!==id); setSessions(u); sv("s",u); addB(-b); };

  const addCustomFood = () => {
    const p = +custP||0, c = +custC||0; if (!p && !c) return;
    logFood({ name: "Custom entry", g: "", protein: p, cal: c, color: P.muted });
    setCustP(""); setCustC("");
  };

  const resetDay = () => {
    if (!confirm(`Reset all ${day} stats?`)) return;
    setChecks({}); setProtein(0); setCals(0); setBurned(0); setReps(0);
    setFoods([]); setSessions([]); setSecs(0); setRunning(false); clearInterval(timerRef.current);
    ["c","p","k","b","r","f","s","t"].forEach(k => localStorage.removeItem(`bhgs_${day}_${k}`));
  };

  const sched      = C.schedule[day] || { loc: "Rest", focus: "Recovery", blocks: {} };
  const habitsDone = C.habits.filter((_,i) => checks[`h${i}`]).length;
  const protPct    = Math.min(100, (protein / 160) * 100);
  const timerPct   = Math.min(100, (secs / 2400) * 100);
  const net        = cals - burned;

  return (
    <div style={{ background: P.bg, minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif", paddingBottom: 110, WebkitFontSmoothing: "antialiased" }}>

      {/* ── HEADER ── */}
      <div style={{ padding: "52px 20px 0", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: P.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Athletic Constitution · 2026</div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: P.text, margin: 0, letterSpacing: "-0.8px", lineHeight: 1.1 }}>
              Ball Hard,<br /><span style={{ color: P.orange }}>Get Shredded</span>
            </h1>
          </div>
          <div style={{ background: P.surface, borderRadius: 20, padding: "10px 16px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: `1px solid ${P.border}`, minWidth: 70 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: P.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>Weight</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: P.orange, lineHeight: 1.15, letterSpacing: "-0.5px" }}>{weight}</div>
            <div style={{ fontSize: 10, color: P.muted }}>lbs</div>
          </div>
        </div>

        {/* Day strip */}
        <div style={{ display: "flex", gap: 6, marginTop: 22, marginBottom: 18, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
          {DAYS.map(d => {
            const sel = d === day, tod = d === today;
            return (
              <button key={d} onClick={() => setDay(d)} style={{ flexShrink: 0, padding: "9px 13px", borderRadius: 14, background: sel ? P.orange : P.surface, border: "none", cursor: "pointer", boxShadow: sel ? `0 4px 14px ${P.orange}44` : "0 1px 5px rgba(0,0,0,0.06)", transition: "all 0.15s" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: sel ? "rgba(255,255,255,0.8)" : P.muted, textTransform: "uppercase" }}>{DABBR[d]}</div>
                {tod && <div style={{ width: 4, height: 4, borderRadius: "50%", background: sel ? "rgba(255,255,255,0.9)" : P.orange, margin: "4px auto 0" }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FOCUS BANNER ── */}
      <div style={{ padding: "0 20px 20px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ background: P.text, borderRadius: 20, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>{day}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" }}>{sched.focus}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>📍</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{sched.loc}</div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: "0 20px", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* ════ TODAY ═════════════════════════════════════════════════ */}
        {tab === "today" && (<>

          {/* Stats trio */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Habits",  val: `${habitsDone}/4`, color: P.blue,   pct: (habitsDone/4)*100 },
              { label: "Protein", val: `${protein}g`,     color: P.orange, pct: protPct },
              { label: "Net cal", val: net > 0 ? `+${net}` : String(net), color: net <= 0 ? P.green : P.muted, pct: null },
            ].map(s => (
              <Card key={s.label} style={{ padding: "14px 12px" }}>
                <Label>{s.label}</Label>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color, letterSpacing: "-0.5px", lineHeight: 1.1, marginBottom: s.pct !== null ? 8 : 0 }}>{s.val}</div>
                {s.pct !== null && <Bar pct={s.pct} color={s.color} height={4} />}
              </Card>
            ))}
          </div>

          {/* Habits */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <Label style={{ marginBottom: 0 }}>Daily non-negotiables</Label>
              <Ring pct={(habitsDone/4)*100} size={42} stroke={4} color={P.blue}>
                <span style={{ fontSize: 11, fontWeight: 800, color: P.text }}>{habitsDone}</span>
              </Ring>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {C.habits.map((h, i) => {
                const k = `h${i}`, done = !!checks[k];
                return <CheckItem key={k} label={`${h.icon}  ${h.label}`} checked={done} onToggle={() => setCheck(k, !done)} accent={P.blue} />;
              })}
            </div>
          </Card>

          {/* Schedule */}
          <Card>
            <Label style={{ marginBottom: 14 }}>Game plan</Label>
            {Object.entries(sched.blocks).map(([blk, tasks]) => (
              <div key={blk} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: P.muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8, paddingLeft: 2 }}>{blk}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {tasks.map((t, idx) => {
                    const k = `blk_${blk}_${idx}`, done = !!checks[k];
                    return <CheckItem key={k} label={t} checked={done} onToggle={() => setCheck(k, !done)} accent={P.orange} />;
                  })}
                </div>
              </div>
            ))}
          </Card>

          {/* Rep counter */}
          <Card>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <Label>Rep counter</Label>
                <div style={{ fontSize: 11, color: P.muted }}>Between meetings</div>
              </div>
              <Ring pct={Math.min(100, (reps/100)*100)} size={56} stroke={5} color={P.orange}>
                <span style={{ fontSize: 14, fontWeight: 800, color: P.text }}>{reps}</span>
              </Ring>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
              <GhostBtn onClick={() => addR(-5)} style={{ padding: "11px 4px", fontSize: 14 }}>−5</GhostBtn>
              <GhostBtn onClick={() => addR(-1)} style={{ padding: "11px 4px", fontSize: 14 }}>−1</GhostBtn>
              <Btn onClick={() => addR(1)}  style={{ padding: "11px 4px", fontSize: 14 }}>+1</Btn>
              <Btn onClick={() => addR(5)}  style={{ padding: "11px 4px", fontSize: 14 }}>+5</Btn>
            </div>
          </Card>

          {/* Weight */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <Label>Weight tracker</Label>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 38, fontWeight: 800, color: P.text, letterSpacing: "-1px", lineHeight: 1 }}>{weight}</span>
                  <span style={{ fontSize: 16, color: P.muted, fontWeight: 600 }}>lbs</span>
                </div>
                <div style={{ fontSize: 13, color: P.green, fontWeight: 600, marginTop: 2 }}>{(weight - 160).toFixed(1)} lbs to goal</div>
              </div>
              <Ring pct={Math.min(100, ((175 - weight) / 15) * 100)} size={68} stroke={7} color={P.green}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: P.green, lineHeight: 1 }}>160</div>
                  <div style={{ fontSize: 9, color: P.muted }}>goal</div>
                </div>
              </Ring>
            </div>
            <input type="range" min="155" max="180" step="0.5" value={weight}
              onChange={e => { const v = +parseFloat(e.target.value).toFixed(1); setWeight(v); localStorage.setItem("bhgs_w", v); }}
              style={{ width: "100%", accentColor: P.green, cursor: "pointer" }} />
          </Card>

          <button onClick={resetDay} style={{ background: "none", border: `1.5px dashed ${P.border}`, borderRadius: 14, padding: "12px", color: P.muted, fontSize: 13, fontWeight: 500, cursor: "pointer", width: "100%" }}>
            Reset {day} stats
          </button>
        </>)}

        {/* ════ FUEL ══════════════════════════════════════════════════ */}
        {tab === "fuel" && (<>

          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <Label>Daily protein</Label>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 52, fontWeight: 800, color: P.orange, letterSpacing: "-2px", lineHeight: 1 }}>{protein}</span>
                  <span style={{ fontSize: 20, color: P.muted, fontWeight: 600 }}>g</span>
                </div>
                <div style={{ fontSize: 13, color: P.muted, marginTop: 2 }}>Goal: 160g · {Math.round(protPct)}% complete</div>
              </div>
              <Ring pct={protPct} size={90} stroke={9} color={P.orange}>
                <span style={{ fontSize: 18, fontWeight: 800, color: P.text }}>{Math.round(protPct)}%</span>
              </Ring>
            </div>
            <Bar pct={protPct} color={P.orange} height={8} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12, color: P.muted, fontWeight: 500 }}>
              <span>🍽 {cals} kcal in</span>
              <span>🔥 {burned} burned</span>
              <span style={{ color: net <= 0 ? P.green : P.muted, fontWeight: 600 }}>Net {net > 0 ? `+${net}` : net}</span>
            </div>
          </Card>

          {/* Food chips horizontal scroll */}
          <Card style={{ padding: "18px 20px" }}>
            <Label style={{ marginBottom: 12 }}>Quick log</Label>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none", marginLeft: -4, paddingLeft: 4 }}>
              {C.foods.map(f => (
                <button key={f.name} onClick={() => logFood(f)}
                  style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "12px 14px", borderRadius: 18, background: P.sf2, border: "none", cursor: "pointer", textAlign: "left", minWidth: 120, transition: "transform 0.1s", WebkitTapHighlightColor: "transparent" }}
                  onMouseDown={e => e.currentTarget.style.transform = "scale(0.96)"}
                  onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: P.text, marginBottom: 3, lineHeight: 1.3 }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: P.muted, marginBottom: 8 }}>{f.g}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: f.color, background: `${f.color}18`, padding: "2px 8px", borderRadius: 99 }}>+{f.protein}g</span>
                    <span style={{ fontSize: 11, color: P.muted }}>{f.cal} kcal</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Custom entry */}
          <Card>
            <Label style={{ marginBottom: 12 }}>Custom entry</Label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <NInput value={custP} onChange={setCustP} placeholder="Protein (g)" />
              <NInput value={custC} onChange={setCustC} placeholder="Calories" />
            </div>
            <Btn onClick={addCustomFood}>Log entry</Btn>
          </Card>

          {/* Log */}
          {foods.length > 0 && (
            <Card>
              <Label style={{ marginBottom: 12 }}>Logged today</Label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {foods.map(f => (
                  <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: P.sf2, borderRadius: 14 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: P.text }}>{f.name}</div>
                      <div style={{ fontSize: 11, color: P.muted }}>{f.at}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: P.orange }}>{f.protein}g</span>
                    <span style={{ fontSize: 12, color: P.muted }}>{f.cal} kcal</span>
                    <button onClick={() => removeFood(f.id, f.protein, f.cal)} style={{ background: "none", border: "none", color: P.muted, fontSize: 20, cursor: "pointer", lineHeight: 1, padding: "0 2px" }}>×</button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>)}

        {/* ════ BURN ══════════════════════════════════════════════════ */}
        {tab === "burn" && (<>

          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Label>Calories burned</Label>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 52, fontWeight: 800, color: P.red, letterSpacing: "-2px", lineHeight: 1 }}>{burned}</span>
                  <span style={{ fontSize: 18, color: P.muted, fontWeight: 600 }}>kcal</span>
                </div>
                <div style={{ fontSize: 13, color: P.muted, marginTop: 2 }}>Net: <span style={{ color: net <= 0 ? P.green : P.muted, fontWeight: 600 }}>{net > 0 ? `+${net}` : net} kcal</span></div>
              </div>
              <Ring pct={Math.min(100, (burned / 600) * 100)} size={90} stroke={9} color={P.red}>
                <span style={{ fontSize: 16, fontWeight: 800, color: P.text }}>{Math.round((burned/600)*100)}%</span>
              </Ring>
            </div>
          </Card>

          <Card>
            <Label style={{ marginBottom: 12 }}>Log session</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
              <TInput value={custAct} onChange={setCustAct} placeholder="Activity (e.g. full body workout)" />
              <NInput value={custBurn} onChange={setCustBurn} placeholder="Kcal burned (estimate)" />
            </div>
            <Btn onClick={logSession} bg={P.red}>Log burn</Btn>
          </Card>

          {sessions.length > 0 && (
            <Card>
              <Label style={{ marginBottom: 12 }}>Sessions today</Label>
              {sessions.map(s => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: P.sf2, borderRadius: 14, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: P.text }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: P.muted }}>{s.at}</div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: P.red }}>{s.burned} kcal</span>
                  <button onClick={() => removeSession(s.id, s.burned)} style={{ background: "none", border: "none", color: P.muted, fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>
                </div>
              ))}
            </Card>
          )}
        </>)}

        {/* ════ TIMER ═════════════════════════════════════════════════ */}
        {tab === "timer" && (<>

          <Card style={{ padding: "32px 24px", textAlign: "center" }}>
            <Label style={{ textAlign: "center", marginBottom: 20 }}>Workout timer · goal 40 min</Label>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
              <Ring pct={timerPct} size={190} stroke={14} color={secs >= 2400 ? P.green : running ? P.orange : P.muted}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 40, fontWeight: 800, color: P.text, letterSpacing: "-1.5px", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{fmtTime(secs)}</div>
                  <div style={{ fontSize: 12, color: P.muted, marginTop: 5, fontWeight: 500 }}>
                    {secs >= 2400 ? "✓ Goal reached!" : `${Math.round(timerPct)}% of 40 min`}
                  </div>
                </div>
              </Ring>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Btn onClick={running ? pauseTimer : startTimer} bg={running ? P.amber : P.orange} style={{ padding: "16px", fontSize: 16 }}>
                {running ? "⏸  Pause" : "▶  Start"}
              </Btn>
              <GhostBtn onClick={resetTimer} style={{ padding: "16px", fontSize: 16 }}>Reset</GhostBtn>
            </div>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Protein", val: `${protein}g`, color: P.orange },
              { label: "Burned",  val: `${burned}`,   color: P.red },
              { label: "Reps",    val: reps,          color: P.blue },
            ].map(s => (
              <Card key={s.label} style={{ padding: "14px 12px", textAlign: "center" }}>
                <Label style={{ textAlign: "center" }}>{s.label}</Label>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: "-0.5px" }}>{s.val}</div>
              </Card>
            ))}
          </div>

          <Card>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <Label style={{ marginBottom: 0 }}>Reps</Label>
              <span style={{ fontSize: 26, fontWeight: 800, color: P.text, letterSpacing: "-0.5px" }}>{reps}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <GhostBtn onClick={() => addR(-5)}>−5</GhostBtn>
              <Btn onClick={() => addR(5)}>+5</Btn>
            </div>
          </Card>
        </>)}

        {/* ════ GOALS ═════════════════════════════════════════════════ */}
        {tab === "goals" && (<>

          <Card>
            <Label style={{ marginBottom: 12 }}>Body targets</Label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
              {[
                { label: "Target weight", val: "160 lbs", color: P.green },
                { label: "Body fat goal", val: "15%",     color: P.blue },
              ].map(s => (
                <div key={s.label} style={{ background: P.sf2, borderRadius: 18, padding: "16px" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: P.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: "-0.5px" }}>{s.val}</div>
                </div>
              ))}
            </div>
            <Label style={{ marginBottom: 10 }}>Aesthetics</Label>
            {C.goals.body.aesthetic.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: i < C.goals.body.aesthetic.length - 1 ? `1px solid ${P.border}` : "none" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: P.orange, flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: P.text }}>{a}</span>
              </div>
            ))}
          </Card>

          <Card>
            <Label style={{ marginBottom: 14 }}>🏀 Basketball playbook</Label>
            {C.goals.basketball.map((g, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 0", borderBottom: i < C.goals.basketball.length - 1 ? `1px solid ${P.border}` : "none" }}>
                <div style={{ width: 30, height: 30, borderRadius: 10, background: `${P.orange}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: P.orange }}>0{i+1}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: P.text, lineHeight: 1.5, paddingTop: 6 }}>{g}</span>
              </div>
            ))}
          </Card>

          <Card>
            <Label style={{ marginBottom: 12 }}>Foundation & structure</Label>
            {C.goals.body.foundation.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "13px 14px", background: P.sf2, borderRadius: 16, marginBottom: i < C.goals.body.foundation.length - 1 ? 8 : 0 }}>
                <span style={{ fontSize: 16 }}>🦵</span>
                <span style={{ fontSize: 14, color: P.text, fontWeight: 500, lineHeight: 1.5 }}>{f}</span>
              </div>
            ))}
          </Card>
        </>)}

      </div>

      {/* ── BOTTOM NAV ── */}
      <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(242,239,233,0.94)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderTop: `1px solid ${P.border}`, padding: "10px 10px 30px", zIndex: 50 }}>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: active ? `${P.orange}18` : "none", border: "none", cursor: "pointer", padding: "8px 14px", borderRadius: 16, transition: "all 0.15s" }}>
                <img src={t.icon} alt={t.label} style={{ width: 26, height: 26, objectFit: "contain", opacity: active ? 1 : 0.3, filter: active ? `saturate(1.2)` : "grayscale(80%)", transition: "all 0.15s" }} />
                <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? P.orange : P.muted, letterSpacing: "0.02em" }}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}