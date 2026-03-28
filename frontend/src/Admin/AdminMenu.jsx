// src/Admin/AdminMenu.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEALS = ["breakfast", "lunch", "dinner"];

const MEAL_TIMES = {
  breakfast: "7:30 AM – 9:30 AM",
  lunch: "12:00 PM – 2:00 PM",
  dinner: "7:30 PM – 9:30 PM",
};

const MEAL_ICONS = { breakfast: "🌅", lunch: "☀️", dinner: "🌙" };

// Fallback if Firestore has no data yet
const DEFAULT_MENU = {
  Monday: {
    breakfast: "Aloo Onion Paratha, Curd, Fruits/2 Eggs, Milk, Bread & Butter, Tea/Coffee, Sprouts",
    lunch: "Rajma, Cabbage-Matar, Jeera Rice, Roti, Curd, Green Salad, Lemon & Pickle",
    dinner: "Aloo Gobhi Masala, Arher Dal, White Rasgulla, Roti, Rice, Green Salad, Lemon & Pickle",
  },
  Tuesday: {
    breakfast: "Poori, Halwa, Curd, Fruits/2 Eggs, Daliya/Milk, Bread & Butter, Tea/Coffee, Sprouts",
    lunch: "Aloo Gazar Gobhi, Moong Masoor Dal, Rice, Roti, Bundi Raita, Green Salad, Lemon & Pickle",
    dinner: "Gravy Manchurian, Dal Makhni, Motichur Laddu, Roti, Rice, Green Salad, Lemon & Pickle",
  },
  Wednesday: {
    breakfast: "Chana Mix Paratha, Dhaniya Chutney, Curd, Fruits/2 Omelette, Milk, Bread & Butter, Tea/Coffee, Sprouts",
    lunch: "Kadhi Pakora, Aloo Zeera, Masala Papad/Fryums, Roti, Rice, Butter Milk, Green Salad, Lemon & Pickle",
    dinner: "Paneer/Chicken, Dal Fry, Shahi Tukda & Rabdi, Roti, Rice, Green Salad, Lemon & Pickle",
  },
  Thursday: {
    breakfast: "Idli, Sambhar & Chutney, Coconut Chutney, 2 Banana/2 Eggs, Daliya/Milk, Bread & Butter, Tea/Coffee, Sprouts",
    lunch: "Sitafal, White Chole, Masala Chaach, Poori, Rice, Green Salad, Lemon & Pickle",
    dinner: "Mix Veg (Gajar+Paneer or Mushroom+Bean+Gobi+Matar), Black Masoor Dal, Gulab Jamun, Roti, Rice, Green Salad, Lemon & Pickle",
  },
  Friday: {
    breakfast: "Uttapam, Sambhar, Fruits/2 Eggs, Daliya/Milk, Bread & Butter, Tea/Coffee, Sprouts",
    lunch: "Mix Dal, Dum Aloo/Kaala Chana, Green Chutney, Roti, Rice, Green Salad, Lemon & Pickle",
    dinner: "Paneer/Egg Curry, Roongi Dal, Balushai, Roti, Rice, Green Salad, Lemon & Pickle",
  },
  Saturday: {
    breakfast: "Methi/Palak Paratha, Aloo Tamatar Sabji, Milk, Bread & Butter, Tea/Coffee, Cornflakes, Sprouts",
    lunch: "Dry Paneer Bhurji/Egg Bhurji, Chana Dal, Fried Mirch, Roti, Khichdi, Green Salad, Lemon & Pickle",
    dinner: "Gazar Matar Shimla Mirch, Dal Tadka, Rice Kheer, Roti, Rice, Green Salad, Lemon & Pickle",
  },
  Sunday: {
    breakfast: "Masala Onion Dosa, Sambhar, 2 Eggs, Daliya/Milk, Bread & Butter, Tea/Coffee, Cornflakes, Sprouts",
    lunch: "Bhature, Chole, Roti, Rice, Salad, Lemon & Pickle",
    dinner: "Paneer Biryani/Chicken Biryani, Aloo Soyabean, Ice Cream, Veg Raita, Green Salad, Lemon & Pickle",
  },
};

