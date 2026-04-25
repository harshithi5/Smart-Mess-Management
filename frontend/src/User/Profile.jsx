import React, { useState, useEffect } from 'react'
import Avatar from '../assets/avatar.svg'
import BhumikaPhoto from '../assets/batwoman.png'
import HarshitPhoto from '../assets/batman.png'

import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

function getRollNo(email = '') {
  return email.split('@')[0].toUpperCase()
}
const STUDENT_DATA = {
  'b23144@students.iitmandi.ac.in': {
    name: 'Kumari Bhumika Meena',
    hostelBlock: 'B-20',
    affiliatedMess: 'Alder',
    avatarUrl: BhumikaPhoto,
  },
  'b23133@students.iitmandi.ac.in': {
    name: 'Harshit Singh',
    hostelBlock: 'B-9',
    affiliatedMess: 'Alder',
    avatarUrl: HarshitPhoto,
  },
}

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false)
        return
      }

      const email = user.email?.toLowerCase() || ''
      const hardcoded = STUDENT_DATA[email]

      if (hardcoded) {
        // Use hardcoded data for known students
        setProfile({
          name: hardcoded.name,
          email: user.email,
          rollNo: getRollNo(email),
          hostelBlock: hardcoded.hostelBlock,
          affiliatedMess: hardcoded.affiliatedMess,
          avatarUrl: hardcoded.avatarUrl,
        })
      } else {
        // Fallback for any other logged-in student — use Google profile info
        setProfile({
          name: user.displayName || 'Student',
          email: user.email,
          rollNo: getRollNo(email),
          hostelBlock: 'Not assigned',
          affiliatedMess: 'Not assigned',
          avatarUrl: user.photoURL || null,
        })
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className='min-h-screen flex items-center justify-center p-6 relative overflow-hidden'>

      {/* Background Shapes */}
      <div className='absolute w-72 h-72 bg-orange-400 rounded-full top-[-40px] left-[-50px] opacity-90'></div>
      <div className='absolute w-96 h-96 bg-red-400 rounded-full bottom-[-20px] right-[-90px] opacity-90'></div>

      <div className='relative bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center z-10'>

        {/* ── LOADING ── */}
        {loading && (
          <div className='animate-pulse space-y-4'>
            <div className='flex justify-center'>
              <div className='w-24 h-24 rounded-full bg-gray-200'></div>
            </div>
            <div className='h-5 bg-gray-200 rounded w-1/2 mx-auto'></div>
            <div className='space-y-3 mt-6'>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className='flex justify-between border-b pb-2'>
                  <div className='h-4 bg-gray-200 rounded w-1/3'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/3'></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── NOT LOGGED IN ── */}
        {!loading && !profile && (
          <div className='py-8'>
            <p className='text-gray-500 text-sm'>Sign in to view your profile.</p>
          </div>
        )}

        {/* ── PROFILE ── */}
        {!loading && profile && (
          <>
            <div className='flex justify-center'>
              <img
                src={profile.avatarUrl || Avatar}
                alt='Profile'
                className='w-24 h-24 rounded-full border-4 border-gray-200 object-cover'
                referrerPolicy='no-referrer'
              />
            </div>

            <h2 className='mt-4 text-xl font-semibold text-gray-800'>
              {profile.name}
            </h2>

            <div className='mt-6 space-y-3 text-sm text-gray-700'>
              <div className='flex justify-between border-b pb-2'>
                <span className='font-medium'>Roll No:</span>
                <span>{profile.rollNo || '—'}</span>
              </div>
              <div className='flex justify-between border-b pb-2'>
                <span className='font-medium'>Email ID:</span>
                <span className='break-all'>{profile.email}</span>
              </div>
              <div className='flex justify-between border-b pb-2'>
                <span className='font-medium'>Hostel Block:</span>
                <span>{profile.hostelBlock}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>Affiliated Mess:</span>
                <span>{profile.affiliatedMess}</span>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default Profile