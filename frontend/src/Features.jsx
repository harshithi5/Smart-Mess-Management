// src/Features.jsx
import React from 'react'
import Featurecard from './Featurecard'
import Books01 from './assets/books01.svg'
import Bell from './assets/Bell.svg'
import Graph from './assets/graph.svg'
import Cart from './assets/cart.svg'
import Calendar from './assets/calendar.svg'
import Custcare from './assets/custcare.svg'
import Complaint from './assets/complaint.svg'
import QR from './assets/qr.svg'
import Coupon from './assets/coupon.svg'
import Raise from './assets/raise.svg'

function Features() {
  return (
    <div className='w-full flex justify-center bg-zinc-200'>
      <div className='w-15/16 h-full bg-[#5352ed] flex flex-col gap-5 p-5 pl-15'>
        <div className='text-2xl text-white font-semibold'>Some of our Features include:</div>
        <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8'>
          <Featurecard content="Delay Alerts" link={Bell} />
          <Featurecard content="Rate Your Meal" link={Graph} />
          <Featurecard content="Raise Complaints" link={Complaint} />
          <Featurecard content="QR Based Entry" link={QR} path="/my-qr" />
          <Featurecard content="Mess Coupons" link={Coupon} />
          <Featurecard content="Transparent Allotments" link={Raise} />
        </div>
      </div>
    </div>
  )
}

export default Features