function AdminMenu() {
  const todayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
  const [selectedDay, setSelectedDay] = useState(todayName);
  const [menu, setMenu] = useState(DEFAULT_MENU);
  const [editing, setEditing] = useState({}); // { breakfast: true } etc
  const [drafts, setDrafts] = useState({});   // local edits before saving
  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});
  const [loading, setLoading] = useState(true);

  // Load full menu from Firestore on mount
  useEffect(() => {
    async function loadMenu() {
      try {
        const snap = await getDocs(collection(db, "menu"));
        if (!snap.empty) {
          const data = {};
          snap.docs.forEach((d) => { data[d.id] = d.data(); });
          setMenu(data);
        }
        // else keep DEFAULT_MENU
      } catch (err) {
        console.error("Failed to load menu:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  const dayMenu = menu[selectedDay] || {};

  const startEdit = (meal) => {
    setEditing((e) => ({ ...e, [meal]: true }));
    setDrafts((d) => ({ ...d, [meal]: dayMenu[meal] }));
    setSaved((s) => ({ ...s, [meal]: false }));
  };

  const cancelEdit = (meal) => {
    setEditing((e) => ({ ...e, [meal]: false }));
    setDrafts((d) => ({ ...d, [meal]: "" }));
  };

  const saveEdit = async (meal) => {
    const newValue = drafts[meal]?.trim();
    if (!newValue) return;

    setSaving((s) => ({ ...s, [meal]: true }));
    try {
      // Update Firestore
      await setDoc(doc(db, "menu", selectedDay), {
        ...dayMenu,
        [meal]: newValue,
      });
      // Update local state
      setMenu((m) => ({
        ...m,
        [selectedDay]: { ...m[selectedDay], [meal]: newValue },
      }));
      setEditing((e) => ({ ...e, [meal]: false }));
      setSaved((s) => ({ ...s, [meal]: true }));
      setTimeout(() => setSaved((s) => ({ ...s, [meal]: false })), 2000);
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving((s) => ({ ...s, [meal]: false }));
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Weekly Menu</h1>
        <p className="text-sm text-gray-400 mt-1">
          Changes are saved instantly and reflected for all students.
        </p>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 flex-wrap">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => { setSelectedDay(day); setEditing({}); setDrafts({}); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition
              ${selectedDay === day
                ? "bg-violet-500 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-500"
              }
              ${day === todayName && selectedDay !== day ? "border-violet-200 text-violet-400" : ""}
            `}
          >
            {day.slice(0, 3)}
            {day === todayName && (
              <span className="ml-1 text-[10px] opacity-70">Today</span>
            )}
          </button>
        ))}
      </div>

      {/* Meal cards */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-gray-200 rounded-2xl" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {MEALS.map((meal) => (
            <div key={meal} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

              {/* Meal header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{MEAL_ICONS[meal]}</span>
                  <div>
                    <div className="font-semibold text-gray-800 capitalize">{meal}</div>
                    <div className="text-xs text-gray-400">{MEAL_TIMES[meal]}</div>
                  </div>
                </div>

                {!editing[meal] && (
                  <button
                    onClick={() => startEdit(meal)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-violet-400 hover:text-violet-500 transition"
                  >
                    ✏️ Edit
                  </button>
                )}

                {saved[meal] && (
                  <span className="text-xs text-green-500 font-medium">✅ Saved!</span>
                )}
              </div>

              {/* View mode */}
              {!editing[meal] && (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {dayMenu[meal] || "No menu set."}
                </p>
              )}

              {/* Edit mode */}
              {editing[meal] && (
                <div className="space-y-3">
                  <textarea
                    value={drafts[meal] || ""}
                    onChange={(e) => setDrafts((d) => ({ ...d, [meal]: e.target.value }))}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => cancelEdit(meal)}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdit(meal)}
                      disabled={saving[meal]}
                      className="px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold disabled:opacity-50 transition"
                    >
                      {saving[meal] ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminMenu;