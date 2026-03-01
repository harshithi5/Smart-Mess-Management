import React from 'react'
import Icon from './assets/MobileLib.svg'
import Food from './assets/food.svg'
import Food1 from './assets/food1.svg'
import Food2 from './assets/food2.svg'

function Welcome() {
  return (
    <div className='h-120 w-full bg-zinc-200 flex'>

        {/* left */}
      <div className='p-10 h-full w-3/5 flex flex-col gap-5'>
        <div className='flex flex-col border-b-1 w-2/3'>
          <div className='text-4xl font-bold text-[#5352ed]'>Welcome To Mess Diary</div>
          <div className='pl-1'>Everything about your mess, in one App</div>
        </div>
        <div className='text-sm flex flex-col gap-2 text-zinc-800'>
          <ul className="list-disc pl-5">
            <li><div>Get queue alerts.</div></li>
            <li><div>Rate your meal and drive the leaderboard.</div></li>
            <li><div>Get menu and delay updates.</div></li>
          </ul>
        </div>
        <button className="bg-[#ff7f56] text-white px-4 py-3 mt-10 rounded-lg font-medium h-12 cursor-pointer w-65 flex items-center justify-center">
                    Go To Dashboard
        </button>
        <div className='text-sm flex flex-col gap-1 mt-5'>
            <div className='text-[#5352ed]'>For any issues related to the app:</div>
            <div>Email at: b23133@students.iitmandi.ac.in</div>
        </div>
      </div>

      {/* right */}
      <div className='h-full w-2/5 relative'>
        <img src={Food2} className='h-125 absolute bottom-0 -left-25' />
      </div>
    </div>
  )
}

export default Welcome
