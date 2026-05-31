import React from 'react'

function TextCard({ type, message, meta, messName }) {
  return (
    <div className='bg-white shadow-md rounded-xl p-4 border border-gray-200 max-w-md'>

      {/* Header row — tag + mess name + timestamp */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div
            className={`text-xs font-semibold px-3 py-1 rounded-full w-fit 
            ${type === "Admin" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}
          >
            {type}
          </div>

          {/* Mess name badge — only shown for Vendor messages */}
          {messName && type === "Vendor" && (
            <div className='text-xs font-medium px-2 py-1 rounded-full bg-orange-50 text-orange-500 border border-orange-100'>
              {messName}
            </div>
          )}
        </div>

        {/* Timestamp */}
        {meta && (
          <span className='text-xs text-gray-400'>{meta}</span>
        )}
      </div>

      {/* Content */}
      <div className='mt-3 text-gray-700 text-sm'>
        {message}
      </div>

    </div>
  )
}

export default TextCard