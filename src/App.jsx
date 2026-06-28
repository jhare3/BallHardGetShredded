import React, { useState, useEffect, useRef } from 'react';

/* ─── GOOGLE FONTS (Orbitron for data numerals, Inter for body) ─────────────── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@600;700;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #111318; }
    
    /* Glassy pill button */
    .pill-btn {
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      font-size: 13px;
      border: none;
      cursor: pointer;
      border-radius: 999px;
      padding: 10px 22px;
      transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
      letter-spacing: 0.01em;
    }
    .pill-btn:active { transform: scale(0.96); }

    /* Glass card */
    .glass-card {
      background: linear-gradient(145deg, #1e2130 0%, #181b26 100%);
      border: 1px solid rgba(255,255,255,0.07);
      border-top: 1px solid rgba(255,255,255,0.13);
      border-radius: 20px;
      box-shadow: 
        0 1px 0 rgba(255,255,255,0.08) inset,
        0 -1px 0 rgba(0,0,0,0.4) inset,
        0 8px 32px rgba(0,0,0,0.35);
    }

    /* Instrument card (image 2 style) */
    .instrument-card {
      background: linear-gradient(160deg, #1c1f2e 0%, #161820 100%);
      border: 1px solid rgba(255,255,255,0.06);
      border-top: 1px solid rgba(255,255,255,0.11);
      border-radius: 18px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.06) inset;
    }

    /* Active tab pill (image 1 inflated glass) */
    .tab-active {
      background: linear-gradient(160deg, #6b8fd4 0%, #4a6fb5 100%);
      box-shadow: 
        0 2px 0 rgba(255,255,255,0.25) inset,
        0 -2px 0 rgba(0,0,0,0.2) inset,
        0 6px 20px rgba(107,143,212,0.4);
      color: #fff;
    }
    .tab-inactive {
      background: linear-gradient(160deg, #1e2130 0%, #181b26 100%);
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 1px 0 rgba(255,255,255,0.06) inset, 0 3px 10px rgba(0,0,0,0.25);
      color: #5a6080;
    }
    .tab-inactive:hover { color: #8892b0; }

    /* Food / exercise chip (image 1 button style) */
    .chip {
      background: linear-gradient(160deg, #1e2130 0%, #181b26 100%);
      border: 1px solid rgba(255,255,255,0.07);
      border-top: 1px solid rgba(255,255,255,0.11);
      border-radius: 12px;
      padding: 8px 14px;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      color: #8892b0;
      box-shadow: 0 1px 0 rgba(255,255,255,0.05) inset, 0 3px 10px rgba(0,0,0,0.25);
      transition: all 0.15s;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .chip:hover {
      border-color: rgba(107,143,212,0.5);
      color: #e2e4ed;
      transform: translateY(-1px);
      box-shadow: 0 1px 0 rgba(255,255,255,0.08) inset, 0 6px 18px rgba(0,0,0,0.3);
    }
    .chip:active { transform: translateY(0px) scale(0.97); }

    /* Toggle switch (image 1) */
    .toggle-track {
      width: 48px; height: 28px; border-radius: 999px; position: relative; cursor: pointer;
      transition: background 0.2s;
      box-shadow: 0 1px 0 rgba(255,255,255,0.08) inset, 0 2px 8px rgba(0,0,0,0.3);
    }
    .toggle-thumb {
      position: absolute; top: 3px; width: 22px; height: 22px; border-radius: 999px;
      background: linear-gradient(160deg, #fff 0%, #dde2f0 100%);
      box-shadow: 0 2px 8px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.5) inset;
      transition: left 0.2s cubic-bezier(0.34,1.56,0.64,1);
    }

    /* Input field (image 1 search bar style) */
    .glass-input {
      background: linear-gradient(160deg, #151720 0%, #1a1d2a 100%);
      border: 1px solid rgba(255,255,255,0.07);
      border-top: 1px solid rgba(255,255,255,0.04);
      border-radius: 12px;
      padding: 10px 14px;
      color: #e2e4ed;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      width: 100%;
      outline: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25) inset;
      transition: border-color 0.15s;
    }
    .glass-input:focus { border-color: rgba(107,143,212,0.5); }
    .glass-input::placeholder { color: #3a4060; }

    /* Range slider */
    input[type=range] { -webkit-appearance: none; width: 100%; height: 6px; background: #1e2130; border-radius: 99px; outline: none; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 99px; background: linear-gradient(160deg, #6b8fd4, #4a6fb5); box-shadow: 0 2px 8px rgba(107,143,212,0.5), 0 1px 0 rgba(255,255,255,0.3) inset; cursor: pointer; }

    /* Log row */
    .log-row {
      display: flex; align-items: center; gap: 12px; padding: 10px 14px;
      background: linear-gradient(160deg, #151720 0%, #131620 100%);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 12px; transition: border-color 0.15s;
    }
    .log-row:hover { border-color: rgba(255,255,255,0.1); }

    /* Progress bar track */
    .prog-track { height: 5px; background: #1e2130; border-radius: 99px; overflow: hidden; }
    .prog-fill { height: 100%; border-radius: 99px; transition: width 0.4s cubic-bezier(0.34,1.2,0.64,1); }

    /* Hero gradient strip (image 3) */
    .hero-strip {
      background: linear-gradient(135deg, #2a1f3d 0%, #1a2a4a 40%, #1a3a2a 100%);
      border-radius: 20px 20px 0 0;
      position: relative; overflow: hidden;
    }
    .hero-strip::before {
      content: '';
      position: absolute; inset: 0;
      background: radial-gradient(ellipse 80% 60% at 50% 120%, rgba(107,143,212,0.25) 0%, transparent 60%),
                  radial-gradient(ellipse 60% 40% at 80% 0%, rgba(170,80,255,0.15) 0%, transparent 50%);
    }

    /* Habit item */
    .habit-item {
      display: flex; align-items: center; gap: 14px; padding: 14px 18px;
      background: linear-gradient(160deg, #1e2130 0%, #181b26 100%);
      border: 1px solid rgba(255,255,255,0.07);
      border-top: 1px solid rgba(255,255,255,0.11);
      border-radius: 16px;
      cursor: pointer;
      box-shadow: 0 1px 0 rgba(255,255,255,0.05) inset, 0 3px 12px rgba(0,0,0,0.2);
      transition: all 0.2s;
    }
    .habit-item:hover { border-color: rgba(107,143,212,0.3); transform: translateY(-1px); }
    .habit-item:active { transform: translateY(0); }

    /* Checkbox */
    .check-box {
      width: 24px; height: 24px; border-radius: 8px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #2a2d40; border-radius: 99px; }

    @media (max-width: 600px) {
      .tab-label { display: none; }
    }
  `}</style>
);

/* ─── CONSTITUTION DATA ──────────────────────────────────────────────────────── */
const C = {
  workouts: {
    "Upper Body": {
      icon: "💪", color: "#7B9FD4", burn: 260, category: "upperBody",
      groups: {
        Chest: ["Dumbbell inclined bench", "Flys"],
        Back: ["Dumbbell row", "Row machine"],
        Shoulders: ["Shoulder press", "Side arm raises"],
        Biceps: ["Curls", "Plate curls"],
        Triceps: ["Kick backs", "Dips", "Pull overs"],
        Traps: ["Shrugs"],
      }
    },
    "Lower Body": {
      icon: "🦵", color: "#F0A060", burn: 320, category: "lowerBody",
      groups: {
        Quads: ["Barbell squats", "Dumbbell squats", "Kettlebell deep squat", "Wall sits", "Isometric lunge"],
        Hamstrings: ["RDL", "Kettlebell RDL", "Deadlift", "Glute bridge"],
        Calves: ["Calf raises", "Calf machine", "Isometric holds"],
        Tibialis: ["Tibialis wall raises", "Kettlebell toe raises"],
        Feet: ["Toe bands", "Yoga block balance", "Balance ball", "Sidekick board"],
      }
    },
    "Core": {
      icon: "🔥", color: "#E05C5C", burn: 150, category: "core",
      groups: { Core: ["Crunch routine", "Kegel/core routine (The Coach App)"] }
    },
    "Cardio": {
      icon: "🏃", color: "#5CB88A", burn: 420, category: "cardio",
      groups: { Cardio: ["Bike", "Run", "Stair master", "Elliptical", "Jump rope", "Basketball"] }
    },
    "Basketball": {
      icon: "🏀", color: "#7B9FD4", burn: 500, category: "basketball",
      groups: { Basketball: ["Shooting", "Ball handling", "Skill moves", "Jumping"] }
    },
  },
  diet: {
    "Protein": {
      icon: "🥩", color: "#7B9FD4",
      items: [
        { name: "Chicken", cal: 220, pro: 40 }, { name: "Eggs (2)", cal: 140, pro: 12 },
        { name: "Beef (150g)", cal: 290, pro: 35 }, { name: "Shrimp", cal: 180, pro: 28 },
        { name: "Tofu", cal: 150, pro: 18 }, { name: "Peanut Butter", cal: 190, pro: 8 },
        { name: "Chicken Sausage", cal: 170, pro: 22 }, { name: "Mixed Nuts", cal: 180, pro: 5 },
        { name: "Protein Bar", cal: 210, pro: 20 }, { name: "Protein Shake", cal: 160, pro: 30 },
      ]
    },
    "Fiber": {
      icon: "🥬", color: "#5CB88A",
      items: [
        { name: "Watermelon", cal: 85, pro: 1 }, { name: "Banana", cal: 105, pro: 1 },
        { name: "Sautéed Spinach", cal: 40, pro: 3 }, { name: "Sweet Potato", cal: 130, pro: 2 },
        { name: "Frozen Fruit", cal: 80, pro: 1 }, { name: "Psyllium Shake", cal: 30, pro: 0 },
      ]
    },
    "Carbs": {
      icon: "🍚", color: "#F0A060",
      items: [
        { name: "Rice (1 cup)", cal: 200, pro: 4 }, { name: "Hash Brown", cal: 150, pro: 2 },
        { name: "GF Pasta", cal: 210, pro: 4 }, { name: "Broccoli", cal: 55, pro: 4 },
        { name: "Corn Tortilla (2)", cal: 110, pro: 3 },
      ]
    },
    "Electrolytes": {
      icon: "⚡", color: "#A070D0",
      items: [
        { name: "Body Armour", cal: 90, pro: 0 }, { name: "Water + Lemon & Salt", cal: 10, pro: 0 },
      ]
    },
    "Supplements": {
      icon: "💊", color: "#8892b0",
      items: [
        { name: "Magnesium", cal: 0, pro: 0 }, { name: "Creatine", cal: 0, pro: 0 }, { name: "B12", cal: 0, pro: 0 },
      ]
    },
    "Treats": {
      icon: "🍕", color: "#E05C5C",
      items: [
        { name: "Pad Thai", cal: 600, pro: 20 }, { name: "Chicken Tikka", cal: 520, pro: 35 },
        { name: "Ice Cream", cal: 300, pro: 4 }, { name: "Cookies (2)", cal: 200, pro: 3 },
        { name: "Burger", cal: 650, pro: 35 }, { name: "Pizza (2sl)", cal: 560, pro: 22 },
      ]
    },
  },
  habits: [
    { id: "exercise", label: "40 min of exercise", icon: "🏋️" },
    { id: "sunlight", label: "15 min outside / sunlight", icon: "☀️" },
    { id: "meditation", label: "5 min meditation (Headspace)", icon: "🧘" },
    { id: "kegel", label: "10 min Kegel/core (The Coach)", icon: "🔥" },
    { id: "creatine", label: "Daily Creatine", icon: "💊" },
    { id: "vitamins", label: "Daily Vitamins (B12, Magnesium)", icon: "💊" },
    { id: "electrolytes", label: "Daily Electrolytes", icon: "⚡" },
    { id: "protein_goal", label: "Hit 160g protein goal", icon: "🥩" },
    { id: "calories", label: "Log all meals today", icon: "🍽️" },
  ],
};

const todayKey = () => new Date().toISOString().slice(0, 10);
const load = (k, fb) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : fb; } catch { return fb; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const fmt = (s) => { const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60; return [h>0?String(h).padStart(2,'0'):null,String(m).padStart(2,'0'),String(sec).padStart(2,'0')].filter(Boolean).join(':'); };

/* ─── ROOT APP ───────────────────────────────────────────────────────────────── */
export default function App() {
  const dk = todayKey();
  const [tab, setTab] = useState("Workout");

  const [foodLog, setFoodLog] = useState(() => load(`bhgs_food_${dk}`, []));
  const [customFood, setCustomFood] = useState({ name: "", cal: "", pro: "" });

  const [workoutLog, setWorkoutLog] = useState(() => load(`bhgs_workout_${dk}`, []));
  const [timerSec, setTimerSec] = useState(() => load(`bhgs_timer_${dk}`, 0));
  const [timerOn, setTimerOn] = useState(false);
  const [pushups, setPushups] = useState(() => load(`bhgs_pushups_${dk}`, 0));
  const timerRef = useRef(null);

  const [habits, setHabits] = useState(() => load(`bhgs_habits_${dk}`, {}));
  const [weight, setWeight] = useState(() => load("bhgs_weight", 170));
  const [weightInput, setWeightInput] = useState("");

  useEffect(() => { save(`bhgs_food_${dk}`, foodLog); }, [foodLog]);
  useEffect(() => { save(`bhgs_workout_${dk}`, workoutLog); }, [workoutLog]);
  useEffect(() => { save(`bhgs_timer_${dk}`, timerSec); }, [timerSec]);
  useEffect(() => { save(`bhgs_pushups_${dk}`, pushups); }, [pushups]);
  useEffect(() => { save(`bhgs_habits_${dk}`, habits); }, [habits]);
  useEffect(() => { save("bhgs_weight", weight); }, [weight]);

  useEffect(() => {
    if (timerOn) timerRef.current = setInterval(() => setTimerSec(s => s + 1), 1000);
    else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [timerOn]);

  const totalCal = foodLog.reduce((a, f) => a + (f.cal || 0), 0);
  const totalPro = foodLog.reduce((a, f) => a + (f.pro || 0), 0);
  const calBurned = workoutLog.reduce((a, w) => a + (w.burned || 0), 0);
  const netCal = totalCal - calBurned;
  const habitsDone = Object.values(habits).filter(Boolean).length;

  const logFood = (item) => setFoodLog(p => [...p, { ...item, id: Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  const removeFood = (id) => setFoodLog(p => p.filter(f => f.id !== id));
  const addCustom = () => {
    if (!customFood.name) return;
    logFood({ name: customFood.name, cal: parseInt(customFood.cal)||0, pro: parseInt(customFood.pro)||0 });
    setCustomFood({ name: "", cal: "", pro: "" });
  };
  const logWorkout = (name, color, burn) => setWorkoutLog(p => [...p, { id: Date.now(), name, burned: burn, color, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  const removeWorkout = (id) => setWorkoutLog(p => p.filter(w => w.id !== id));
  const toggleHabit = (id) => setHabits(p => ({ ...p, [id]: !p[id] }));

  const TABS = [
    { id: "Workout", icon: "🏋️", label: "Workout" },
    { id: "Diet", icon: "🍗", label: "Diet" },
    { id: "Habits", icon: "✅", label: "Habits" },
    { id: "Goals", icon: "🎯", label: "Goals" },
  ];

  return (
    <div style={{ background: '#111318', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#e2e4ed', paddingBottom: 40 }}>
      <FontLoader />

      {/* ── HERO HEADER (image 3 gradient strip) ── */}
      <div className="hero-strip" style={{ padding: '28px 24px 0' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto' }}>
          {/* Identity */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #7B9FD4, #4a6fb5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 14px rgba(107,143,212,0.5), 0 1px 0 rgba(255,255,255,0.2) inset' }}>🏀</div>
              <div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: 13, letterSpacing: 3, color: '#fff' }}>BALL HARD <span style={{ color: '#7B9FD4' }}>GET SHREDDED</span></div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: 3, textTransform: 'uppercase', marginTop: 1 }}>Fitness Constitution</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
          </div>

          {/* Instrument panel stats (image 2 style) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
            {[
              { label: "NET CAL", value: `${netCal > 0 ? '+' : ''}${netCal}`, unit: "kcal", color: netCal > 2200 ? '#F0A060' : '#5CB88A' },
              { label: "PROTEIN", value: totalPro, unit: "g", color: totalPro >= 160 ? '#5CB88A' : '#7B9FD4' },
              { label: "BURNED", value: calBurned, unit: "cal", color: '#7B9FD4' },
              { label: "HABITS", value: `${habitsDone}/${C.habits.length}`, unit: "", color: habitsDone === C.habits.length ? '#5CB88A' : '#F0A060' },
            ].map(s => (
              <div key={s.label} className="instrument-card" style={{ padding: '12px 14px' }}>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 17, color: s.color, lineHeight: 1 }}>{s.value}<span style={{ fontSize: 9, fontWeight: 400, color: 'rgba(255,255,255,0.3)', marginLeft: 2 }}>{s.unit}</span></div>
              </div>
            ))}
          </div>

          {/* Tab bar — image 1 inflated pill style */}
          <div style={{ display: 'flex', gap: 6, paddingBottom: 20 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`pill-btn ${tab === t.id ? 'tab-active' : 'tab-inactive'}`}
                style={{ flex: 1, textAlign: 'center', fontSize: 12, padding: '10px 8px' }}>
                <span>{t.icon}</span> <span className="tab-label">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 24px 0' }}>

        {/* ════════════ WORKOUT ════════════ */}
        {tab === "Workout" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Timer + Pushups — two instrument cards side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {/* Timer */}
              <div className="glass-card" style={{ padding: 20 }}>
                <div style={{ fontSize: 9, color: '#7B9FD4', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Session Timer</div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 34, fontWeight: 900, color: timerSec >= 2400 ? '#5CB88A' : '#fff', letterSpacing: 2, marginBottom: 8 }}>{fmt(timerSec)}</div>
                <div className="prog-track" style={{ marginBottom: 14 }}>
                  <div className="prog-fill" style={{ width: `${Math.min(100,(timerSec/2400)*100)}%`, background: timerSec >= 2400 ? '#5CB88A' : '#7B9FD4' }} />
                </div>
                <div style={{ fontSize: 10, color: '#3a4060', marginBottom: 14 }}>
                  {timerSec >= 2400 ? '✓ 40 min target met' : `${Math.round((timerSec/2400)*100)}% of 40 min goal`}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="pill-btn" onClick={() => setTimerOn(!timerOn)}
                    style={{ flex: 1, background: timerOn ? 'linear-gradient(160deg,#e8a030,#c07020)' : 'linear-gradient(160deg,#6b8fd4,#4a6fb5)', color: '#fff', boxShadow: timerOn ? '0 4px 14px rgba(200,140,40,0.4)' : '0 4px 14px rgba(107,143,212,0.4), 0 1px 0 rgba(255,255,255,0.2) inset' }}>
                    {timerOn ? '⏸ Pause' : '▶ Start'}
                  </button>
                  <button className="pill-btn" onClick={() => { setTimerOn(false); setTimerSec(0); }}
                    style={{ background: 'linear-gradient(160deg,#1e2130,#181b26)', color: '#5a6080', border: '1px solid rgba(255,255,255,0.07)' }}>Reset</button>
                </div>
              </div>

              {/* Pushups */}
              <div className="glass-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <div style={{ fontSize: 9, color: '#7B9FD4', letterSpacing: 3, textTransform: 'uppercase', alignSelf: 'flex-start' }}>Pushups Today</div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 52, fontWeight: 900, color: '#7B9FD4', lineHeight: 1 }}>{pushups}</div>
                <div style={{ fontSize: 10, color: '#3a4060' }}>reps logged</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6, width: '100%', marginTop: 4 }}>
                  {[-10, -5, +5, +10].map(d => (
                    <button key={d} className="pill-btn" onClick={() => setPushups(p => Math.max(0,p+d))}
                      style={{ fontSize: 11, padding: '8px 0', background: d > 0 ? 'linear-gradient(160deg,#1e2d40,#182038)' : 'linear-gradient(160deg,#1e2130,#181b26)', color: d > 0 ? '#7B9FD4' : '#5a6080', border: `1px solid ${d>0?'rgba(123,159,212,0.2)':'rgba(255,255,255,0.06)'}` }}>
                      {d > 0 ? `+${d}` : d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calories burned summary */}
            {workoutLog.length > 0 && (
              <div className="instrument-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#5CB88A', fontWeight: 600 }}>🔥 {calBurned} calories burned</span>
                <span style={{ fontSize: 11, color: '#3a4060' }}>{workoutLog.length} set{workoutLog.length !== 1 ? 's' : ''} logged</span>
              </div>
            )}

            {/* Exercise library */}
            {Object.entries(C.workouts).map(([section, data]) => (
              <WorkoutSection key={section} section={section} data={data} onLog={logWorkout} />
            ))}

            {/* Log */}
            {workoutLog.length > 0 && (
              <GlassSection title="Today's Workout Log" accent="#7B9FD4">
                {[...workoutLog].reverse().map(w => (
                  <LogRow key={w.id} left={w.name} right={`~${w.burned} cal`} sub={w.time} onDelete={() => removeWorkout(w.id)} accent={w.color || '#7B9FD4'} />
                ))}
              </GlassSection>
            )}
          </div>
        )}

        {/* ════════════ DIET ════════════ */}
        {tab === "Diet" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Macro instrument row (image 2) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              <MacroInstrument label="Calories In" value={totalCal} target={2200} unit="kcal" color="#F0A060" />
              <MacroInstrument label="Protein" value={totalPro} target={160} unit="g" color="#7B9FD4" />
              <MacroInstrument label="Net Cal" value={netCal} target={null} unit="kcal" color={netCal <= 2200 ? '#5CB88A' : '#E05C5C'} note={`${calBurned} burned`} />
            </div>

            {/* Food sections */}
            {Object.entries(C.diet).map(([cat, data]) => (
              <FoodSection key={cat} cat={cat} data={data} onLog={logFood} />
            ))}

            {/* Custom entry */}
            <GlassSection title="Log Custom Food" accent="#5a6080">
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 10, alignItems: 'end' }}>
                <div>
                  <Label>Item name</Label>
                  <input className="glass-input" value={customFood.name} onChange={e => setCustomFood(p=>({...p,name:e.target.value}))} placeholder="e.g. Greek yogurt" />
                </div>
                <div>
                  <Label>Calories</Label>
                  <input className="glass-input" type="number" value={customFood.cal} onChange={e => setCustomFood(p=>({...p,cal:e.target.value}))} placeholder="200" />
                </div>
                <div>
                  <Label>Protein (g)</Label>
                  <input className="glass-input" type="number" value={customFood.pro} onChange={e => setCustomFood(p=>({...p,pro:e.target.value}))} placeholder="15" />
                </div>
                <PillBtn onClick={addCustom} color="#7B9FD4" glow="rgba(123,159,212,0.4)">Log</PillBtn>
              </div>
            </GlassSection>

            {foodLog.length > 0 && (
              <GlassSection title="Today's Food Log" accent="#7B9FD4">
                {[...foodLog].reverse().map(f => (
                  <LogRow key={f.id} left={f.name} right={`${f.cal} kcal · ${f.pro}g`} sub={f.time} onDelete={() => removeFood(f.id)} accent="#7B9FD4" />
                ))}
              </GlassSection>
            )}
          </div>
        )}

        {/* ════════════ HABITS ════════════ */}
        {tab === "Habits" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Progress header */}
            <div className="glass-card" style={{ padding: '20px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Daily Non-Negotiables</div>
                <div style={{ fontSize: 12, color: '#3a4060' }}>No excuses. Hit every one.</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 28, fontWeight: 900, color: habitsDone === C.habits.length ? '#5CB88A' : '#7B9FD4' }}>{habitsDone}<span style={{ fontSize: 14, color: '#3a4060' }}>/{C.habits.length}</span></div>
                <ProgBar value={habitsDone} max={C.habits.length} color={habitsDone === C.habits.length ? '#5CB88A' : '#7B9FD4'} width={80} />
              </div>
            </div>

            {C.habits.map(h => {
              const done = !!habits[h.id];
              return (
                <button key={h.id} className="habit-item" onClick={() => toggleHabit(h.id)}
                  style={{ border: `1px solid ${done ? 'rgba(92,184,138,0.3)' : 'rgba(255,255,255,0.07)'}`, background: done ? 'linear-gradient(160deg,#1a2e25,#141f1a)' : 'linear-gradient(160deg,#1e2130,#181b26)' }}>
                  <div className="check-box"
                    style={{ background: done ? 'linear-gradient(160deg,#5CB88A,#3a9060)' : 'linear-gradient(160deg,#1e2130,#181b26)', border: `2px solid ${done ? '#5CB88A' : 'rgba(255,255,255,0.1)'}`, boxShadow: done ? '0 2px 10px rgba(92,184,138,0.4)' : '0 1px 0 rgba(255,255,255,0.06) inset' }}>
                    {done && <span style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 20 }}>{h.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: done ? '#5a7060' : '#c0c8d8', textDecoration: done ? 'line-through' : 'none', flex: 1 }}>{h.label}</span>
                  {/* Toggle visual (image 1) */}
                  <div className="toggle-track" style={{ background: done ? 'linear-gradient(160deg,#3a7050,#2a5038)' : 'linear-gradient(160deg,#1a1d28,#131620)' }}>
                    <div className="toggle-thumb" style={{ left: done ? '23px' : '3px' }} />
                  </div>
                </button>
              );
            })}

            {/* Weekly targets */}
            <GlassSection title="Weekly Targets" accent="#7B9FD4">
              {["3 days/week each muscle group", "3 days/week cardio", "3 days/week basketball", "Balanced weekly diet"].map((t,i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i<3?'1px solid rgba(255,255,255,0.04)':'none' }}>
                  <span style={{ color: '#7B9FD4', fontSize: 10, marginTop: 3 }}>◆</span>
                  <span style={{ fontSize: 13, color: '#8892b0' }}>{t}</span>
                </div>
              ))}
            </GlassSection>
          </div>
        )}

        {/* ════════════ GOALS ════════════ */}
        {tab === "Goals" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Weight tracker (image 2 instrument panel) */}
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 9, color: '#7B9FD4', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Weight Tracker</div>
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 38, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{weight}<span style={{ fontSize: 14, color: '#3a4060', marginLeft: 4 }}>lbs</span></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="instrument-card" style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 8, color: '#3a4060', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>TO GO</div>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 18, fontWeight: 700, color: weight <= 160 ? '#5CB88A' : '#F0A060' }}>{Math.max(0, weight-160).toFixed(1)}</div>
                  </div>
                  <div className="instrument-card" style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 8, color: '#3a4060', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>TARGET BF</div>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 18, fontWeight: 700, color: '#A070D0' }}>15%</div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#3a4060', marginBottom: 8 }}>
                  <span>160 lbs target</span><span>170 lbs start</span>
                </div>
                <input type="range" min={155} max={175} step={0.5} value={weight} onChange={e => setWeight(parseFloat(e.target.value))} />
              </div>

              {/* Percent to goal bar */}
              <div style={{ marginBottom: 20 }}>
                <ProgBar value={Math.max(0,170-weight)} max={10} color="#7B9FD4" label={`${Math.round(((170-weight)/10)*100)}% to 160 lb goal`} />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <input className="glass-input" type="number" value={weightInput} onChange={e => setWeightInput(e.target.value)} placeholder="Enter exact weight (lbs)" />
                <PillBtn onClick={() => { if (weightInput) { setWeight(parseFloat(weightInput)); setWeightInput(''); }}} color="#7B9FD4" glow="rgba(123,159,212,0.4)">Log</PillBtn>
              </div>
            </div>

            {/* Body goals */}
            <GlassSection title="💪 Body Goals" accent="#7B9FD4">
              <GoalGroup label="Aesthetic" color="#7B9FD4" items={["6-pack abs", "No hunch back", "Shredded upper body"]} />
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 12, paddingTop: 12 }}>
                <GoalGroup label="Structural Foundation" color="#5CB88A" items={["Bulletproof ankles, Achilles tendon & calves", "Strong foundation: toes, feet, legs & core"]} />
              </div>
            </GlassSection>

            {/* Basketball */}
            <GlassSection title="🏀 Basketball Goals" accent="#F0A060">
              <GoalGroup color="#F0A060" items={["Starting PG-level ballhandler", "Shoot 40% from 3", "Dynamic contested off the catch & dribble shooter"]} />
            </GlassSection>

            {/* Gyms — image 2 card grid */}
            <div>
              <div style={{ fontSize: 9, color: '#7B9FD4', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Gyms & Resources</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { name: "The Edge Burlington", note: "7-min commute · Weights & cardio", icon: "🏋️" },
                  { name: "The Edge Essex", note: "20-min · Weights, cardio, basketball", icon: "🏀" },
                  { name: "Home Base", note: "No commute · Run, plyo, bands, yoga", icon: "🏠" },
                  { name: "BHS", note: "Sunday Men's League game day", icon: "🏟️" },
                ].map((r,i) => (
                  <div key={i} className="instrument-card" style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 22 }}>{r.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e4ed', marginBottom: 3 }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: '#3a4060' }}>{r.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ─── SHARED COMPONENTS ──────────────────────────────────────────────────────── */

function GlassSection({ title, accent, children }) {
  return (
    <div className="glass-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: accent }} />
        <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#8892b0', textTransform: 'uppercase' }}>{title}</span>
      </div>
      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
  );
}

function WorkoutSection({ section, data, onLog }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card" style={{ overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>{data.icon}</span>
          <div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#8892b0', textTransform: 'uppercase', textAlign: 'left' }}>{section}</div>
            <div style={{ fontSize: 10, color: '#3a4060', marginTop: 1 }}>~{data.burn} cal/session</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: data.color }} />
          <span style={{ color: '#3a4060', fontSize: 14, transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'none' }}>›</span>
        </div>
      </button>
      {open && (
        <div style={{ padding: '4px 18px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {Object.entries(data.groups).map(([group, moves]) => (
            <div key={group} style={{ marginTop: 12 }}>
              {Object.keys(data.groups).length > 1 && (
                <div style={{ fontSize: 9, color: data.color, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>{group}</div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {moves.map((m, i) => (
                  <button key={i} className="chip" onClick={() => onLog(m, data.color, Math.round(data.burn * 0.4))}>
                    <span style={{ fontWeight: 600, color: '#c0c8d8' }}>{m}</span>
                    <span style={{ fontSize: 10, color: '#3a4060' }}>+{Math.round(data.burn*0.4)} cal</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FoodSection({ cat, data, onLog }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card" style={{ overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>{data.icon}</span>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#8892b0', textTransform: 'uppercase', textAlign: 'left' }}>{cat}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#3a4060' }}>{data.items.length} items</span>
          <span style={{ color: '#3a4060', fontSize: 14, transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'none' }}>›</span>
        </div>
      </button>
      {open && (
        <div style={{ padding: '4px 18px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {data.items.map((item, i) => (
            <button key={i} className="chip" onClick={() => onLog(item)}>
              <span style={{ fontWeight: 600, color: '#c0c8d8' }}>{item.name}</span>
              <span style={{ fontSize: 10, color: data.color }}>{item.cal > 0 ? `${item.cal} kcal` : '—'}{item.pro > 0 ? ` · ${item.pro}g pro` : ''}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MacroInstrument({ label, value, target, unit, color, note }) {
  const pct = target ? Math.min(100, (value/target)*100) : null;
  return (
    <div className="instrument-card" style={{ padding: '16px', textAlign: 'center' }}>
      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 24, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9, color: '#3a4060', marginTop: 2, marginBottom: note ? 0 : 8 }}>{unit}</div>
      {note && <div style={{ fontSize: 9, color: '#3a4060', marginBottom: 8 }}>{note}</div>}
      {pct !== null && <ProgBar value={value} max={target} color={color} />}
    </div>
  );
}

function ProgBar({ value, max, color, label, width }) {
  const pct = Math.min(100, Math.max(0, (value/max)*100));
  return (
    <div style={{ width: width || '100%' }}>
      <div className="prog-track">
        <div className="prog-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      {label && <div style={{ fontSize: 9, color: '#3a4060', marginTop: 4, textAlign: 'center' }}>{label}</div>}
    </div>
  );
}

function LogRow({ left, right, sub, onDelete, accent }) {
  return (
    <div className="log-row">
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#c0c8d8' }}>{left}</div>
        <div style={{ fontSize: 10, color: '#3a4060', marginTop: 1 }}>{sub}</div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: accent }}>{right}</div>
      <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3a4060', fontSize: 14, padding: '2px 4px', transition: 'color 0.15s' }}
        onMouseOver={e => e.currentTarget.style.color='#E05C5C'} onMouseOut={e => e.currentTarget.style.color='#3a4060'}>✕</button>
    </div>
  );
}

function PillBtn({ onClick, color, glow, children }) {
  return (
    <button className="pill-btn" onClick={onClick}
      style={{ background: `linear-gradient(160deg, ${color}, ${color}cc)`, color: '#fff', boxShadow: `0 4px 14px ${glow}, 0 1px 0 rgba(255,255,255,0.2) inset`, padding: '10px 18px', whiteSpace: 'nowrap' }}>
      {children}
    </button>
  );
}

function Label({ children }) {
  return <div style={{ fontSize: 9, color: '#3a4060', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 }}>{children}</div>;
}

function GoalGroup({ label, color, items }) {
  return (
    <div>
      {label && <div style={{ fontSize: 9, color, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>{label}</div>}
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '7px 0', borderBottom: i < items.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
          <span style={{ color, fontSize: 10, marginTop: 3, flexShrink: 0 }}>◆</span>
          <span style={{ fontSize: 13, color: '#8892b0' }}>{item}</span>
        </div>
      ))}
    </div>
  );
}