import React from 'react'
import Peepal from './assets/peepal.jpg'
import Oak from './assets/oak.jpg'
import Pine from './assets/pine.jpg'
import Alder from './assets/alder.jpg'
import Tulsi from './assets/tulsi.webp'
import Cedar from './assets/cedar.jpg'
import Pauthorcard from './Pauthorcard'


function Popularauthors() {
  return (
    <div className='w-full flex justify-center bg-zinc-200 pt-10'>
      <div className='w-15/16 h-full bg-zinc-200 flex flex-col gap-10 p-5'>
        <div className='text-2xl text-[#5352ed] font-semibold flex'>Our Messes</div>
        <div className='grid grid-cols-3 lg:grid-cols-6 gap-6 place-items-center'>
          <Pauthorcard link={Peepal} name="Peepal" />
          <Pauthorcard link={Oak} name="Oak" />
          <Pauthorcard link={Pine} name="Pine" />
          <Pauthorcard link={Alder} name="Alder" />
          <Pauthorcard link={Tulsi} name="Tulsi" />
          <Pauthorcard link={Cedar} name="Cedar" />
        </div>
      </div>
    </div>

  )
}

export default Popularauthors
