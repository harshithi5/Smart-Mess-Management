// src/User/Home.jsx
import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import { doc, getDoc, setDoc, updateDoc, increment, collection, onSnapshot } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { MESSES } from '../services/messService'

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const MEALS = ["breakfast", "lunch", "dinner"]

const MEAL_CONFIG = {
  breakfast: { icon: "🌅", label: "Breakfast", time: "7:30 – 9:30 AM",  color: "from-amber-50 to-orange-50"  },
  lunch:     { icon: "☀️", label: "Lunch",     time: "12:00 – 2:00 PM", color: "from-sky-50 to-blue-50"      },
  dinner:    { icon: "🌙", label: "Dinner",     time: "7:30 – 9:30 PM",  color: "from-violet-50 to-purple-50" },
}

const BEST_MESS_LAST_MONTH = {
  name: "Alder", rating: 4.6,
  highlight: "Consistently highest student satisfaction for 4 weeks running.",
}

const KNOW_YOUR_MESS = {
  Alder:  "Alder trees grow near rivers and wetlands. Their roots host nitrogen-fixing bacteria that enrich the soil. Lightweight yet durable, alder wood is prized for furniture and musical instruments.",
  Peepal: "The Peepal tree is sacred in Indian culture, known for releasing oxygen even at night. It is one of the longest-living trees and has deep roots in Ayurvedic medicine.",
  Oak:    "Oak is celebrated for its strength and longevity. Oak forests support extraordinary biodiversity and the wood has been used for centuries in shipbuilding, flooring, and wine barrels.",
  Pine:   "Pine trees thrive in harsh climates and are evergreen year-round. Their resin has been used in medicine and industry, and pine wood is among the most versatile building materials.",
  Tulsi:  "Tulsi, or Holy Basil, is revered in Indian tradition as the 'Queen of Herbs'. It purifies air, repels insects naturally, and has powerful adaptogenic properties.",
  Cedar:  "Cedar is renowned for its aromatic wood and natural resistance to decay. Cedar forests are ancient ecosystems and the wood is prized for its beauty and durability.",
}

const DEFAULT_MENU = {
  Monday:    { breakfast: "Aloo Onion Paratha, Curd, Fruits/2 Eggs, Milk, Bread & Butter, Tea/Coffee, Sprouts", lunch: "Rajma, Cabbage-Matar, Jeera Rice, Roti, Curd, Green Salad, Lemon & Pickle", dinner: "Aloo Gobhi Masala, Arher Dal, White Rasgulla, Roti, Rice, Green Salad, Lemon & Pickle" },
  Tuesday:   { breakfast: "Poori, Halwa, Curd, Fruits/2 Eggs, Daliya/Milk, Bread & Butter, Tea/Coffee, Sprouts", lunch: "Aloo Gazar Gobhi, Moong Masoor Dal, Rice, Roti, Bundi Raita, Green Salad, Lemon & Pickle", dinner: "Gravy Manchurian, Dal Makhni, Motichur Laddu, Roti, Rice, Green Salad, Lemon & Pickle" },
  Wednesday: { breakfast: "Chana Mix Paratha, Dhaniya Chutney, Curd, Fruits/2 Omelette, Milk, Bread & Butter, Tea/Coffee, Sprouts", lunch: "Kadhi Pakora, Aloo Zeera, Masala Papad/Fryums, Roti, Rice, Butter Milk, Green Salad, Lemon & Pickle", dinner: "Paneer/Chicken, Dal Fry, Shahi Tukda & Rabdi, Roti, Rice, Green Salad, Lemon & Pickle" },
  Thursday:  { breakfast: "Idli, Sambhar & Chutney, Coconut Chutney, 2 Banana/2 Eggs, Daliya/Milk, Bread & Butter, Tea/Coffee, Sprouts", lunch: "Sitafal, White Chole, Masala Chaach, Poori, Rice, Green Salad, Lemon & Pickle", dinner: "Mix Veg, Black Masoor Dal, Gulab Jamun, Roti, Rice, Green Salad, Lemon & Pickle" },
  Friday:    { breakfast: "Uttapam, Sambhar, Fruits/2 Eggs, Daliya/Milk, Bread & Butter, Tea/Coffee, Sprouts", lunch: "Mix Dal, Dum Aloo/Kaala Chana, Green Chutney, Roti, Rice, Green Salad, Lemon & Pickle", dinner: "Paneer/Egg Curry, Roongi Dal, Balushai, Roti, Rice, Green Salad, Lemon & Pickle" },
  Saturday:  { breakfast: "Methi/Palak Paratha, Aloo Tamatar Sabji, Milk, Bread & Butter, Tea/Coffee, Cornflakes, Sprouts", lunch: "Dry Paneer Bhurji/Egg Bhurji, Chana Dal, Fried Mirch, Roti, Khichdi, Green Salad, Lemon & Pickle", dinner: "Gazar Matar Shimla Mirch, Dal Tadka, Rice Kheer, Roti, Rice, Green Salad, Lemon & Pickle" },
  Sunday:    { breakfast: "Masala Onion Dosa, Sambhar, 2 Eggs, Daliya/Milk, Bread & Butter, Tea/Coffee, Cornflakes, Sprouts", lunch: "Bhature, Chole, Roti, Rice, Salad, Lemon & Pickle", dinner: "Paneer Biryani/Chicken Biryani, Aloo Soyabean, Ice Cream, Veg Raita, Green Salad, Lemon & Pickle" },
}

