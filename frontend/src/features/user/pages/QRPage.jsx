// src/User/QRPage.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import UserQR from '../components/Userqr'
import GPayQR from '../../../assets/gpay.png'

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

      <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
        <UserQR />

        <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Payment QR Code</h2>
          <img
            src={GPayQR}
            alt="Google Pay payment QR code"
            className="h-72 w-72 rounded-2xl border border-gray-100 bg-white object-contain p-3"
          />
          <p className="text-sm text-gray-500 text-center">
            Use this QR code for mess-related payments when instructed by the mess office.
          </p>
        </div>
      </div>
    </div>
  )
}

export default QRPage
