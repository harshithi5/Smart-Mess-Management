import React from 'react'
import Avatar from '../assets/avatar.svg'

function Profile() {
  return (
    <div className='min-h-screen flex items-center justify-center p-6 relative overflow-hidden'>
      
      {/* Background Shapes */}
      <div className='absolute w-72 h-72 bg-orange-400 rounded-full top-[-40px] left-[-50px] opacity-90'></div>
      <div className='absolute w-96 h-96 bg-red-400 rounded-full bottom-[-20px] right-[-90px] opacity-90'></div>

      {/* Profile Card */}
      <div className='relative bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center z-10'>
        
        {/* Profile Picture */}
        <div className='flex justify-center'>
          <img 
            src={Avatar} 
            alt="Profile" 
            className='w-24 h-24 rounded-full border-4 border-gray-200'
          />
        </div>

        {/* Name */}
        <h2 className='mt-4 text-xl font-semibold text-gray-800'>
          Harshit Singh
        </h2>

        {/* Details */}
        <div className='mt-6 space-y-3 text-sm text-gray-700'>
          
          <div className='flex justify-between border-b pb-2'>
            <span className='font-medium'>Roll No:</span>
            <span>B23133</span>
          </div>

          <div className='flex justify-between border-b pb-2'>
            <span className='font-medium'>Email ID:</span>
            <span>b23133@students.iitmandi.ac.in</span>
          </div>

          <div className='flex justify-between border-b pb-2'>
            <span className='font-medium'>Hostel Block:</span>
            <span>Suvalsar</span>
          </div>

          <div className='flex justify-between'>
            <span className='font-medium'>Affiliated Mess:</span>
            <span>Alder</span>
          </div>

        </div>

      </div>

    </div>
  )
}

export default Profile