// ── Queue logic ────────────────────────────────────────────────────────────
// At 50% → 20 min queue. Each 10% above 50% adds 15 min.
function getQueueInfo(count, capacity) {
  const pct = (count / capacity) * 100
  if (pct < 50) {
    return {
      status: "free",
      label:  "Great time to visit!",
      sublabel: "No queue expected",
      color:  "bg-green-50 border-green-200",
      textColor: "text-green-700",
      badgeColor: "bg-green-100 text-green-700",
      barColor: "bg-green-400",
      icon: "✅",
    }
  }
  const extraBands = Math.floor((pct - 50) / 10)
  const queueMin   = 20 + extraBands * 15

  if (pct < 75) {
    return {
      status: "moderate",
      label:  `~${queueMin} min wait`,
      sublabel: "Moderate queue forming",
      color:  "bg-orange-50 border-orange-200",
      textColor: "text-orange-700",
      badgeColor: "bg-orange-100 text-orange-600",
      barColor: "bg-orange-400",
      icon: "⏳",
    }
  }
  return {
    status: "busy",
    label:  `~${queueMin} min wait`,
    sublabel: "Long queue — consider waiting",
    color:  "bg-red-50 border-red-200",
    textColor: "text-red-700",
    badgeColor: "bg-red-100 text-red-600",
    barColor: "bg-red-500",
    icon: "🔴",
  }
}

// ── Star Rating ────────────────────────────────────────────────────────────
function StarRating({ value, onChange, readonly = false, size = "text-3xl" }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map((star) => (
        <button key={star} disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`${size} transition-transform duration-100
            ${!readonly ? "cursor-pointer hover:scale-110 active:scale-95" : "cursor-default"}`}>
          <span className={`transition-all duration-150 ${star <= (hovered || value) ? "filter-none" : "opacity-25 grayscale"}`}>⭐</span>
        </button>
      ))}
    </div>
  )
}

