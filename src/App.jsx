import React, { useState, useEffect, useRef } from 'react';

const constitutionData = {
  "goals": {
    "body": {
      "target_weight_lbs": 160,
      "current_weight_lbs": 170,
      "target_body_fat_pct": 15,
      "aesthetic_and_posture": ["6-pack abs", "No hunch back", "Shredded upper body"],
      "structural_foundation": [
        "Bulletproof ankles, Achilles tendon, and calves",
        "Strong foundation throughout toes, feet, legs, and core"
      ]
    },
    "basketball": [
      "Become a starting PG-level ballhandler",
      "Shoot 40% from 3",
      "Dynamic contested off the catch and dribble shooter"
    ]
  },
  "daily_non_negotiables": [
    "Minimum of 40 minutes of exercise",
    "Minimum of 15 minutes outside (Get sunlight)",
    "Minimum of 5 minutes meditation (Headspace)",
    "Minimum of 10 minutes Kegel/core routine (The Coach App)"
  ],
  "dietary_options": {
    "protein": ["Chicken", "Beef", "Shrimp", "Tofu", "Peanut Butter", "Mixed Nuts", "Protein Bars", "Protein Powder"],
    "fiber": ["Watermelon", "Banana", "Sautéed spinach", "Sweet potatoes", "Nuts", "Yerba Prima Psyllium"],
    "carbs": ["Sweet potato", "Rice", "Broccoli", "Spinach", "Frozen Fruit"],
    "supplements_and_hydration": ["Magnesium", "Creatine", "B12", "Electrolytes (Body Armour)", "Water with Lemon & Sea salt"]
  },
  "weekly_schedule": {
    "Monday": { "location": "The Edge SB (Weights)", "focus": "Upper Body Strength", "time_blocks": { "morning_600_730": ["Dynamic stretching/Chi Gong", "Short workout", "Breakfast & Coffee", "Get sunlight"], "work_hours_730_1730": ["Pushups/Core between meetings", "Eat snacks", "Lunch 12:00-12:30"], "after_work_1730_2000": ["Full Upper Body Workout (Chest, Back, Shoulders, Biceps, Triceps, Traps)", "Dinner"] } },
    "Tuesday": { "location": "The Edge Essex", "focus": "Basketball & Legs", "time_blocks": { "morning_600_730": ["Dynamic stretching/Chi Gong", "Short workout", "Breakfast & Coffee", "Get sunlight"], "work_hours_730_1730": ["Pushups/Core between meetings", "Eat snacks", "Lunch 12:00-12:30"], "after_work_1730_2000": ["Basketball workout (Shooting, Ball handling, Skill moves, Jumping)", "Legs (Quads, Hamstrings, Calves, Tibialis, Feet)", "Dinner"] } },
    "Wednesday": { "location": "Home Workout", "focus": "Home Maintenance", "time_blocks": { "morning_600_730": ["Dynamic stretching/Chi Gong", "Short workout", "Breakfast & Coffee", "Get sunlight"], "work_hours_730_1730": ["Pushups/Core between meetings", "Eat snacks", "Lunch 12:00-12:30"], "after_work_1730_2000": ["Home workout (Body weight, Bands, Yoga, Plyometrics, Light strength)", "Dinner"] } },
    "Thursday": { "location": "Home / Running Path", "focus": "Cardio Run", "time_blocks": { "morning_600_730": ["Dynamic stretching/Chi Gong", "Short workout", "Breakfast & Coffee", "Get sunlight"], "work_hours_730_1730": ["Pushups/Core between meetings", "Eat snacks", "Lunch 12:00-12:30"], "after_work_1730_2000": ["Run (Cardio)", "Full Body Workout", "Dinner"] } },
    "Friday": { "location": "The Edge SB", "focus": "Full Body Strength", "time_blocks": { "morning_600_730": ["Dynamic stretching/Chi Gong", "Short workout", "Breakfast & Coffee", "Get sunlight"], "work_hours_730_1730": ["Pushups/Core between meetings", "Eat snacks", "Lunch 12:00-12:30"], "after_work_1730_2000": ["Full Body Workout", "Dinner"] } },
    "Saturday": { "location": "The Edge Essex", "focus": "Game Prep & Shooting", "time_blocks": { "daytime": ["Full workout (Prep and maintenance for game day)", "Shooting workout at the Edge Essex (Shooting, Ball handling, Skill moves, Jumping)"] } },
    "Sunday": { "location": "BHS (Burlington High School)", "focus": "Men's League Game", "time_blocks": { "game_time": ["Men's League Basketball Game"] } }
  }
};

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_ABBREVS = { Sunday: "Sun", Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat" };

const nutritionPresets = [
  { name: "Grilled Chicken (150g)", protein: 40, calories: 220, category: "protein", emoji: "🍗" },
  { name: "Sirloin Beef (150g)", protein: 35, calories: 290, category: "protein", emoji: "🥩" },
  { name: "Garlic Shrimp", protein: 28, calories: 180, category: "protein", emoji: "🍤" },
  { name: "Protein Shake", protein: 30, calories: 210, category: "protein", emoji: "🥛" },
  { name: "Peanut Butter (2 tbsp)", protein: 8, calories: 190, category: "protein", emoji: "🥜" },
  { name: "Sweet Potato (Baked)", protein: 2, calories: 160, category: "carbs", emoji: "🍠" },
  { name: "Bowl of Rice", protein: 4, calories: 200, category: "carbs", emoji: "🍚" },
  { name: "Broccoli & Spinach", protein: 3, calories: 60, category: "fiber", emoji: "🥦" },
  { name: "Watermelon Wedge", protein: 1, calories: 85, category: "fiber", emoji: "🍉" },
  { name: "Banana", protein: 1, calories: 105, category: "fiber", emoji: "🍌" },
  { name: "Psyllium Shake", protein: 0, calories: 30, category: "fiber", emoji: "🌾" },
  { name: "Body Armour Electrolyte", protein: 0, calories: 90, category: "supplements", emoji: "⚡" },
];

const TABS = [
  { id: "today", label: "Today", emoji: "🌿" },
  { id: "food", label: "Fuel", emoji: "🍃" },
  { id: "timer", label: "Timer", emoji: "⏱" },
  { id: "schedule", label: "Week", emoji: "📅" },
  { id: "goals", label: "Goals", emoji: "🏀" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("today");
  const [selectedDay, setSelectedDay] = useState("");
  const [todayDayString, setTodayDayString] = useState("");
  const [checklistStates, setChecklistStates] = useState({});
  const [loggedWeight, setLoggedWeight] = useState(170);
  const [dailyProtein, setDailyProtein] = useState(0);
  const [caloriesLogged, setCaloriesLogged] = useState(0);
  const [customProteinInput, setCustomProteinInput] = useState("");
  const [customCaloriesInput, setCustomCaloriesInput] = useState("");
  const [pushupCount, setPushupCount] = useState(0);
  const [customFoodsLogged, setCustomFoodsLogged] = useState([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    const today = new Date();
    const dayName = DAYS_OF_WEEK[today.getDay()];
    setTodayDayString(dayName);
    setSelectedDay(dayName);
  }, []);

  useEffect(() => {
    if (!selectedDay) return;
    const keyPrefix = `bhgs_${selectedDay}_`;
    const savedChecklist = localStorage.getItem(`${keyPrefix}checklist`);
    setChecklistStates(savedChecklist ? JSON.parse(savedChecklist) : {});
    const savedProtein = localStorage.getItem(`${keyPrefix}protein`);
    setDailyProtein(savedProtein ? parseInt(savedProtein, 10) : 0);
    const savedCalories = localStorage.getItem(`${keyPrefix}calories`);
    setCaloriesLogged(savedCalories ? parseInt(savedCalories, 10) : 0);
    const savedPushups = localStorage.getItem(`${keyPrefix}pushups`);
    setPushupCount(savedPushups ? parseInt(savedPushups, 10) : 0);
    const savedFoods = localStorage.getItem(`${keyPrefix}foods`);
    setCustomFoodsLogged(savedFoods ? JSON.parse(savedFoods) : []);
    const savedTimer = localStorage.getItem(`${keyPrefix}timer`);
    setTimerSeconds(savedTimer ? parseInt(savedTimer, 10) : 0);
  }, [selectedDay]);

  useEffect(() => {
    const storedWeight = localStorage.getItem('bhgs_global_weight');
    if (storedWeight) setLoggedWeight(parseFloat(storedWeight));
  }, []);

  const save = (key, value) => {
    if (!selectedDay) return;
    localStorage.setItem(`bhgs_${selectedDay}_${key}`, JSON.stringify(value));
  };

  const handleCheckChange = (itemKey, isChecked) => {
    const updated = { ...checklistStates, [itemKey]: isChecked };
    setChecklistStates(updated);
    save('checklist', updated);
  };

  const handleProteinAdd = (amount) => {
    const newVal = Math.max(0, dailyProtein + amount);
    setDailyProtein(newVal);
    if (selectedDay) localStorage.setItem(`bhgs_${selectedDay}_protein`, newVal);
  };

  const handleCaloriesAdd = (amount) => {
    const newVal = Math.max(0, caloriesLogged + amount);
    setCaloriesLogged(newVal);
    if (selectedDay) localStorage.setItem(`bhgs_${selectedDay}_calories`, newVal);
  };

  const handlePushupIncrement = (amount) => {
    const next = Math.max(0, pushupCount + amount);
    setPushupCount(next);
    if (selectedDay) localStorage.setItem(`bhgs_${selectedDay}_pushups`, next);
  };

  const startTimer = () => {
    if (isTimerRunning) return;
    setIsTimerRunning(true);
    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds(prev => {
        const next = prev + 1;
        if (selectedDay) localStorage.setItem(`bhgs_${selectedDay}_timer`, next);
        return next;
      });
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerIntervalRef.current);
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    clearInterval(timerIntervalRef.current);
    setIsTimerRunning(false);
    setTimerSeconds(0);
    if (selectedDay) localStorage.setItem(`bhgs_${selectedDay}_timer`, 0);
  };

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [hrs > 0 ? String(hrs).padStart(2, '0') : null, String(mins).padStart(2, '0'), String(secs).padStart(2, '0')].filter(Boolean).join(':');
  };

  const handleWeightChange = (newWeight) => {
    const rounded = parseFloat(newWeight).toFixed(1);
    setLoggedWeight(rounded);
    localStorage.setItem('bhgs_global_weight', rounded);
  };

  const handleEatFoodPreset = (food) => {
    handleProteinAdd(food.protein);
    handleCaloriesAdd(food.calories);
    const entry = { id: Date.now(), name: food.name, protein: food.protein, calories: food.calories, emoji: food.emoji, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const updated = [entry, ...customFoodsLogged];
    setCustomFoodsLogged(updated);
    if (selectedDay) localStorage.setItem(`bhgs_${selectedDay}_foods`, JSON.stringify(updated));
  };

  const handleCustomFoodAdd = () => {
    const pVal = parseInt(customProteinInput, 10) || 0;
    const cVal = parseInt(customCaloriesInput, 10) || 0;
    if (!pVal && !cVal) return;
    const entry = { id: Date.now(), name: "Custom Entry", protein: pVal, calories: cVal, emoji: "🍽", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    handleProteinAdd(pVal);
    handleCaloriesAdd(cVal);
    const updated = [entry, ...customFoodsLogged];
    setCustomFoodsLogged(updated);
    if (selectedDay) localStorage.setItem(`bhgs_${selectedDay}_foods`, JSON.stringify(updated));
    setCustomProteinInput("");
    setCustomCaloriesInput("");
  };

  const deleteLoggedFood = (foodId, p, c) => {
    const updated = customFoodsLogged.filter(f => f.id !== foodId);
    setCustomFoodsLogged(updated);
    if (selectedDay) localStorage.setItem(`bhgs_${selectedDay}_foods`, JSON.stringify(updated));
    handleProteinAdd(-p);
    handleCaloriesAdd(-c);
  };

  const handleResetDay = () => {
    if (confirm(`Reset all logs for ${selectedDay}?`)) {
      setChecklistStates({}); setDailyProtein(0); setCaloriesLogged(0); setPushupCount(0);
      setCustomFoodsLogged([]); setTimerSeconds(0); setIsTimerRunning(false);
      clearInterval(timerIntervalRef.current);
      const prefix = `bhgs_${selectedDay}_`;
      ['checklist','protein','calories','pushups','foods','timer'].forEach(k => localStorage.removeItem(prefix + k));
    }
  };

  const activeDaySchedule = constitutionData.weekly_schedule[selectedDay] || { location: "Rest", focus: "Recovery", time_blocks: { daytime: ["Active stretching & Recovery"] } };
  const nonNegotiablesCompleted = constitutionData.daily_non_negotiables.filter((_, i) => checklistStates[`daily_habit_${i}`]).length;
  const proteinPct = Math.min(100, Math.round((dailyProtein / 160) * 100));
  const timerPct = Math.min(100, Math.round((timerSeconds / 2400) * 100));

  const blockMeta = {
    morning_600_730: { label: "Morning Ritual", time: "6:00 – 7:30 AM", color: "#E8C547" },
    work_hours_730_1730: { label: "Work Hours", time: "7:30 AM – 5:30 PM", color: "#7A9E5E" },
    after_work_1730_2000: { label: "Evening Session", time: "5:30 – 8:00 PM", color: "#2D4A22" },
    daytime: { label: "Full Day Block", time: "All Day", color: "#3D2B1F" },
    game_time: { label: "Game Time", time: "Game Day", color: "#E8C547" },
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#F5F0E8", minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative" }}>

      {/* ── HEADER ── */}
      <header style={{ background: "linear-gradient(135deg, #2D4A22 0%, #3D5A2A 100%)", padding: "20px 20px 16px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 22 }}>🌿</span>
              <div>
                <div style={{ color: "#E8C547", fontWeight: 800, fontSize: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>Ball Hard</div>
                <div style={{ color: "#c9d8b5", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}>Get Shredded</div>
              </div>
            </div>
          </div>
          {/* Weight pill */}
          <div style={{ background: "rgba(232,197,71,0.15)", border: "1px solid rgba(232,197,71,0.4)", borderRadius: 24, padding: "6px 14px", textAlign: "center" }}>
            <div style={{ color: "#c9d8b5", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase" }}>Weight</div>
            <div style={{ color: "#E8C547", fontWeight: 800, fontSize: 15 }}>{loggedWeight} lbs</div>
          </div>
        </div>

        {/* Day Selector Strip */}
        <div style={{ display: "flex", gap: 6, marginTop: 14, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
          {DAYS_OF_WEEK.map(day => {
            const isToday = day === todayDayString;
            const isSelected = day === selectedDay;
            return (
              <button key={day} onClick={() => setSelectedDay(day)} style={{
                flex: "0 0 auto",
                padding: "8px 12px",
                borderRadius: 10,
                border: isSelected ? "2px solid #E8C547" : "2px solid rgba(255,255,255,0.1)",
                background: isSelected ? "rgba(232,197,71,0.2)" : "rgba(255,255,255,0.06)",
                color: isSelected ? "#E8C547" : "#c9d8b5",
                fontSize: 12,
                fontWeight: isSelected ? 700 : 500,
                cursor: "pointer",
                position: "relative",
                whiteSpace: "nowrap",
              }}>
                {DAY_ABBREVS[day]}
                {isToday && <span style={{ position: "absolute", top: 2, right: 2, width: 5, height: 5, borderRadius: "50%", background: "#E8C547" }} />}
              </button>
            );
          })}
        </div>
      </header>

      {/* ── FOCUS BANNER ── */}
      <div style={{ background: "#3D2B1F", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: "#c9a87c", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>{selectedDay}'s Focus</div>
          <div style={{ color: "#F5F0E8", fontWeight: 700, fontSize: 15 }}>{activeDaySchedule.focus}</div>
        </div>
        <div style={{ color: "#c9a87c", fontSize: 11, textAlign: "right" }}>
          <div>📍 {activeDaySchedule.location}</div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ padding: "0 0 80px" }}>

        {/* ═══ TAB: TODAY ═══ */}
        {activeTab === "today" && (
          <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Progress Snapshot */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
              <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 13, marginBottom: 14, letterSpacing: "0.04em", textTransform: "uppercase" }}>Daily Progress</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { label: "Habits", value: `${nonNegotiablesCompleted}/4`, sub: "completed", color: "#2D4A22" },
                  { label: "Protein", value: `${dailyProtein}g`, sub: `${proteinPct}% of 160g`, color: "#7A9E5E" },
                  { label: "Session", value: formatTime(timerSeconds), sub: timerPct >= 100 ? "✓ Goal met" : `${timerPct}% of 40m`, color: "#E8C547" },
                ].map(stat => (
                  <div key={stat.label} style={{ textAlign: "center", padding: "10px 6px", background: "#F9F6F1", borderRadius: 10, border: "1px solid #ede4d8" }}>
                    <div style={{ color: stat.color, fontWeight: 800, fontSize: 16 }}>{stat.value}</div>
                    <div style={{ color: "#8B7355", fontSize: 9, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>{stat.label}</div>
                    <div style={{ color: "#b5a090", fontSize: 9 }}>{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Non-Negotiables */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em" }}>Non-Negotiables</div>
                <div style={{ background: "#2D4A22", color: "#E8C547", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
                  {nonNegotiablesCompleted}/4
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {constitutionData.daily_non_negotiables.map((habit, i) => {
                  const key = `daily_habit_${i}`;
                  const checked = !!checklistStates[key];
                  return (
                    <label key={key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: checked ? "#F0F7EC" : "#F9F6F1", border: `1px solid ${checked ? "#7A9E5E" : "#ede4d8"}`, cursor: "pointer" }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${checked ? "#2D4A22" : "#c9b99a"}`, background: checked ? "#2D4A22" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {checked && <span style={{ color: "#E8C547", fontSize: 13, fontWeight: 900 }}>✓</span>}
                      </div>
                      <input type="checkbox" checked={checked} onChange={e => handleCheckChange(key, e.target.checked)} style={{ display: "none" }} />
                      <span style={{ fontSize: 13, color: checked ? "#7A9E5E" : "#3D2B1F", textDecoration: checked ? "line-through" : "none", fontWeight: checked ? 400 : 500 }}>{habit}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Pushup Counter */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
              <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12 }}>Work-Day Pushup Counter</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button onClick={() => handlePushupIncrement(-5)} style={{ width: 44, height: 44, borderRadius: 12, border: "2px solid #e8ddd0", background: "#F9F6F1", color: "#3D2B1F", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>−</button>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#2D4A22", fontWeight: 900, fontSize: 40, lineHeight: 1 }}>{pushupCount}</div>
                  <div style={{ color: "#8B7355", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>total reps today</div>
                </div>
                <button onClick={() => handlePushupIncrement(5)} style={{ width: 44, height: 44, borderRadius: 12, border: "2px solid #2D4A22", background: "#2D4A22", color: "#E8C547", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>+5</button>
              </div>
            </div>

            {/* Reset */}
            <button onClick={handleResetDay} style={{ background: "transparent", border: "1px solid #d4b8a0", borderRadius: 10, padding: "10px 16px", color: "#a08060", fontSize: 12, cursor: "pointer", textAlign: "center" }}>
              Reset {selectedDay}'s logs
            </button>
          </div>
        )}

        {/* ═══ TAB: FOOD / FUEL ═══ */}
        {activeTab === "food" && (
          <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Protein Meter */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
                <div>
                  <div style={{ color: "#8B7355", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>Daily Protein</div>
                  <div style={{ color: "#2D4A22", fontWeight: 900, fontSize: 32, lineHeight: 1 }}>{dailyProtein}g <span style={{ color: "#b5a090", fontWeight: 400, fontSize: 16 }}>/ 160g</span></div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#8B7355", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>Calories</div>
                  <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 22 }}>{caloriesLogged} <span style={{ color: "#b5a090", fontWeight: 400, fontSize: 13 }}>kcal</span></div>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ background: "#f0e8dc", borderRadius: 8, height: 10, overflow: "hidden" }}>
                <div style={{ background: "linear-gradient(90deg, #2D4A22, #7A9E5E)", height: "100%", width: `${proteinPct}%`, borderRadius: 8, transition: "width 0.4s ease" }} />
              </div>
              <div style={{ color: "#8B7355", fontSize: 11, marginTop: 6 }}>{proteinPct}% of daily goal</div>
            </div>

            {/* Food Categories */}
            {[
              { cat: "protein", label: "Proteins", emoji: "🥩", borderColor: "#c9a87c", bgColor: "#fdf8f3" },
              { cat: "fiber", label: "Fiber & Greens", emoji: "🥬", borderColor: "#7A9E5E", bgColor: "#f4faf0" },
              { cat: "carbs", label: "Complex Carbs", emoji: "🍠", borderColor: "#E8C547", bgColor: "#fdfdf0" },
              { cat: "supplements", label: "Supplements & Hydration", emoji: "⚡", borderColor: "#3D2B1F", bgColor: "#f8f4f0" },
            ].map(({ cat, label, emoji, borderColor, bgColor }) => (
              <div key={cat} style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
                <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>{emoji} {label}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {nutritionPresets.filter(f => f.category === cat).map(food => (
                    <button key={food.name} onClick={() => handleEatFoodPreset(food)} style={{
                      padding: "8px 12px", borderRadius: 10, border: `1px solid ${borderColor}`,
                      background: bgColor, cursor: "pointer", fontSize: 12, color: "#3D2B1F",
                      display: "flex", alignItems: "center", gap: 5, fontWeight: 500,
                    }}>
                      <span>{food.emoji}</span>
                      <span>{food.name.split(" ")[0]}</span>
                      {food.protein > 0 && <span style={{ color: "#2D4A22", fontWeight: 700, fontSize: 11 }}>+{food.protein}g</span>}
                      <span style={{ color: "#8B7355", fontSize: 10 }}>{food.calories}cal</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Custom Log */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
              <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>🍽 Log Custom Intake</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                {[["Protein (g)", customProteinInput, setCustomProteinInput], ["Calories (kcal)", customCaloriesInput, setCustomCaloriesInput]].map(([label, val, setter]) => (
                  <div key={label}>
                    <div style={{ color: "#8B7355", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
                    <input type="number" placeholder="0" value={val} onChange={e => setter(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e8ddd0", background: "#F9F6F1", color: "#3D2B1F", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
                  </div>
                ))}
              </div>
              <button onClick={handleCustomFoodAdd} style={{ width: "100%", padding: "12px", borderRadius: 10, background: "#2D4A22", color: "#E8C547", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", letterSpacing: "0.04em" }}>
                Log Food
              </button>
            </div>

            {/* Food Log History */}
            {customFoodsLogged.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
                <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Today's Intake Log</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 280, overflowY: "auto" }}>
                  {customFoodsLogged.map(food => (
                    <div key={food.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#F9F6F1", borderRadius: 10, border: "1px solid #ede4d8" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{food.emoji || "🍽"}</span>
                        <div>
                          <div style={{ color: "#3D2B1F", fontWeight: 600, fontSize: 12 }}>{food.name}</div>
                          <div style={{ color: "#8B7355", fontSize: 10 }}>{food.time}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: "#2D4A22", fontWeight: 700, fontSize: 12 }}>{food.protein}g</span>
                        <span style={{ color: "#8B7355", fontSize: 11 }}>{food.calories}cal</span>
                        <button onClick={() => deleteLoggedFood(food.id, food.protein, food.calories)} style={{ background: "none", border: "none", color: "#c9a0a0", cursor: "pointer", fontSize: 14, padding: "2px 4px" }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ TAB: TIMER ═══ */}
        {activeTab === "timer" && (
          <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Big Timer Display */}
            <div style={{ background: "linear-gradient(145deg, #2D4A22, #3D5A2A)", borderRadius: 20, padding: "32px 24px", textAlign: "center", boxShadow: "0 8px 32px rgba(45,74,34,0.3)" }}>
              <div style={{ color: "#c9d8b5", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>Session Timer</div>
              <div style={{ color: timerSeconds >= 2400 ? "#E8C547" : "#F5F0E8", fontWeight: 900, fontSize: 64, letterSpacing: "0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {formatTime(timerSeconds)}
              </div>
              <div style={{ color: "#7A9E5E", fontSize: 13, marginTop: 8 }}>
                {timerSeconds >= 2400 ? "✓ Daily goal reached!" : `${timerPct}% of 40-minute goal`}
              </div>

              {/* Ring Progress */}
              <div style={{ margin: "20px auto 0", position: "relative", width: 120, height: 120 }}>
                <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke={timerSeconds >= 2400 ? "#E8C547" : "#7A9E5E"} strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - timerPct / 100)}`}
                    strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s ease" }} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#F5F0E8", fontWeight: 800, fontSize: 18 }}>
                  {timerPct}%
                </div>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
              {!isTimerRunning ? (
                <button onClick={startTimer} style={{ padding: "16px", borderRadius: 14, background: "#2D4A22", color: "#E8C547", border: "none", fontWeight: 800, fontSize: 16, cursor: "pointer", letterSpacing: "0.06em" }}>
                  ▶ START
                </button>
              ) : (
                <button onClick={stopTimer} style={{ padding: "16px", borderRadius: 14, background: "#E8C547", color: "#2D4A22", border: "none", fontWeight: 800, fontSize: 16, cursor: "pointer", letterSpacing: "0.06em" }}>
                  ❚❚ PAUSE
                </button>
              )}
              <button onClick={resetTimer} style={{ padding: "16px", borderRadius: 14, background: "#F9F6F1", color: "#3D2B1F", border: "1px solid #e8ddd0", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Reset
              </button>
            </div>

            {/* Weight Slider */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
              <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 14 }}>⚖️ Weight Tracker</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ color: "#8B7355", fontSize: 12 }}>Target: 160 lbs</span>
                <span style={{ color: "#2D4A22", fontWeight: 800, fontSize: 20 }}>{loggedWeight} lbs</span>
                <span style={{ color: "#8B7355", fontSize: 12 }}>Base: 170 lbs</span>
              </div>
              <input type="range" min="155" max="175" step="0.5" value={loggedWeight} onChange={e => handleWeightChange(e.target.value)}
                style={{ width: "100%", accentColor: "#2D4A22" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
                <div style={{ background: "#F9F6F1", borderRadius: 10, padding: "10px 12px", border: "1px solid #ede4d8" }}>
                  <div style={{ color: "#8B7355", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>To Target</div>
                  <div style={{ color: "#2D4A22", fontWeight: 800, fontSize: 18 }}>{(loggedWeight - 160).toFixed(1)} lbs</div>
                </div>
                <div style={{ background: "#F9F6F1", borderRadius: 10, padding: "10px 12px", border: "1px solid #ede4d8" }}>
                  <div style={{ color: "#8B7355", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Body Fat Goal</div>
                  <div style={{ color: "#7A9E5E", fontWeight: 800, fontSize: 18 }}>15%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ TAB: WEEKLY SCHEDULE ═══ */}
        {activeTab === "schedule" && (
          <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 15, marginBottom: 0 }}>
              {selectedDay} — {activeDaySchedule.focus}
            </div>

            {Object.entries(activeDaySchedule.time_blocks).map(([blockKey, tasks]) => {
              const meta = blockMeta[blockKey] || { label: blockKey, time: "", color: "#3D2B1F" };
              return (
                <div key={blockKey} style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0", borderLeftWidth: 4, borderLeftColor: meta.color }}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ color: meta.color, fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>{meta.label}</div>
                    <div style={{ color: "#8B7355", fontSize: 11 }}>{meta.time}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {tasks.map((task, idx) => {
                      const taskKey = `schedule_${blockKey}_${idx}`;
                      const checked = !!checklistStates[taskKey];
                      return (
                        <label key={taskKey} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: checked ? "#F0F7EC" : "#F9F6F1", border: `1px solid ${checked ? "#7A9E5E" : "#ede4d8"}`, cursor: "pointer" }}>
                          <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${checked ? "#2D4A22" : "#c9b99a"}`, background: checked ? "#2D4A22" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {checked && <span style={{ color: "#E8C547", fontSize: 11, fontWeight: 900 }}>✓</span>}
                          </div>
                          <input type="checkbox" checked={checked} onChange={e => handleCheckChange(taskKey, e.target.checked)} style={{ display: "none" }} />
                          <span style={{ fontSize: 13, color: checked ? "#7A9E5E" : "#3D2B1F", textDecoration: checked ? "line-through" : "none", fontWeight: 500 }}>{task}</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Pushup counter inside work hours */}
                  {blockKey === "work_hours_730_1730" && (
                    <div style={{ marginTop: 12, padding: "12px", background: "#F9F6F1", borderRadius: 10, border: "1px solid #ede4d8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ color: "#3D2B1F", fontWeight: 600, fontSize: 12 }}>Pushup Counter</div>
                        <div style={{ color: "#8B7355", fontSize: 10 }}>Between-meeting reps</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <button onClick={() => handlePushupIncrement(-5)} style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid #e8ddd0", background: "#fff", color: "#3D2B1F", fontWeight: 700, cursor: "pointer" }}>−5</button>
                        <span style={{ color: "#2D4A22", fontWeight: 900, fontSize: 22, minWidth: 44, textAlign: "center" }}>{pushupCount}</span>
                        <button onClick={() => handlePushupIncrement(5)} style={{ width: 36, height: 36, borderRadius: 8, border: "2px solid #2D4A22", background: "#2D4A22", color: "#E8C547", fontWeight: 700, cursor: "pointer" }}>+5</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ TAB: GOALS ═══ */}
        {activeTab === "goals" && (
          <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Body Goals */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
              <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 14 }}>💪 Body Goals</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                {[
                  { label: "Target Weight", value: "160 lbs", color: "#2D4A22" },
                  { label: "Body Fat", value: "15%", color: "#7A9E5E" },
                ].map(item => (
                  <div key={item.label} style={{ background: "#F9F6F1", borderRadius: 10, padding: "12px", border: "1px solid #ede4d8", textAlign: "center" }}>
                    <div style={{ color: item.color, fontWeight: 800, fontSize: 22 }}>{item.value}</div>
                    <div style={{ color: "#8B7355", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>{item.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {constitutionData.goals.body.aesthetic_and_posture.map(goal => (
                  <div key={goal} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#F9F6F1", borderRadius: 10, border: "1px solid #ede4d8" }}>
                    <span style={{ color: "#7A9E5E", fontWeight: 900 }}>→</span>
                    <span style={{ color: "#3D2B1F", fontSize: 13, fontWeight: 500 }}>{goal}</span>
                  </div>
                ))}
                {constitutionData.goals.body.structural_foundation.map(goal => (
                  <div key={goal} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#F9F6F1", borderRadius: 10, border: "1px solid #ede4d8" }}>
                    <span style={{ color: "#E8C547", fontWeight: 900 }}>→</span>
                    <span style={{ color: "#3D2B1F", fontSize: 13, fontWeight: 500 }}>{goal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Basketball Goals */}
            <div style={{ background: "linear-gradient(145deg, #3D2B1F, #4a3525)", borderRadius: 16, padding: 16, boxShadow: "0 4px 20px rgba(61,43,31,0.25)" }}>
              <div style={{ color: "#E8C547", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 14 }}>🏀 Basketball Targets</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {constitutionData.goals.basketball.map((goal, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px", background: "rgba(255,255,255,0.07)", borderRadius: 10, border: "1px solid rgba(232,197,71,0.15)" }}>
                    <span style={{ color: "#E8C547", fontWeight: 900, fontSize: 16 }}>{i + 1}</span>
                    <span style={{ color: "#F5F0E8", fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>{goal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Constitution PDF reminder */}
            <div style={{ background: "#F9F6F1", borderRadius: 16, padding: 16, border: "1px solid #e8ddd0", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
              <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 13 }}>Fitness Constitution</div>
              <div style={{ color: "#8B7355", fontSize: 12, marginTop: 4 }}>Your full plan lives in the PDF attached to this project.</div>
            </div>
          </div>
        )}

      </main>

      {/* ── BOTTOM TAB BAR ── */}
      <nav style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480, background: "#fff",
        borderTop: "1px solid #e8ddd0", display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
        zIndex: 100, boxShadow: "0 -4px 20px rgba(61,43,31,0.1)"
      }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: "10px 4px 12px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              borderTop: isActive ? "3px solid #2D4A22" : "3px solid transparent",
            }}>
              <span style={{ fontSize: 20 }}>{tab.emoji}</span>
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? "#2D4A22" : "#8B7355", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}