import React, { useState, useEffect, useRef } from 'react';

// Hardcoded core Fitness Constitution static fallback asset embedded to guarantee 
// seamless cross-environment compilation and continuous running without any resolution errors.
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
    "Monday": {
      "location": "The Edge SB (Weights)",
      "focus": "Upper Body Strength",
      "time_blocks": {
        "morning_600_730": ["Dynamic stretching/Chi Gong", "Short workout", "Breakfast & Coffee", "Get sunlight"],
        "work_hours_730_1730": ["Pushups/Core between meetings", "Eat snacks", "Lunch 12:00-12:30"],
        "after_work_1730_2000": ["Full Upper Body Workout (Chest, Back, Shoulders, Biceps, Triceps, Traps)", "Dinner"]
      }
    },
    "Tuesday": {
      "location": "The Edge Essex",
      "focus": "Basketball Workout & Legs",
      "time_blocks": {
        "morning_600_730": ["Dynamic stretching/Chi Gong", "Short workout", "Breakfast & Coffee", "Get sunlight"],
        "work_hours_730_1730": ["Pushups/Core between meetings", "Eat snacks", "Lunch 12:00-12:30"],
        "after_work_1730_2000": ["Basketball workout (Shooting, Ball handling, Skill moves, Jumping)", "Legs (Quads, Hamstrings, Calves, Tibialis, Feet)", "Dinner"]
      }
    },
    "Wednesday": {
      "location": "Home Workout",
      "focus": "Home Maintenance & Light Strength",
      "time_blocks": {
        "morning_600_730": ["Dynamic stretching/Chi Gong", "Short workout", "Breakfast & Coffee", "Get sunlight"],
        "work_hours_730_1730": ["Pushups/Core between meetings", "Eat snacks", "Lunch 12:00-12:30"],
        "after_work_1730_2000": ["Home workout (Body weight, Bands, Yoga, Plyometrics, Light strength)", "Dinner"]
      }
    },
    "Thursday": {
      "location": "Home / Running Path",
      "focus": "Cardio Run & Full Body Workout",
      "time_blocks": {
        "morning_600_730": ["Dynamic stretching/Chi Gong", "Short workout", "Breakfast & Coffee", "Get sunlight"],
        "work_hours_730_1730": ["Pushups/Core between meetings", "Eat snacks", "Lunch 12:00-12:30"],
        "after_work_1730_2000": ["Run (Cardio)", "Full Body Workout", "Dinner"]
      }
    },
    "Friday": {
      "location": "The Edge SB",
      "focus": "Full Body Workout",
      "time_blocks": {
        "morning_600_730": ["Dynamic stretching/Chi Gong", "Short workout", "Breakfast & Coffee", "Get sunlight"],
        "work_hours_730_1730": ["Pushups/Core between meetings", "Eat snacks", "Lunch 12:00-12:30"],
        "after_work_1730_2000": ["Full Body Workout", "Dinner"]
      }
    },
    "Saturday": {
      "location": "The Edge Essex",
      "focus": "Game Prep & Shooting Workout",
      "time_blocks": {
        "daytime": ["Full workout (Prep and maintenance for game day)", "Shooting workout at the Edge Essex (Shooting, Ball handling, Skill moves, Jumping)"]
      }
    },
    "Sunday": {
      "location": "BHS (Burlington High School)",
      "focus": "Men's League Game Day",
      "time_blocks": {
        "game_time": ["Men's League Basketball Game"]
      }
    }
  }
};

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function App() {
  // 1. Core State
  const [selectedDay, setSelectedDay] = useState("");
  const [todayDayString, setTodayDayString] = useState("");
  const [checklistStates, setChecklistStates] = useState({});
  const [loggedWeight, setLoggedWeight] = useState(170); // Default starting weight
  const [dailyProtein, setDailyProtein] = useState(0);
  const [caloriesLogged, setCaloriesLogged] = useState(0);
  const [waterLoggedOz, setWaterLoggedOz] = useState(0); // Gal target: 128 oz
  const [customProteinInput, setCustomProteinInput] = useState("");
  const [customCaloriesInput, setCustomCaloriesInput] = useState("");
  const [pushupCount, setPushupCount] = useState(0);
  
  // Custom Food bank logs
  const [customFoodsLogged, setCustomFoodsLogged] = useState([]);

  // Workout Timer States
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerIntervalRef = useRef(null);

  // Long-Term Constitution Goals State (Saved Globally)
  const [completedLongTermGoals, setCompletedLongTermGoals] = useState({});

  // Initialize day selection on mount
  useEffect(() => {
    const today = new Date();
    const dayName = DAYS_OF_WEEK[today.getDay()];
    setTodayDayString(dayName);
    setSelectedDay(dayName); // Default to current day
  }, []);

  // Load and persist states with LocalStorage
  useEffect(() => {
    if (!selectedDay) return;
    
    const keyPrefix = `bhgs_${selectedDay}_`;
    
    // Load checklist states
    const savedChecklist = localStorage.getItem(`${keyPrefix}checklist`);
    if (savedChecklist) {
      setChecklistStates(JSON.parse(savedChecklist));
    } else {
      setChecklistStates({});
    }

    // Load protein, calories & water
    const savedProtein = localStorage.getItem(`${keyPrefix}protein`);
    setDailyProtein(savedProtein ? parseInt(savedProtein, 10) : 0);

    const savedCalories = localStorage.getItem(`${keyPrefix}calories`);
    setCaloriesLogged(savedCalories ? parseInt(savedCalories, 10) : 0);

    const savedWater = localStorage.getItem(`${keyPrefix}water`);
    setWaterLoggedOz(savedWater ? parseInt(savedWater, 10) : 0);

    // Load pushups
    const savedPushups = localStorage.getItem(`${keyPrefix}pushups`);
    setPushupCount(savedPushups ? parseInt(savedPushups, 10) : 0);

    // Load custom foods eaten
    const savedFoods = localStorage.getItem(`${keyPrefix}foods`);
    setCustomFoodsLogged(savedFoods ? JSON.parse(savedFoods) : []);

    // Load active timer state
    const savedTimer = localStorage.getItem(`${keyPrefix}timer`);
    setTimerSeconds(savedTimer ? parseInt(savedTimer, 10) : 0);
  }, [selectedDay]);

  // Load global metrics
  useEffect(() => {
    const storedWeight = localStorage.getItem('bhgs_global_weight');
    if (storedWeight) {
      setLoggedWeight(parseFloat(storedWeight));
    }

    const storedLongTermGoals = localStorage.getItem('bhgs_longterm_goals');
    if (storedLongTermGoals) {
      setCompletedLongTermGoals(JSON.parse(storedLongTermGoals));
    }
  }, []);

  // Save checklist helper
  const saveStateToLocalStorage = (key, value) => {
    if (!selectedDay) return;
    localStorage.setItem(`bhgs_${selectedDay}_${key}`, JSON.stringify(value));
  };

  const handleCheckChange = (itemKey, isChecked) => {
    const updated = { ...checklistStates, [itemKey]: isChecked };
    setChecklistStates(updated);
    saveStateToLocalStorage('checklist', updated);
  };

  const handleProteinAdd = (amount) => {
    const newProtein = Math.max(0, dailyProtein + amount);
    setDailyProtein(newProtein);
    if (selectedDay) {
      localStorage.setItem(`bhgs_${selectedDay}_protein`, newProtein);
    }
  };

  const handleCaloriesAdd = (amount) => {
    const newCal = Math.max(0, caloriesLogged + amount);
    setCaloriesLogged(newCal);
    if (selectedDay) {
      localStorage.setItem(`bhgs_${selectedDay}_calories`, newCal);
    }
  };

  const handleWaterAdd = (amountOz) => {
    const newWater = Math.max(0, waterLoggedOz + amountOz);
    setWaterLoggedOz(newWater);
    if (selectedDay) {
      localStorage.setItem(`bhgs_${selectedDay}_water`, newWater);
    }
  };

  const handlePushupIncrement = (amount) => {
    const nextVal = Math.max(0, pushupCount + amount);
    setPushupCount(nextVal);
    if (selectedDay) {
      localStorage.setItem(`bhgs_${selectedDay}_pushups`, nextVal);
    }
  };

  // Workout stopwatch actions
  const startWorkoutTimer = () => {
    if (isTimerRunning) return;
    setIsTimerRunning(true);
    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        const next = prev + 1;
        if (selectedDay) {
          localStorage.setItem(`bhgs_${selectedDay}_timer`, next);
        }
        return next;
      });
    }, 1000);
  };

  const stopWorkoutTimer = () => {
    clearInterval(timerIntervalRef.current);
    setIsTimerRunning(false);
  };

  const resetWorkoutTimer = () => {
    clearInterval(timerIntervalRef.current);
    setIsTimerRunning(false);
    setTimerSeconds(0);
    if (selectedDay) {
      localStorage.setItem(`bhgs_${selectedDay}_timer`, 0);
    }
  };

  // Format stopwatch helper
  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [
      hrs > 0 ? String(hrs).padStart(2, '0') : null,
      String(mins).padStart(2, '0'),
      String(secs).padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  const handleWeightChange = (newWeight) => {
    const rounded = parseFloat(newWeight).toFixed(1);
    setLoggedWeight(rounded);
    localStorage.setItem('bhgs_global_weight', rounded);
  };

  const toggleLongTermGoal = (goalText) => {
    const updated = { ...completedLongTermGoals, [goalText]: !completedLongTermGoals[goalText] };
    setCompletedLongTermGoals(updated);
    localStorage.setItem('bhgs_longterm_goals', JSON.stringify(updated));
  };

  // Fast reset for the day's dashboard
  const handleResetDay = () => {
    if (confirm(`Reset all logs, metrics, and checklists for ${selectedDay}?`)) {
      setChecklistStates({});
      setDailyProtein(0);
      setCaloriesLogged(0);
      setWaterLoggedOz(0);
      setPushupCount(0);
      setCustomFoodsLogged([]);
      setTimerSeconds(0);
      setIsTimerRunning(false);
      clearInterval(timerIntervalRef.current);

      const prefix = `bhgs_${selectedDay}_`;
      localStorage.removeItem(`${prefix}checklist`);
      localStorage.removeItem(`${prefix}protein`);
      localStorage.removeItem(`${prefix}calories`);
      localStorage.removeItem(`${prefix}water`);
      localStorage.removeItem(`${prefix}pushups`);
      localStorage.removeItem(`${prefix}foods`);
      localStorage.removeItem(`${prefix}timer`);
    }
  };

  // Fetch the schedule items for selected day
  const activeDaySchedule = constitutionData.weekly_schedule[selectedDay] || {
    location: "Rest Day",
    focus: "Recovery",
    time_blocks: { daytime: ["Active Stretching & Recovery Walk"] }
  };

  // Quick food options based directly on your Constitution
  const nutritionPresets = [
    { name: "Grilled Chicken Breast (150g)", protein: 40, calories: 220, category: "protein" },
    { name: "Sirloin Beef (150g)", protein: 35, calories: 290, category: "protein" },
    { name: "Garlic Butter Shrimp", protein: 28, calories: 180, category: "protein" },
    { name: "Premium Protein Shake", protein: 30, calories: 210, category: "protein" },
    { name: "Peanut Butter (2 tbsp)", protein: 8, calories: 190, category: "protein" },
    { name: "Sweet Potato (Baked)", protein: 2, calories: 160, category: "carbs" },
    { name: "Bowl of White Rice", protein: 4, calories: 200, category: "carbs" },
    { name: "Broccoli & Spinach Bowl", protein: 3, calories: 60, category: "fiber" },
    { name: "Watermelon Wedge", protein: 1, calories: 85, category: "fiber" },
    { name: "Banana", protein: 1, calories: 105, category: "fiber" },
    { name: "Yerba Prima Psyllium Shake", protein: 0, calories: 30, category: "fiber" },
    { name: "Body Armour Electrolyte Drink", protein: 0, calories: 90, category: "supplements_and_hydration" }
  ];

  const handleEatFoodPreset = (food) => {
    handleProteinAdd(food.protein);
    handleCaloriesAdd(food.calories);
    
    const newFoodEntry = {
      id: Date.now(),
      name: food.name,
      protein: food.protein,
      calories: food.calories,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const updatedFoods = [newFoodEntry, ...customFoodsLogged];
    setCustomFoodsLogged(updatedFoods);
    if (selectedDay) {
      localStorage.setItem(`bhgs_${selectedDay}_foods`, JSON.stringify(updatedFoods));
    }
  };

  const handleCustomFoodAdd = (e) => {
    e.preventDefault();
    const pVal = parseInt(customProteinInput, 10) || 0;
    const cVal = parseInt(customCaloriesInput, 10) || 0;
    if (!customProteinInput && !customCaloriesInput) return;

    const newFoodEntry = {
      id: Date.now(),
      name: `Custom Logged Intake`,
      protein: pVal,
      calories: cVal,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    handleProteinAdd(pVal);
    handleCaloriesAdd(cVal);

    const updatedFoods = [newFoodEntry, ...customFoodsLogged];
    setCustomFoodsLogged(updatedFoods);
    if (selectedDay) {
      localStorage.setItem(`bhgs_${selectedDay}_foods`, JSON.stringify(updatedFoods));
    }

    setCustomProteinInput("");
    setCustomCaloriesInput("");
  };

  const deleteLoggedFood = (foodId, pAmount, cAmount) => {
    const updated = customFoodsLogged.filter(f => f.id !== foodId);
    setCustomFoodsLogged(updated);
    if (selectedDay) {
      localStorage.setItem(`bhgs_${selectedDay}_foods`, JSON.stringify(updated));
    }
    handleProteinAdd(-pAmount);
    handleCaloriesAdd(-cAmount);
  };

  const getCommuteDetails = () => {
    const loc = activeDaySchedule.location || "";
    if (loc.includes("The Edge SB")) {
      return { text: "The Edge Burlington Gym (SB)", commute: "7-minute commute from home", icon: "🚗" };
    }
    if (loc.includes("The Edge Essex")) {
      return { text: "The Edge Essex Sports Center", commute: "20-minute commute from home", icon: "🚙" };
    }
    if (loc.includes("Home Workout")) {
      return { text: "Home HQ Base", commute: "No commute. Zero excuses.", icon: "🏠" };
    }
    if (loc.includes("BHS")) {
      return { text: "Burlington High School Gym", commute: "Sunday League Game-day commute", icon: "🏀" };
    }
    return { text: "Anywhere / Running Path", commute: "Unrestricted", icon: "🏃‍♂️" };
  };

  const commuteInfo = getCommuteDetails();

  // Calculate daily completion score (habits + schedule checkboxes)
  const calculateDailyCompletion = () => {
    const dailyHabitsKeys = constitutionData.daily_non_negotiables.map((_, i) => `daily_habit_${i}`);
    const timeBlocksKeys = Object.entries(activeDaySchedule.time_blocks).flatMap(([blockKey, tasks]) => 
      tasks.map((_, idx) => `schedule_${blockKey}_${idx}`)
    );
    
    const allKeys = [...dailyHabitsKeys, ...timeBlocksKeys];
    if (allKeys.length === 0) return 100;

    const completedCount = allKeys.filter(k => !!checklistStates[k]).length;
    return Math.round((completedCount / allKeys.length) * 100);
  };

  const completionPct = calculateDailyCompletion();

  return (
    <div className="bg-[#0f1015] min-h-screen text-gray-200 font-sans pb-16">
      
      {/* 1. TOP HEADER HUD */}
      <header className="border-b border-gray-800 bg-[#14151c] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="bg-brand-500 text-white rounded-lg p-2.5 font-sporty font-bold tracking-widest text-xl shadow-md border border-brand-100 flex items-center justify-center">
              🏀 BHGS
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-sporty tracking-tight text-white flex items-center gap-2">
                BALL HARD <span className="text-brand-500 font-black animate-pulse-glow">GET SHREDDED</span>
              </h1>
              <p className="text-xs text-gray-400 font-medium">YOUR PERSONAL ATHLETIC FITNESS CONSTITUTION</p>
            </div>
          </div>

          {/* Quick Metrics & Streak Indicator */}
          <div className="flex items-center gap-4 text-xs md:text-sm bg-gray-900 border border-gray-800 p-2 rounded-xl">
            <div className="px-3 border-r border-gray-800">
              <span className="text-gray-400 block text-[10px] tracking-widest uppercase">Target Weight</span>
              <span className="font-sporty font-bold text-white text-sm">160 lbs</span>
            </div>
            <div className="px-3 border-r border-gray-800">
              <span className="text-gray-400 block text-[10px] tracking-widest uppercase">Current Gauge</span>
              <span className="font-sporty font-bold text-brand-500 text-sm">{loggedWeight} lbs</span>
            </div>
            <div className="px-3">
              <span className="text-gray-400 block text-[10px] tracking-widest uppercase">Target BF%</span>
              <span className="font-sporty font-bold text-neonGreen text-sm">15%</span>
            </div>
          </div>

        </div>
      </header>

      {/* 2. MAIN SCREEN BODY */}
      <main className="max-w-7xl mx-auto px-4 mt-8">
        
        {/* Dynamic Day Selector Banner */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white tracking-wide uppercase flex items-center gap-2">
              <span className="text-brand-500">📅</span> Weekly Schedule Matrix
            </h2>
            <span className="text-xs text-gray-400">Select any day to view &amp; log schedule</span>
          </div>
          
          <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
            {DAYS_OF_WEEK.map((day) => {
              const isToday = day === todayDayString;
              const isSelected = day === selectedDay;
              
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    isSelected 
                      ? "bg-brand-500/10 border-brand-500 text-white shadow-md neon-glow-brand" 
                      : "bg-panelBg border-gray-800 hover:border-gray-700 text-gray-400"
                  }`}
                >
                  <span className="text-[10px] tracking-wider uppercase opacity-80">{day.substring(0, 3)}</span>
                  <span className="text-sm font-sporty font-bold tracking-tight mt-1">
                    {day === "Sunday" ? "League" : constitutionData.weekly_schedule[day]?.focus.split(" ")[0] || "Rest"}
                  </span>
                  {isToday && (
                    <span className="mt-1 px-1.5 py-0.5 bg-brand-500 text-[8px] text-white font-bold rounded uppercase tracking-widest scale-90">
                      TODAY
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. CORE SUB-DASHBOARD PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT PANELS: CHECKLISTS & TIMEBLOCKS (8 COLUMNS) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* PANEL: TODAYS TARGET & COMMUTE INFO */}
            <div className="p-6 bg-[#1a1b23] border border-gray-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-1 bg-brand-500/20 text-brand-500 border border-brand-500/30 text-xs font-bold rounded-lg uppercase tracking-wider font-sporty">
                    {selectedDay}'s Focus
                  </span>
                  <span className="text-gray-400 text-xs flex items-center gap-1">
                    📍 {commuteInfo.icon} {commuteInfo.text}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {activeDaySchedule.focus}
                </h2>
                <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                  🚗 Commute: <span className="text-brand-500 font-semibold">{commuteInfo.commute}</span>
                </p>
              </div>

              {/* Workout Checklist Target Meter */}
              <div className="bg-gray-950/40 p-4 rounded-xl border border-gray-800/60 w-full md:w-auto text-center md:text-left flex flex-col items-center">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Day Completion Score</div>
                <div className="font-sporty font-black text-2xl text-neonGreen">
                  {completionPct}%
                </div>
              </div>
            </div>

            {/* PANEL: DAILY NON-NEGOTIABLE CORE HABITS */}
            <div className="bg-panelBg border border-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                <h3 className="font-sporty font-bold text-white uppercase text-sm tracking-widest flex items-center gap-2">
                  <span className="text-neonCyan">⚡</span> Daily Non-Negotiables
                </h3>
                <span className="text-xs text-gray-400">Must hit these every single day</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {constitutionData.daily_non_negotiables.map((habit, index) => {
                  const habitKey = `daily_habit_${index}`;
                  const isChecked = !!checklistStates[habitKey];
                  return (
                    <label 
                      key={habitKey}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                        isChecked 
                          ? "bg-neonCyan/5 border-neonCyan/30 text-gray-400" 
                          : "bg-gray-900/40 border-gray-800/80 text-gray-200 hover:border-gray-700"
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleCheckChange(habitKey, e.target.checked)}
                        className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-neonCyan focus:ring-0 focus:ring-offset-0 mt-0.5"
                      />
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${isChecked ? 'line-through text-gray-500' : ''}`}>
                          {habit}
                        </span>
                        {habit.includes("meditation") && (
                          <span className="text-[10px] text-neonCyan mt-0.5 font-sporty">HEADSPACE APP REQUIRED</span>
                        )}
                        {habit.includes("Kegel") && (
                          <span className="text-[10px] text-brand-500 mt-0.5 font-sporty">THE COACH APP REQUIRED</span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* PANEL: INTERACTIVE TIMELINE WORKOUT & TASKS */}
            <div className="bg-panelBg border border-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-3">
                <h3 className="font-sporty font-bold text-white uppercase text-sm tracking-widest flex items-center gap-2">
                  <span className="text-brand-500">🏆</span> Exercises &amp; Schedule Blocks
                </h3>
                <span className="text-xs bg-brand-500/20 text-brand-500 px-2 py-0.5 rounded font-sporty text-[10px]">
                  TIME CONSTRAINTS APPLIED
                </span>
              </div>

              {/* Check if weekday or weekend for structured timeline */}
              <div className="space-y-6">
                {Object.entries(activeDaySchedule.time_blocks).map(([blockKey, tasks]) => {
                  // Beautify names of time blocks
                  let title = "Day's Timeline Block";
                  let timeRange = "";
                  let accentColor = "border-l-brand-500";
                  let textColor = "text-brand-500";

                  if (blockKey === "morning_600_730") {
                    title = "BEFORE WORK (6:00 - 7:30 AM)";
                    timeRange = "Prime routine setup & dynamic activation";
                    accentColor = "border-l-neonCyan";
                    textColor = "text-neonCyan";
                  } else if (blockKey === "work_hours_730_1730") {
                    title = "WORK HOURS (7:30 AM - 5:30 PM)";
                    timeRange = "Meeting intervals / Micro stretching & snacks";
                    accentColor = "border-l-neonAmber";
                    textColor = "text-neonAmber";
                  } else if (blockKey === "after_work_1730_2000") {
                    title = "AFTER WORK (5:30 - 8:00 PM)";
                    timeRange = "Execution block. Heavy lifting / Game prep";
                    accentColor = "border-l-neonGreen";
                    textColor = "text-neonGreen";
                  } else if (blockKey === "daytime") {
                    title = "SATURDAY EXECUTION MATRIX";
                    timeRange = "Full game prep & skill building";
                  } else if (blockKey === "game_time") {
                    title = "SUNDAY SHOWTIME (MENS LEAGUE)";
                    timeRange = "Match execution at BHS";
                  }

                  return (
                    <div key={blockKey} className={`pl-4 border-l-4 ${accentColor} bg-gray-900/25 p-4 rounded-r-xl`}>
                      <div className="mb-3">
                        <span className={`text-xs font-sporty font-bold tracking-wider ${textColor} uppercase block`}>
                          {title}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          {timeRange}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {tasks.map((task, idx) => {
                          const taskKey = `schedule_${blockKey}_${idx}`;
                          const isChecked = !!checklistStates[taskKey];
                          return (
                            <label 
                              key={taskKey}
                              className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${
                                isChecked ? "bg-gray-950/20 opacity-60" : "bg-[#1f202a]/60 hover:bg-[#1f202a]"
                              }`}
                            >
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => handleCheckChange(taskKey, e.target.checked)}
                                className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-brand-500 focus:ring-0 mt-0.5"
                              />
                              <div className="flex-grow">
                                <span className={`text-sm ${isChecked ? 'line-through text-gray-500' : 'text-gray-200 font-medium'}`}>
                                  {task}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>

                      {/* Special Dynamic Interactive Widget inside work hours block */}
                      {blockKey === "work_hours_730_1730" && (
                        <div className="mt-4 p-3 bg-gray-950/60 rounded-xl border border-gray-800 flex items-center justify-between gap-4">
                          <div>
                            <span className="text-xs font-bold text-white block uppercase tracking-wide">
                              Pushup/Core Counter
                            </span>
                            <span className="text-[10px] text-gray-400 block">
                              "Between meetings execution" from your Constitution
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handlePushupIncrement(-5)}
                              className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-gray-300 hover:bg-gray-700 active:scale-95"
                            >
                              -5
                            </button>
                            <span className="px-4 py-1.5 bg-brand-500/10 text-brand-500 font-sporty font-bold text-lg rounded-lg border border-brand-500/20">
                              {pushupCount}
                            </span>
                            <button 
                              onClick={() => handlePushupIncrement(5)}
                              className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-gray-300 hover:bg-gray-700 active:scale-95"
                            >
                              +5
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>

            {/* PANEL: DYNAMIC INTERACTIVE FUEL INTAKE PICKER (FOOD BANK) */}
            <div className="bg-panelBg border border-gray-800 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-800 pb-4">
                <div>
                  <h3 className="font-sporty font-bold text-white uppercase text-sm tracking-widest flex items-center gap-2">
                    <span className="text-neonGreen">🍗</span> Interactive Kitchen Fuel bank
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Click any food from your Constitution list below to log Protein &amp; Calories automatically!
                  </p>
                </div>

                {/* Protein Counter Goal Meter */}
                <div className="bg-gray-950/80 rounded-xl p-3 border border-gray-800 flex items-center gap-3">
                  <div className="text-center">
                    <span className="text-[9px] text-gray-400 tracking-wider uppercase block">Total Protein</span>
                    <span className={`font-sporty font-black text-lg ${dailyProtein >= 160 ? 'text-neonGreen' : 'text-white'}`}>
                      {dailyProtein}g
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">/</div>
                  <div className="text-center">
                    <span className="text-[9px] text-gray-400 tracking-wider uppercase block">Target</span>
                    <span className="font-sporty font-bold text-gray-300 text-sm">160g</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar of Protein Target */}
              <div className="mb-6">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-400 font-medium">Daily Protein Goal Progress</span>
                  <span className="text-brand-500 font-bold font-sporty">
                    {Math.min(100, Math.round((dailyProtein / 160) * 100))}%
                  </span>
                </div>
                <div className="w-full bg-gray-900 h-2.5 rounded-full overflow-hidden border border-gray-800">
                  <div 
                    className="bg-gradient-to-r from-brand-500 to-neonCyan h-full transition-all duration-300" 
                    style={{ width: `${Math.min(100, (dailyProtein / 160) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Grid of Food Categories (from Constitution) */}
              <div className="space-y-6">
                
                {/* 1. Protein Options */}
                <div>
                  <span className="text-xs font-sporty font-bold text-gray-300 uppercase tracking-widest block mb-2.5 border-b border-gray-800/50 pb-1">
                    🥩 Proteins (High Priority)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {nutritionPresets.filter(f => f.category === "protein").map(food => (
                      <button
                        key={food.name}
                        onClick={() => handleEatFoodPreset(food)}
                        className="px-3 py-1.5 rounded-lg bg-[#242531] border border-gray-700/60 text-xs text-white hover:border-brand-500 hover:bg-[#2c2d3d] flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <span className="font-bold text-brand-500">+{food.protein}g</span>
                        <span>{food.name.split(" ")[0]}</span>
                        <span className="text-[10px] text-gray-400">({food.calories} kcal)</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Fibers Options */}
                <div>
                  <span className="text-xs font-sporty font-bold text-neonGreen uppercase tracking-widest block mb-2.5 border-b border-gray-800/50 pb-1">
                    🥬 Fiber &amp; Vegetables
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {nutritionPresets.filter(f => f.category === "fiber").map(food => (
                      <button
                        key={food.name}
                        onClick={() => handleEatFoodPreset(food)}
                        className="px-3 py-1.5 rounded-lg bg-[#1f2620] border border-green-900/40 text-xs text-white hover:border-neonGreen hover:bg-[#28322a] flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <span className="font-bold text-neonGreen">+{food.protein}g</span>
                        <span>{food.name}</span>
                        <span className="text-[10px] text-gray-400">({food.calories} kcal)</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Carbs & Supplements */}
                <div>
                  <span className="text-xs font-sporty font-bold text-neonCyan uppercase tracking-widest block mb-2.5 border-b border-gray-800/50 pb-1">
                    🍚 Complex Carbs, Supplement &amp; Hydration
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {nutritionPresets.filter(f => ["carbs", "supplements_and_hydration"].includes(f.category)).map(food => (
                      <button
                        key={food.name}
                        onClick={() => handleEatFoodPreset(food)}
                        className="px-3 py-1.5 rounded-lg bg-[#1f2831] border border-cyan-900/40 text-xs text-white hover:border-neonCyan hover:bg-[#25323d] flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <span className="font-bold text-neonCyan">Log Preset</span>
                        <span>{food.name}</span>
                        <span className="text-[10px] text-gray-400">({food.calories} kcal)</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Add Custom Calories & Protein Log form */}
              <form onSubmit={handleCustomFoodAdd} className="mt-6 p-4 bg-gray-950/60 rounded-xl border border-gray-800/80">
                <span className="text-xs font-bold text-white block uppercase tracking-wide mb-3">
                  Log Custom Intake (Unlisted Item)
                </span>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Protein (g)</label>
                    <input 
                      type="number"
                      placeholder="e.g. 25"
                      value={customProteinInput}
                      onChange={(e) => setCustomProteinInput(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Calories (kcal)</label>
                    <input 
                      type="number"
                      placeholder="e.g. 350"
                      value={customCaloriesInput}
                      onChange={(e) => setCustomCaloriesInput(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1 flex items-end">
                    <button 
                      type="submit"
                      className="w-full py-1.5 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-sporty font-bold uppercase tracking-wide transition-all active:scale-95 h-[34px]"
                    >
                      LOG FOOD
                    </button>
                  </div>
                </div>
              </form>

              {/* Custom Food intake history logs for today */}
              {customFoodsLogged.length > 0 && (
                <div className="mt-6 border-t border-gray-800 pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                      Today's Logged Intakes
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Total Calories Logged: <span className="text-neonAmber font-bold">{caloriesLogged} kcal</span>
                    </span>
                  </div>

                  <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                    {customFoodsLogged.map((food) => (
                      <div key={food.id} className="flex items-center justify-between p-2.5 bg-gray-900/50 rounded-lg border border-gray-800/40 text-xs">
                        <div>
                          <span className="font-semibold text-white block">{food.name}</span>
                          <span className="text-[10px] text-gray-500">{food.time}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-brand-500 font-bold font-sporty">{food.protein}g Pro</span>
                          <span className="text-neonAmber font-bold font-sporty">{food.calories} kcal</span>
                          <button 
                            onClick={() => deleteLoggedFood(food.id, food.protein, food.calories)}
                            className="text-red-500 hover:text-red-400 hover:scale-110 p-1"
                            title="Delete Entry"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* RIGHT PANELS: ACTIVE TIMER, COMMUTES, GENERAL RULES, GOALS (4 COLUMNS) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* SUB-PANEL: STOPWATCH WORKOUT MINIMUM TRACKER */}
            <div className="bg-panelBg border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl"></div>
              
              <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                <h3 className="font-sporty font-bold text-white uppercase text-xs tracking-widest flex items-center gap-1.5">
                  <span className="text-brand-500 animate-pulse-glow">⏱️</span> Workout Session Timer
                </h3>
                <span className="text-[10px] text-gray-400 font-sporty">MIN 40 MINS DAILY Target</span>
              </div>

              {/* Countdown clock style circle */}
              <div className="flex flex-col items-center justify-center py-6 bg-gray-950/60 rounded-xl border border-gray-800/80 mb-4">
                <div className="font-sporty text-3xl font-black text-white tracking-widest leading-none mb-1">
                  {formatTime(timerSeconds)}
                </div>
                <div className="text-[9px] text-gray-400 uppercase tracking-widest font-sporty flex items-center gap-1">
                  {timerSeconds >= 2400 ? (
                    <span className="text-neonGreen font-bold flex items-center gap-0.5">
                      ✓ DAILY Target Met (40m)
                    </span>
                  ) : (
                    <span>Progress: {Math.min(100, Math.round((timerSeconds / 2400) * 100))}% of Daily Target</span>
                  )}
                </div>

                {/* Progress bar inside stopwatch */}
                <div className="w-11/12 bg-gray-900 h-1.5 rounded-full mt-3 overflow-hidden border border-gray-800/40">
                  <div 
                    className="bg-neonGreen h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (timerSeconds / 2400) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Stopwatch Action Controls */}
              <div className="grid grid-cols-3 gap-2">
                {!isTimerRunning ? (
                  <button 
                    onClick={startWorkoutTimer}
                    className="col-span-2 py-2 px-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold font-sporty uppercase tracking-widest text-center"
                  >
                    ▶ START
                  </button>
                ) : (
                  <button 
                    onClick={stopWorkoutTimer}
                    className="col-span-2 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold font-sporty uppercase tracking-widest text-center"
                  >
                    ❚❚ PAUSE
                  </button>
                )}
                <button 
                  onClick={resetWorkoutTimer}
                  className="py-2 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-bold font-sporty uppercase tracking-widest text-center"
                >
                  RESET
                </button>
              </div>
            </div>

            {/* HYDRATION HUD GAUGE (128 oz target) */}
            <div className="bg-panelBg border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                <h3 className="font-sporty font-bold text-white uppercase text-xs tracking-widest flex items-center gap-1.5">
                  <span className="text-neonCyan">💧</span> Daily Hydration Target
                </h3>
                <span className="text-[10px] text-neonCyan font-bold uppercase font-sporty">Goal: 1 Gallon</span>
              </div>

              <div className="flex items-center justify-between mb-4 bg-gray-950/40 p-3 rounded-xl border border-gray-800/60">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Total Intake</span>
                  <span className="font-sporty font-bold text-lg text-white">{waterLoggedOz} oz <span className="text-xs text-gray-500">/ 128 oz</span></span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Progress</span>
                  <span className="font-sporty font-bold text-lg text-neonCyan">{Math.min(100, Math.round((waterLoggedOz / 128) * 100))}%</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <button 
                  onClick={() => handleWaterAdd(16)}
                  className="py-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-neonCyan hover:bg-gray-800 text-xs font-bold text-white transition-all active:scale-95"
                >
                  +16 oz (Glass)
                </button>
                <button 
                  onClick={() => handleWaterAdd(32)}
                  className="py-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-neonCyan hover:bg-gray-800 text-xs font-bold text-white transition-all active:scale-95"
                >
                  +32 oz (Bottle)
                </button>
                <button 
                  onClick={() => handleWaterAdd(-16)}
                  className="py-2 bg-red-950/20 border border-red-900/40 rounded-lg hover:bg-red-900/20 text-xs text-red-400 transition-all active:scale-95"
                >
                  Subtract
                </button>
              </div>
            </div>

            {/* SUB-PANEL: WEIGHT DROPPING COMPANION (170 lbs -> 160 lbs) */}
            <div className="bg-panelBg border border-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                <h3 className="font-sporty font-bold text-white uppercase text-xs tracking-widest flex items-center gap-1.5">
                  <span className="text-neonCyan">⚖️</span> Weight Companion
                </h3>
                <span className="text-[10px] text-neonCyan font-bold uppercase font-sporty">Goal: 160 lbs</span>
              </div>

              {/* Range scale */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-sporty font-semibold mb-2">
                  <span className="text-gray-400">Target (160)</span>
                  <span className="text-white bg-brand-500/20 px-2 py-0.5 rounded border border-brand-500/20">{loggedWeight} lbs</span>
                  <span className="text-gray-400">Current Base (170)</span>
                </div>
                
                <input 
                  type="range"
                  min="155"
                  max="175"
                  step="0.5"
                  value={loggedWeight}
                  onChange={(e) => handleWeightChange(e.target.value)}
                  className="w-full accent-brand-500 bg-gray-900 rounded-lg appearance-none h-2 border border-gray-800 cursor-pointer"
                />
              </div>

              {/* Progress Milestones Display */}
              <div className="space-y-3 bg-gray-950/40 p-4 rounded-xl border border-gray-800/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Lbs remaining to target:</span>
                  <span className="font-sporty font-bold text-white">{(loggedWeight - 160).toFixed(1)} lbs</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Estimated Body Fat Goal:</span>
                  <span className="font-bold text-neonGreen">15% Target BF</span>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-gray-800/80 pt-2">
                  <span className="text-gray-400">Abs Visual Milestone:</span>
                  <span className="font-medium text-neonCyan">6-Pack Core Activation</span>
                </div>
              </div>
            </div>

            {/* SUB-PANEL: CONSTITUTION LONG TERM GOALS CHECKLIST */}
            <div className="bg-panelBg border border-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                <h3 className="font-sporty font-bold text-white uppercase text-xs tracking-widest flex items-center gap-1.5">
                  <span className="text-brand-500">🏆</span> Constitution Goal Milestones
                </h3>
                <span className="text-[10px] text-gray-400">GLOBAL CHECKLIST</span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Basketball Objectives</span>
                  <div className="space-y-2">
                    {constitutionData.goals.basketball.map((goal, i) => (
                      <label 
                        key={`lt_bask_${i}`}
                        className="flex items-start gap-2.5 p-2 bg-gray-900/40 rounded-lg border border-gray-800/60 hover:border-brand-500/30 cursor-pointer select-none transition-all"
                      >
                        <input 
                          type="checkbox"
                          checked={!!completedLongTermGoals[goal]}
                          onChange={() => toggleLongTermGoal(goal)}
                          className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-brand-500 focus:ring-0 mt-0.5"
                        />
                        <span className={`text-[11px] font-medium leading-relaxed ${completedLongTermGoals[goal] ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                          {goal}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Structural Foundation</span>
                  <div className="space-y-2">
                    {constitutionData.goals.body.structural_foundation.map((goal, i) => (
                      <label 
                        key={`lt_body_${i}`}
                        className="flex items-start gap-2.5 p-2 bg-gray-900/40 rounded-lg border border-gray-800/60 hover:border-brand-500/30 cursor-pointer select-none transition-all"
                      >
                        <input 
                          type="checkbox"
                          checked={!!completedLongTermGoals[goal]}
                          onChange={() => toggleLongTermGoal(goal)}
                          className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-brand-500 focus:ring-0 mt-0.5"
                        />
                        <span className={`text-[11px] font-medium leading-relaxed ${completedLongTermGoals[goal] ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                          {goal}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RESET BUTTON MATRIX FOR INDIVIDUAL LOG DATA */}
            <div className="text-center pt-2">
              <button
                onClick={handleResetDay}
                className="text-xs text-red-500 hover:text-red-400 border border-red-900/40 hover:border-red-500/50 bg-red-950/20 px-4 py-2 rounded-xl transition-all"
              >
                Reset Daily Checklist &amp; Counters
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* FOOTER WIDGET */}
      <footer className="mt-16 border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
        <p className="font-sporty">BALLHARD GET SHREDDED © 2026</p>
        <p className="mt-1">Dedicated to building elite basketball performance, core stability, and bulletproof health.</p>
      </footer>

    </div>
  );
}