import React from 'react'

function TextCard({ type, message }) {
  return (
    <div className='bg-white shadow-md rounded-xl p-4 border border-gray-200 max-w-md'>
      
      {/* Tag */}
      <div
        className={`text-xs font-semibold px-3 py-1 rounded-full w-fit 
        ${type === "Admin" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}
      >
        {type}
      </div>

      {/* Content */}
      <div className='mt-3 text-gray-700 text-sm'>
        {message}
      </div>

    </div>
  )
}

export default TextCard