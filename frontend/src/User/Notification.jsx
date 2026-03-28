// src/components/Notification.jsx
import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import TextCard from './TextCard'

function Notification() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch all notifications, newest first, in real-time
    const q = query(
      collection(db, 'notifications'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setNotifications(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className='p-6 space-y-4'>

      <h1 className='text-xl font-bold text-gray-800'>Notifications</h1>

      {/* Loading skeleton */}
      {loading && (
        <div className='space-y-3 animate-pulse'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='h-16 bg-gray-200 rounded-xl max-w-md' />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && notifications.length === 0 && (
        <p className='text-sm text-gray-400'>No notifications yet.</p>
      )}

      {/* Notifications list */}
      {!loading && notifications.map((notif) => (
        <TextCard
          key={notif.id}
          type={notif.type}
          message={notif.message}
          meta={
            notif.createdAt?.toDate
              ? notif.createdAt.toDate().toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''
          }
        />
      ))}

    </div>
  )
}

export default Notification