import React from 'react'
import Logo from './assets/logo.svg'


function Navbar01() {
    return (
        <div className='flex h-20 bg-white w-full items-center justify-around'>

            {/* logo div */}
            <div className='flex items-end gap-2'>
                <img src={Logo} className='h-12' />
                <div className='md:text-2xl text-xl font-semibold'>Mess Diary</div>
            </div>

            {/* links div */}
            <div className='flex text-md lg:gap-20 md:gap-10 gap-5 h-12 items-end justify-center'>
                <div className='cursor-pointer'>Home</div>
                <div className='cursor-pointer'>About</div>
                <div className='cursor-pointer'>Vision</div>
                <div className='cursor-pointer'>Contact Us</div>
            </div>

            {/* buttons div */}
            <div className='flex h-12 items-end md:gap-3 gap-1'>
                <button className=" text-[#5352ed] px-4 py-2 rounded font-medium h-8 md:h-10 cursor-pointer flex items-center justify-center">
                    Login
                </button>
                <button className="bg-[#ff7f56] text-white px-4 py-2 rounded-lg font-medium h-8 md:h-10 cursor-pointer flex items-center justify-center">
                    Guest Login
                </button>
            </div>
        </div>
    )
}

export default Navbar01
