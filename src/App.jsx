import React, { useState, useEffect, useRef } from 'react';
import constitutionData from './data/constitution.json';
import nutritionPresets from './data/nutrition.json';
import workoutPresets from './data/workouts.json';

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_ABBREVS = { Sunday: "Sun", Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat" };

const TABS = [
  { id: "today", label: "Today", emoji: "🌿" },
  { id: "food", label: "Fuel", emoji: "🍃" },
  { id: "burn", label: "Burn", emoji: "🔥" },
  { id: "timer", label: "Timer", emoji: "⏱" },
  { id: "goals", label: "Goals", emoji: "🏀" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("today");
  const [selectedDay, setSelectedDay] = useState("");
  const [todayDayString, setTodayDayString] = useState("");
  const [checklistStates, setChecklistStates] = useState({});
  const [loggedWeight, setLoggedWeight] = useState(170);
  const [targetWeight, setTargetWeight] = useState(160);
  
  // Caloric / Nutrition States
  const [dailyProtein, setDailyProtein] = useState(0);
  const [caloriesLogged, setCaloriesLogged] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  
  // Form Inputs
  const [customProteinInput, setCustomProteinInput] = useState("");
  const [customCaloriesInput, setCustomCaloriesInput] = useState("");
  const [customBurnInput, setCustomBurnInput] = useState("");
  const [customWorkoutInput, setCustomWorkoutInput] = useState("");
  
  const [pushupCount, setPushupCount] = useState(0);
  const [customFoodsLogged, setCustomFoodsLogged] = useState([]);
  const [loggedWorkouts, setLoggedWorkouts] = useState([]);
  
  // Timer States
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
    
    setChecklistStates(localStorage.getItem(`${keyPrefix}checklist`) ? JSON.parse(localStorage.getItem(`${keyPrefix}checklist`)) : {});
    setDailyProtein(localStorage.getItem(`${keyPrefix}protein`) ? parseInt(localStorage.getItem(`${keyPrefix}protein`), 10) : 0);
    setCaloriesLogged(localStorage.getItem(`${keyPrefix}calories`) ? parseInt(localStorage.getItem(`${keyPrefix}calories`), 10) : 0);
    setCaloriesBurned(localStorage.getItem(`${keyPrefix}burned`) ? parseInt(localStorage.getItem(`${keyPrefix}burned`), 10) : 0);
    setPushupCount(localStorage.getItem(`${keyPrefix}pushups`) ? parseInt(localStorage.getItem(`${keyPrefix}pushups`), 10) : 0);
    setCustomFoodsLogged(localStorage.getItem(`${keyPrefix}foods`) ? JSON.parse(localStorage.getItem(`${keyPrefix}foods`)) : []);
    setLoggedWorkouts(localStorage.getItem(`${keyPrefix}workouts`) ? JSON.parse(localStorage.getItem(`${keyPrefix}workouts`)) : []);
    setTimerSeconds(localStorage.getItem(`${keyPrefix}timer`) ? parseInt(localStorage.getItem(`${keyPrefix}timer`), 10) : 0);
  }, [selectedDay]);

  useEffect(() => {
    const storedWeight = localStorage.getItem('bhgs_global_weight');
    if (storedWeight) setLoggedWeight(parseFloat(storedWeight));
    const storedTargetWeight = localStorage.getItem('bhgs_global_target_weight');
    if (storedTargetWeight) setTargetWeight(parseFloat(storedTargetWeight));
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

  const handleCaloriesBurnAdd = (amount) => {
    const newVal = Math.max(0, caloriesBurned + amount);
    setCaloriesBurned(newVal);
    if (selectedDay) localStorage.setItem(`bhgs_${selectedDay}_burned`, newVal);
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

  const handleTargetWeightChange = (newWeight) => {
    const rounded = parseFloat(newWeight).toFixed(1);
    setTargetWeight(rounded);
    localStorage.setItem('bhgs_global_target_weight', rounded);
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

  const handleLogWorkoutPreset = (workout) => {
    handleCaloriesBurnAdd(workout.caloriesBurned);
    const entry = {
      id: Date.now(),
      name: workout.name,
      emoji: workout.emoji,
      caloriesBurned: workout.caloriesBurned,
      details: workout.details,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [entry, ...loggedWorkouts];
    setLoggedWorkouts(updated);
    if (selectedDay) localStorage.setItem(`bhgs_${selectedDay}_workouts`, JSON.stringify(updated));
  };

  const handleCustomWorkoutAdd = () => {
    if (!customWorkoutInput.trim()) return;
    const bVal = parseInt(customBurnInput, 10) || 0;
    const entry = {
      id: Date.now(),
      name: customWorkoutInput.trim(),
      emoji: "🔥",
      caloriesBurned: bVal,
      details: "Custom session entry",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    handleCaloriesBurnAdd(bVal);
    const updated = [entry, ...loggedWorkouts];
    setLoggedWorkouts(updated);
    if (selectedDay) localStorage.setItem(`bhgs_${selectedDay}_workouts`, JSON.stringify(updated));
    setCustomWorkoutInput("");
    setCustomBurnInput("");
  };

  const deleteLoggedWorkout = (workoutId, cal) => {
    const updated = loggedWorkouts.filter(w => w.id !== workoutId);
    setLoggedWorkouts(updated);
    if (selectedDay) localStorage.setItem(`bhgs_${selectedDay}_workouts`, JSON.stringify(updated));
    handleCaloriesBurnAdd(-cal);
  };

  const handleResetDay = () => {
    if (confirm(`Reset all logs for ${selectedDay}?`)) {
      setChecklistStates({}); setDailyProtein(0); setCaloriesLogged(0); setCaloriesBurned(0); setPushupCount(0);
      setCustomFoodsLogged([]); setLoggedWorkouts([]); setTimerSeconds(0); setIsTimerRunning(false);
      clearInterval(timerIntervalRef.current);
      const prefix = `bhgs_${selectedDay}_`;
      ['checklist','protein','calories','burned','pushups','foods','workouts','timer'].forEach(k => localStorage.removeItem(prefix + k));
    }
  };

  const activeDaySchedule = constitutionData.weekly_schedule[selectedDay] || { location: "Rest", focus: "Recovery" };
  const nonNegotiablesCompleted = constitutionData.daily_non_negotiables.filter((_, i) => checklistStates[`daily_habit_${i}`]).length;
  const proteinPct = Math.min(100, Math.round((dailyProtein / 160) * 100));
  const timerPct = Math.min(100, Math.round((timerSeconds / 2400) * 100));
  const netCalories = caloriesLogged - caloriesBurned;

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
          <div style={{ background: "rgba(232,197,71,0.15)", border: "1px solid rgba(232,197,71,0.4)", borderRadius: 24, padding: "6px 14px", textAlign: "center" }}>
            <div style={{ color: "#c9d8b5", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase" }}>Weight</div>
            <div style={{ color: "#E8C547", fontWeight: 800, fontSize: 15 }}>{loggedWeight} lbs</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, marginTop: 14, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
          {DAYS_OF_WEEK.map(day => {
            const isToday = day === todayDayString;
            const isSelected = day === selectedDay;
            return (
              <button key={day} onClick={() => setSelectedDay(day)} style={{
                flex: "0 0 auto", padding: "8px 12px", borderRadius: 10,
                border: isSelected ? "2px solid #E8C547" : "2px solid rgba(255,255,255,0.1)",
                background: isSelected ? "rgba(232,197,71,0.2)" : "rgba(255,255,255,0.06)",
                color: isSelected ? "#E8C547" : "#c9d8b5", fontSize: 12, fontWeight: isSelected ? 700 : 500,
                cursor: "pointer", position: "relative", whiteSpace: "nowrap",
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
          <div style={{ color: "#c9a87c", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>{selectedDay}'s Targets</div>
          <div style={{ color: "#F5F0E8", fontWeight: 700, fontSize: 15 }}>{activeDaySchedule.focus}</div>
        </div>
        <div style={{ color: "#c9a87c", fontSize: 11, textAlign: "right" }}>
          <div>📍 {activeDaySchedule.location}</div>
        </div>
      </div>

      <main style={{ padding: "0 0 80px" }}>

        {/* ═══ TAB: TODAY ═══ */}
        {activeTab === "today" && (
          <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
              <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 13, marginBottom: 14, textTransform: "uppercase" }}>Daily Progress</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { label: "Habits", value: `${nonNegotiablesCompleted}/4`, sub: "completed", color: "#2D4A22" },
                  { label: "Protein", value: `${dailyProtein}g`, sub: `${proteinPct}% of 160g`, color: "#7A9E5E" },
                  { label: "Net Cal", value: `${netCalories} kcal`, sub: `In: ${caloriesLogged} | Out: ${caloriesBurned}`, color: "#3D2B1F" },
                ].map(stat => (
                  <div key={stat.label} style={{ textAlign: "center", padding: "10px 6px", background: "#F9F6F1", borderRadius: 10, border: "1px solid #ede4d8" }}>
                    <div style={{ color: stat.color, fontWeight: 800, fontSize: 15 }}>{stat.value}</div>
                    <div style={{ color: "#8B7355", fontSize: 9, marginTop: 2, textTransform: "uppercase" }}>{stat.label}</div>
                    <div style={{ color: "#b5a090", fontSize: 8 }}>{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Non-Negotiables */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 13, textTransform: "uppercase" }}>Non-Negotiables</div>
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
                      <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${checked ? "#2D4A22" : "#c9b99a"}`, background: checked ? "#2D4A22" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {checked && <span style={{ color: "#E8C547", fontSize: 13, fontWeight: 900 }}>✓</span>}
                      </div>
                      <input type="checkbox" checked={checked} onChange={e => handleCheckChange(key, e.target.checked)} style={{ display: "none" }} />
                      <span style={{ fontSize: 13, color: checked ? "#7A9E5E" : "#3D2B1F", textDecoration: checked ? "line-through" : "none" }}>{habit}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Pushups */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
              <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 13, textTransform: "uppercase", marginBottom: 12 }}>Work-Day Pushup Counter</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button onClick={() => handlePushupIncrement(-5)} style={{ width: 44, height: 44, borderRadius: 12, border: "2px solid #e8ddd0", background: "#F9F6F1", fontSize: 16, fontWeight: 700 }}>−</button>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#2D4A22", fontWeight: 900, fontSize: 40, lineHeight: 1 }}>{pushupCount}</div>
                  <div style={{ color: "#8B7355", fontSize: 11, textTransform: "uppercase" }}>total reps today</div>
                </div>
                <button onClick={() => handlePushupIncrement(5)} style={{ width: 44, height: 44, borderRadius: 12, border: "2px solid #2D4A22", background: "#2D4A22", color: "#E8C547", fontSize: 16, fontWeight: 700 }}>+5</button>
              </div>
            </div>

            <button onClick={handleResetDay} style={{ background: "transparent", border: "1px solid #d4b8a0", borderRadius: 10, padding: "10px 16px", color: "#a08060", fontSize: 12 }}>
              Reset {selectedDay}'s logs
            </button>
          </div>
        )}

        {/* ═══ TAB: FOOD / FUEL ═══ */}
        {activeTab === "food" && (
          <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
                <div>
                  <div style={{ color: "#8B7355", fontSize: 10, textTransform: "uppercase" }}>Daily Protein</div>
                  <div style={{ color: "#2D4A22", fontWeight: 900, fontSize: 32, lineHeight: 1 }}>{dailyProtein}g <span style={{ color: "#b5a090", fontWeight: 400, fontSize: 16 }}>/ 160g</span></div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#8B7355", fontSize: 10, textTransform: "uppercase" }}>Calories Intake</div>
                  <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 22 }}>{caloriesLogged} <span style={{ color: "#b5a090", fontWeight: 400, fontSize: 13 }}>kcal</span></div>
                </div>
              </div>
              <div style={{ background: "#f0e8dc", borderRadius: 8, height: 10, overflow: "hidden" }}>
                <div style={{ background: "linear-gradient(90deg, #2D4A22, #7A9E5E)", height: "100%", width: `${proteinPct}%` }} />
              </div>
            </div>

            {["protein", "fiber", "carbs", "supplements"].map(cat => (
              <div key={cat} style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
                <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 13, marginBottom: 10, textTransform: "uppercase" }}>{cat} presets</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {nutritionPresets.filter(f => f.category === cat).map(food => (
                    <button key={food.name} onClick={() => handleEatFoodPreset(food)} style={{
                      padding: "8px 12px", borderRadius: 10, border: "1px solid #c9a87c", background: "#fdf8f3", fontSize: 12, display: "flex", alignItems: "center", gap: 5
                    }}>
                      <span>{food.emoji}</span>
                      <span>{food.name.split(" ")[0]}</span>
                      {food.protein > 0 && <span style={{ color: "#2D4A22", fontWeight: 700 }}>+{food.protein}g</span>}
                      <span style={{ color: "#8B7355" }}>{food.calories}c</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
              <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>🍽 Log Custom Intake</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                {[["Protein (g)", customProteinInput, setCustomProteinInput], ["Calories (kcal)", customCaloriesInput, setCustomCaloriesInput]].map(([label, val, setter]) => (
                  <div key={label}>
                    <input type="number" placeholder={label} value={val} onChange={e => setter(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e8ddd0" }} />
                  </div>
                ))}
              </div>
              <button onClick={handleCustomFoodAdd} style={{ width: "100%", padding: "12px", borderRadius: 10, background: "#2D4A22", color: "#E8C547", border: "none", fontWeight: 700 }}>Log Food</button>
            </div>

            {customFoodsLogged.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {customFoodsLogged.map(food => (
                    <div key={food.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#F9F6F1", borderRadius: 10 }}>
                      id={food.name} <span>{food.protein}g / {food.calories}cal</span>
                      <button onClick={() => deleteLoggedFood(food.id, food.protein, food.calories)} style={{ background: "none", border: "none", color: "#c9a0a0" }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ TAB: BURN / WORKOUTS ═══ */}
        {activeTab === "burn" && (
          <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
              <div style={{ color: "#8B7355", fontSize: 10, textTransform: "uppercase" }}>Total Energy Expended</div>
              <div style={{ color: "#3D2B1F", fontWeight: 900, fontSize: 32 }}>{caloriesBurned} <span style={{ color: "#b5a090", fontSize: 16, fontWeight: 400 }}>kcal burned</span></div>
            </div>

            {["strength", "basketball", "cardio_recovery"].map(cat => (
              <div key={cat} style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
                <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 13, marginBottom: 10, textTransform: "uppercase" }}>{cat}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {workoutPresets.filter(w => w.category === cat).map(workout => (
                    <button key={workout.name} onClick={() => handleLogWorkoutPreset(workout)} style={{
                      padding: "10px 12px", borderRadius: 10, border: "1px solid #7A9E5E", background: "#f4faf0", display: "flex", justifyContent: "space-between", alignItems: "center", textTransform: "left"
                    }}>
                      <div>{workout.emoji} <strong>{workout.name}</strong></div>
                      <span style={{ color: "#2D4A22", fontWeight: 700 }}>+{workout.caloriesBurned} kcal</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
              <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>🔥 Log Custom Workout Activity</div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10, marginBottom: 10 }}>
                <input type="text" placeholder="Activity Description" value={customWorkoutInput} onChange={e => setCustomWorkoutInput(e.target.value)} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #e8ddd0" }} />
                <input type="number" placeholder="kcal" value={customBurnInput} onChange={e => setCustomBurnInput(e.target.value)} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #e8ddd0" }} />
              </div>
              <button onClick={handleCustomWorkoutAdd} style={{ width: "100%", padding: "12px", borderRadius: 10, background: "#3D2B1F", color: "#fff", border: "none", fontWeight: 700 }}>Log Active Burn</button>
            </div>

            {loggedWorkouts.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {loggedWorkouts.map(w => (
                    <div key={w.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#F0F7EC", borderRadius: 10 }}>
                      <span>{w.emoji} {w.name}</span>
                      <span>{w.caloriesBurned} kcal <button onClick={() => deleteLoggedWorkout(w.id, w.caloriesBurned)} style={{ marginLeft: 8, background: "none", border: "none", color: "#c9a0a0" }}>✕</button></span>
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
            <div style={{ background: "linear-gradient(145deg, #2D4A22, #3D5A2A)", borderRadius: 20, padding: "32px 24px", textAlign: "center" }}>
              <div style={{ color: "#c9d8b5", fontSize: 11, textTransform: "uppercase" }}>Session Timer</div>
              <div style={{ color: "#F5F0E8", fontWeight: 900, fontSize: 64 }}>{formatTime(timerSeconds)}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
              <button onClick={isTimerRunning ? stopTimer : startTimer} style={{ padding: "16px", borderRadius: 14, background: "#2D4A22", color: "#E8C547", border: "none", fontWeight: 800 }}>
                {isTimerRunning ? "❚❚ PAUSE" : "▶ START"}
              </button>
              <button onClick={resetTimer} style={{ padding: "16px", borderRadius: 14, background: "#F9F6F1", border: "1px solid #e8ddd0" }}>Reset</button>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(61,43,31,0.08)", border: "1px solid #e8ddd0" }}>
              <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 13, marginBottom: 16 }}>⚖️ Weight Trackers</div>
              <input type="range" min="155" max="175" step="0.5" value={loggedWeight} onChange={e => handleWeightChange(e.target.value)} style={{ width: "100%", accentColor: "#2D4A22" }} />
              <div style={{ textAlign: "right", color: "#2D4A22", fontWeight: 800 }}>{loggedWeight} lbs</div>
            </div>
          </div>
        )}

        {/* ═══ TAB: GOALS ═══ */}
        {activeTab === "goals" && (
          <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1px solid #e8ddd0" }}>
              <div style={{ color: "#3D2B1F", fontWeight: 700, fontSize: 13, textTransform: "uppercase", marginBottom: 14 }}>💪 Targets</div>
              {constitutionData.goals.basketball.map((goal, i) => (
                <div key={i} style={{ padding: "10px 12px", background: "#F9F6F1", borderRadius: 10, marginTop: 6 }}>{goal}</div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ── BOTTOM TAB BAR ── */}
      <nav style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480, background: "#fff", borderTop: "1px solid #e8ddd0",
        display: "grid", gridTemplateColumns: "repeat(5, 1fr)", zIndex: 100
      }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: "10px 4px 12px", background: "transparent", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              borderTop: isActive ? "3px solid #2D4A22" : "3px solid transparent",
            }}>
              <span style={{ fontSize: 20 }}>{tab.emoji}</span>
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? "#2D4A22" : "#8B7355" }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}