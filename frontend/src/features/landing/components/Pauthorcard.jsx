import React from 'react'

function Pauthorcard(props) {
  return (
    <div className='flex flex-col gap-3 justify-center w-35'>
      <div className='h-40 w-35 bg-white flex rounded-4xl border-2 border-[#5352ed]'>
        <img src={props.link} className='h-full w-full object-cover rounded-4xl' />
      </div>
      <div className='text-black font-medium text-sm text-center w-full'>{props.name}</div>
    </div>
  )
}

export default Pauthorcard
