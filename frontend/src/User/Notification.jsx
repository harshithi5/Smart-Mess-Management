import React from 'react'
import TextCard from './TextCard'

function Notification() {
  return (
    <div className='p-6 space-y-4'>
      
      <TextCard 
        type="Admin" 
        message="Mess will remain closed tomorrow due to maintenance." 
      />

      <TextCard 
        type="Vendor" 
        message="New snacks have been added to the evening menu." 
      />

    </div>
  )
}

export default Notification