// ── Rating Modal ───────────────────────────────────────────────────────────
function RatingModal({ onClose, onSubmit, todayRating, submitting }) {
  const [selected, setSelected] = useState(todayRating || 0)
  const [meal,     setMeal]     = useState("overall")
  const [comment,  setComment]  = useState("")
  const LABELS = ["", "Poor", "Below Average", "Average", "Good", "Excellent"]

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 flex flex-col gap-5">
        <div className="text-center">
          <div className="text-4xl mb-2">🍽️</div>
          <h2 className="text-xl font-bold text-gray-800">Rate Today's Meal</h2>
          <p className="text-gray-400 text-sm mt-1">Your feedback helps improve the mess</p>
        </div>
        <div className="flex gap-2 justify-center flex-wrap">
          {["overall", "breakfast", "lunch", "dinner"].map((m) => (
            <button key={m} onClick={() => setMeal(m)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition capitalize
                ${meal === m ? "bg-[#5352ed] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {m}
            </button>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2">
          <StarRating value={selected} onChange={setSelected} size="text-4xl" />
          <span className={`text-sm font-semibold transition-all ${selected ? "text-[#5352ed]" : "text-gray-300"}`}>
            {LABELS[selected] || "Tap to rate"}
          </span>
        </div>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)}
          placeholder="Any feedback? (optional)" rows={2}
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition" />
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={() => onSubmit({ rating: selected, meal, comment })}
            disabled={!selected || submitting}
            className="flex-1 py-2.5 rounded-xl bg-[#5352ed] text-white text-sm font-semibold hover:bg-indigo-600 disabled:opacity-40 transition">
            {submitting ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────
function Home() {
  const { user, userProfile } = useAuth()
  const today   = days[new Date().getDay()]
  const dateKey = new Date().toISOString().split('T')[0]

  const [menu,          setMenu]          = useState(DEFAULT_MENU[today])
  const [menuLoading,   setMenuLoading]   = useState(true)
  const [showRating,    setShowRating]    = useState(false)
  const [submitting,    setSubmitting]    = useState(false)
  const [todayRating,   setTodayRating]   = useState(0)
  const [avgRating,     setAvgRating]     = useState(null)
  const [ratingCount,   setRatingCount]   = useState(0)
  const [ratedToday,    setRatedToday]    = useState(false)
  const [ratingSuccess, setRatingSuccess] = useState(false)
  const [dinerCount,    setDinerCount]    = useState(0)

  const messName  = userProfile?.currentMess || "Alder"
  const messId    = MESSES.find(m => m.name === messName)?.id || "mess4"
  const capacity  = MESSES.find(m => m.name === messName)?.capacity || 120
  const queueInfo = getQueueInfo(dinerCount, capacity)
  const pct       = Math.min(Math.round((dinerCount / capacity) * 100), 100)

  // Fetch menu
  useEffect(() => {
    getDoc(doc(db, 'menu', today))
      .then(snap => { if (snap.exists()) setMenu(snap.data()) })
      .catch(console.error)
      .finally(() => setMenuLoading(false))
  }, [today])

  // Live diner count — filter expired client-side
  useEffect(() => {
    if (!messId) return
    const ref = collection(db, 'messes', messId, 'activeDiners')
    const unsub = onSnapshot(ref, (snap) => {
      const now    = new Date()
      const active = snap.docs.filter(d => new Date(d.data().expiresAt) > now)
      setDinerCount(active.length)
    })
    return () => unsub()
  }, [messId])

  // Ratings
  useEffect(() => {
    async function fetchRatings() {
      try {
        const snap = await getDoc(doc(db, 'ratings', dateKey))
        if (snap.exists()) {
          const d = snap.data()
          setAvgRating(d.total && d.count ? (d.total / d.count).toFixed(1) : null)
          setRatingCount(d.count || 0)
        }
        if (user) {
          const uSnap = await getDoc(doc(db, 'ratings', dateKey, 'userRatings', user.uid))
          if (uSnap.exists()) { setRatedToday(true); setTodayRating(uSnap.data().rating || 0) }
        }
      } catch (err) { console.error(err) }
    }
    fetchRatings()
  }, [dateKey, user])

  const handleRatingSubmit = async ({ rating, meal, comment }) => {
    if (!user || !rating) return
    setSubmitting(true)
    try {
      await setDoc(doc(db, 'ratings', dateKey, 'userRatings', user.uid), { rating, meal, comment, messName, submittedAt: new Date() })
      const rRef  = doc(db, 'ratings', dateKey)
      const rSnap = await getDoc(rRef)
      if (rSnap.exists()) await updateDoc(rRef, { total: increment(rating), count: increment(1) })
      else                await setDoc(rRef, { total: rating, count: 1, date: dateKey })
      setTodayRating(rating); setRatedToday(true); setRatingSuccess(true); setShowRating(false)
      setAvgRating(((avgRating ? parseFloat(avgRating) * ratingCount : 0) + rating) / (ratingCount + 1))
      setRatingCount(c => c + 1)
      setTimeout(() => setRatingSuccess(false), 3000)
    } catch (err) { console.error(err) }
    finally { setSubmitting(false) }
  }

  const knowYourMess = KNOW_YOUR_MESS[messName] || KNOW_YOUR_MESS.Alder

  return (
    <div className="p-5 md:p-8 flex flex-col gap-8 max-w-5xl mx-auto">

      {showRating && (
        <RatingModal onClose={() => setShowRating(false)} onSubmit={handleRatingSubmit}
          todayRating={todayRating} submitting={submitting} />
      )}

      {/* Best mess banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-5 text-white flex items-center justify-between shadow-lg shadow-orange-100">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">🏆 Best Mess Last Month</div>
          <div className="text-3xl font-black">{BEST_MESS_LAST_MONTH.name}</div>
          <div className="text-orange-100 text-sm mt-1">{BEST_MESS_LAST_MONTH.rating} ★ · {BEST_MESS_LAST_MONTH.highlight}</div>
        </div>
        <div className="text-6xl hidden md:block drop-shadow-lg">🥇</div>
      </div>

      {/* ── Live Mess Status — compact strip ── */}
      <div className={`rounded-2xl border px-5 py-3.5 flex items-center gap-4 transition-colors duration-500 ${queueInfo.color}`}>
        {/* Label */}
        <div className="shrink-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Live Diners</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-black ${queueInfo.textColor}`}>{dinerCount}</span>
            <span className="text-gray-400 text-sm font-medium">/ {capacity}</span>
          </div>
        </div>
        {/* Bar */}
        <div className="flex-1 relative">
          <div className="w-full bg-white/60 rounded-full h-2 overflow-hidden">
            <div className={`h-2 rounded-full transition-all duration-700 ${queueInfo.barColor}`}
              style={{ width: `${pct}%` }} />
          </div>
          <div className="absolute left-[50%] -top-0.5 w-px h-3 bg-orange-300 opacity-60" />
          <div className="absolute left-[75%] -top-0.5 w-px h-3 bg-red-300 opacity-60" />
        </div>
        {/* Status badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shrink-0 ${queueInfo.badgeColor}`}>
          <span>{queueInfo.icon}</span>
          <span>{queueInfo.label}</span>
        </div>
      </div>

      {/* Today's menu */}
      <div>
        <div className="mb-5">
          <h1 className="text-2xl font-black text-gray-900">Today's Menu</h1>
          <p className="text-gray-400 text-sm mt-0.5">{today}</p>
        </div>
        {menuLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
            {[1,2,3].map(i => <div key={i} className="h-44 bg-gray-100 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MEALS.map((meal) => {
              const cfg = MEAL_CONFIG[meal]
              return (
                <div key={meal} className={`bg-gradient-to-br ${cfg.color} rounded-2xl p-5 border border-white shadow-sm hover:shadow-md transition-shadow`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{cfg.icon}</span>
                    <div>
                      <div className="font-bold text-gray-800">{cfg.label}</div>
                      <div className="text-xs text-gray-400">{cfg.time}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{menu[meal]}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Bottom 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Wastage */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🍃</span>
            <h2 className="font-bold text-gray-800">Yesterday's Wastage</h2>
          </div>
          <div className="space-y-3 flex-1">
            {[["Breakfast", 12], ["Lunch", 25], ["Dinner", 18]].map(([label, kg]) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold text-gray-800">{kg} kg</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                    style={{ width: `${(kg / 30) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-50">Please don't waste food. Every meal counts. 🙏</p>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center justify-center gap-4">
          <div className="text-center">
            <div className="text-xl mb-1">⭐</div>
            <h2 className="font-bold text-gray-800">Rate Today's Food</h2>
            {avgRating && <p className="text-sm text-gray-500 mt-0.5">{avgRating} avg · {ratingCount} rating{ratingCount !== 1 ? "s" : ""}</p>}
          </div>
          {ratingSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-green-600 text-sm font-medium">✅ Thanks for rating!</div>
          )}
          {ratedToday ? (
            <div className="flex flex-col items-center gap-2">
              <StarRating value={todayRating} readonly size="text-2xl" />
              <p className="text-xs text-gray-400">You rated today's meal</p>
              <button onClick={() => setShowRating(true)} className="text-xs text-[#5352ed] underline">Change rating</button>
            </div>
          ) : (
            <button onClick={() => setShowRating(true)}
              className="w-full py-2.5 rounded-xl bg-[#5352ed] text-white text-sm font-semibold hover:bg-indigo-600 transition active:scale-95">
              Rate Now
            </button>
          )}
        </div>

        {/* Know your mess */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🌿</span>
            <h2 className="font-bold text-gray-800">Know Your Mess</h2>
          </div>
          <div className="mb-3">
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{messName}</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed flex-1">{knowYourMess}</p>
        </div>

      </div>
    </div>
  )
}

export default Home