import React, { useState, useEffect } from 'react'
import Avatar from '../assets/avatar.svg'

import { auth, db } from '../firebase'
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

function getRollNo(email = '') {
  return email.split('@')[0].toUpperCase()
}

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState('')

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (err) {
      console.error('Sign-in error:', err)
      setError('Sign-in failed: ' + err.message)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('=== AUTH STATE CHANGED ===')

      if (!user) {
        console.log('❌ No user logged in')
        setDebugInfo('No user logged in')
        setLoading(false)
        return
      }

      console.log('✅ User found:')
      console.log('   UID:', user.uid)
      console.log('   Email:', user.email)
      console.log('   Display Name:', user.displayName)
      setDebugInfo(`UID: ${user.uid} | Email: ${user.email}`)

      try {
        const docRef = doc(db, 'students', user.uid)
        console.log('📄 Fetching Firestore doc at: students/' + user.uid)

        const docSnap = await getDoc(docRef)
        console.log('📦 Doc exists?', docSnap.exists())

        if (docSnap.exists()) {
          const data = docSnap.data()
          console.log('📋 Doc data:', data)
          setProfile({
            ...data,
            rollNo: getRollNo(data.email),
          })
        } else {
          console.log('🆕 No doc found — creating new student doc...')
          const newStudent = {
            name: user.displayName || '',
            email: user.email || '',
            hostelBlock: '',
            affiliatedMess: '',
            avatarUrl: user.photoURL || '',
          }
          await setDoc(docRef, newStudent)
          console.log('✅ New doc created:', newStudent)
          setProfile({
            ...newStudent,
            rollNo: getRollNo(newStudent.email),
          })
        }
      } catch (err) {
        console.error('❌ Firestore error:', err)
        console.error('   Code:', err.code)
        console.error('   Message:', err.message)
        setError(`Error (${err.code}): ${err.message}`)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className='min-h-screen flex items-center justify-center p-6 relative overflow-hidden'>

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
        {!loading && !profile && !error && (
          <div className='py-8 space-y-4'>
            <p className='text-gray-600 text-sm'>Sign in to view your profile</p>
            <button
              onClick={handleGoogleSignIn}
              className='flex items-center gap-2 mx-auto px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition'
            >
              <img
                src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
                alt='Google'
                className='w-5 h-5'
              />
              Sign in with Google
            </button>
          </div>
        )}

        {/* ── ERROR — now shows the actual error message ── */}
        {!loading && error && (
          <div className='py-8 space-y-3'>
            <p className='text-red-500 text-sm font-medium'>⚠️ {error}</p>
            {/* Debug info box */}
            <div className='mt-4 p-3 bg-gray-100 rounded-lg text-left text-xs text-gray-500 break-all'>
              <p className='font-semibold mb-1'>Debug Info:</p>
              <p>{debugInfo || 'No auth info captured'}</p>
              <p className='mt-2 text-gray-400'>Check browser console (F12) for full logs</p>
            </div>
          </div>
        )}

        {/* ── PROFILE ── */}
        {!loading && !error && profile && (
          <>
            <div className='flex justify-center'>
              <img
                src={profile.avatarUrl || Avatar}
                alt='Profile'
                className='w-24 h-24 rounded-full border-4 border-gray-200 object-cover'
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
                <span>{profile.hostelBlock || 'Not assigned'}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>Affiliated Mess:</span>
                <span>{profile.affiliatedMess || 'Not assigned'}</span>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default Profile