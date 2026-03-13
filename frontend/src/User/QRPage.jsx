// src/User/QRPage.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import UserQR from './Userqr'

function QRPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-gray-600 text-lg">You need to be logged in to view your QR code.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#5352ed] text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-600 transition"
        >
          Go Home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <button
        onClick={() => navigate(-1)}
        className="self-start ml-4 text-gray-500 hover:text-gray-800 flex items-center gap-1 text-sm"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-gray-800">QR Based Entry</h1>
      <p className="text-gray-500 text-sm text-center max-w-sm">
        Show this QR code at the mess entrance. The staff will scan it to verify your identity.
      </p>

      <UserQR />
    </div>
  )
}

export default QRPage