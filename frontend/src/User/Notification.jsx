// src/User/Notification.jsx
import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, query, onSnapshot } from 'firebase/firestore'

function Notification() {
  const [notifications, setNotifications] = useState([])
  const [loading,       setLoading]       = useState(true)
  const [filter,        setFilter]        = useState('all') // 'all' | 'Admin' | 'Vendor'

  useEffect(() => {
    const q = query(collection(db, 'notifications'))
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      setNotifications(data)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter((n) => n.type === filter)

  const adminCount  = notifications.filter(n => n.type === 'Admin').length
  const vendorCount = notifications.filter(n => n.type === 'Vendor').length

  const formatTime = (createdAt) => {
    if (!createdAt?.toDate) return ''
    const date    = createdAt.toDate()
    const now     = new Date()
    const diffMs  = now - date
    const diffMin = Math.floor(diffMs / 60000)
    const diffHr  = Math.floor(diffMs / 3600000)
    const diffDay = Math.floor(diffMs / 86400000)

    if (diffMin < 1)  return 'Just now'
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffHr  < 24) return `${diffHr}h ago`
    if (diffDay < 7)  return `${diffDay}d ago`
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const formatFullDate = (createdAt) => {
    if (!createdAt?.toDate) return ''
    return createdAt.toDate().toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  // Group notifications by date
  const grouped = filtered.reduce((acc, notif) => {
    const date = notif.createdAt?.toDate
      ? notif.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Earlier'
    if (!acc[date]) acc[date] = []
    acc[date].push(notif)
    return acc
  }, {})

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {notifications.length} total · {notifications.filter(n => {
              const diff = Date.now() - (n.createdAt?.seconds || 0) * 1000
              return diff < 86400000
            }).length} today
          </p>
        </div>

        {/* Unread dot */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#5352ed] animate-pulse" />
            <span className="text-xs font-semibold text-[#5352ed]">{notifications.length} new</span>
          </div>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all',    label: 'All',    count: notifications.length },
          { key: 'Admin',  label: 'Admin',  count: adminCount },
          { key: 'Vendor', label: 'Vendor', count: vendorCount },
        ].map(({ key, label, count }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition
              ${filter === key
                ? key === 'Admin'
                  ? 'bg-blue-500 text-white shadow-sm shadow-blue-200'
                  : key === 'Vendor'
                  ? 'bg-green-500 text-white shadow-sm shadow-green-200'
                  : 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
              }`}>
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
              ${filter === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          {[1,2,3,4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-1/4" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="text-5xl">🔔</div>
          <p className="text-gray-500 font-medium">No notifications yet</p>
          <p className="text-gray-400 text-sm text-center">
            {filter !== 'all'
              ? `No ${filter.toLowerCase()} notifications found.`
              : "You'll see updates from your mess and admin here."}
          </p>
        </div>
      )}

      {/* Grouped notifications */}
      {!loading && Object.entries(grouped).map(([date, notifs]) => (
        <div key={date} className="space-y-3">

          {/* Date separator */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{date}</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Cards */}
          {notifs.map((notif) => {
            const isAdmin  = notif.type === 'Admin'
            const isVendor = notif.type === 'Vendor'

            return (
              <div key={notif.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 flex gap-4 group">

                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg
                  ${isAdmin ? 'bg-blue-50' : 'bg-green-50'}`}>
                  {isAdmin ? '📢' : '🍽️'}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                      ${isAdmin
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-green-100 text-green-600'}`}>
                      {notif.type}
                    </span>
                    {isVendor && notif.messName && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-500 border border-orange-100">
                        {notif.messName}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed">{notif.message}</p>

                  <p className="text-xs text-gray-400 mt-1.5" title={formatFullDate(notif.createdAt)}>
                    {formatTime(notif.createdAt)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      ))}

    </div>
  )
}

export default Notification