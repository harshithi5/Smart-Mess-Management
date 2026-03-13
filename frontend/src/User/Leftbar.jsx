import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import Home from '../assets/home.svg';
import Search from '../assets/search.svg';
import Shelf from '../assets/shelflogo.svg';
import History from '../assets/history.svg';
import Profile from '../assets/profile.svg';
import QR from '../assets/qr1.svg';
import Coupon from '../assets/coupon2.svg';
import Complaint from '../assets/complaint2.svg';
import Notification from '../assets/notification.svg';
import Logout from '../assets/logout.svg';

function Leftbar() {
    const navigate = useNavigate();

    return (
        <div className='h-full w-full bg-white p-10 flex flex-col items-center gap-20'>
            {/* Logo */}
            <div className='flex items-center gap-2 w-full h-max'>
                <img src={Logo} className='h-12' />
                <div className='text-2xl font-semibold'>Mess Diary</div>
            </div>

            {/* Navigation Items */}
            <div className='w-full flex flex-col gap-6'>
                {/* Home */}
                <div
                    className="flex items-end gap-3 cursor-pointer group w-max"
                    onClick={() => navigate('/dashboard')}
                >
                    <img src={Home} className="h-6 group-hover:brightness-0 group-hover:grayscale transition-all" />
                    <div className="text-zinc-600 text-lg group-hover:text-black transition-all">Home</div>
                </div>

                {/* Profile */}
                <div
                    className="flex items-end gap-3 cursor-pointer group w-max"
                    onClick={() => navigate('/dashboard/profile')}
                >
                    <img src={Profile} className="h-6 group-hover:brightness-0 group-hover:grayscale transition-all" />
                    <div className="text-zinc-600 text-lg group-hover:text-black transition-all">Profile</div>
                </div>

                {/* QR */}
                <div className="flex items-end gap-3 cursor-pointer group w-max"
                    onClick={() => navigate('/dashboard/qr')}
                >
                    <img
                        src={QR}
                        className="h-6 transition-all group-hover:brightness-0 group-hover:grayscale"
                    />
                    <div className="text-zinc-600 text-lg group-hover:text-black transition-all">
                        Show QR
                    </div>
                </div>

                {/* Coupon */}
                <div className="flex items-end gap-3 cursor-pointer group w-max"
                    onClick={() => navigate('/dashboard/coupon')}
                >
                    <img
                        src={Coupon}
                        className="h-6 transition-all group-hover:brightness-0 group-hover:grayscale"
                    />
                    <div className="text-zinc-600 text-lg group-hover:text-black transition-all">
                        Get Coupon
                    </div>
                </div>

                {/* Complaint */}
                <div className="flex items-end gap-3 cursor-pointer group w-max"
                    onClick={() => navigate('/dashboard/complaint')}
                >
                    <img
                        src={Complaint}
                        className="h-6 transition-all group-hover:brightness-0 group-hover:grayscale"
                    />
                    <div className="text-zinc-600 text-lg group-hover:text-black transition-all">
                        Raise Complaint
                    </div>
                </div>

                {/* Notification */}
                <div className="flex items-end gap-3 cursor-pointer group w-max"
                    onClick={() => navigate('/dashboard/notification')}
                >
                    <img
                        src={Notification}
                        className="h-6 transition-all group-hover:brightness-0 group-hover:grayscale"
                    />
                    <div className="text-zinc-600 text-lg group-hover:text-black transition-all">
                        Notifications
                    </div>
                </div>

                {/* Logout */}
                <div className="flex items-end gap-3 cursor-pointer group w-max"
                    onClick={() => navigate('/')}                //edit it here
                >
                    <img
                        src={Logout}
                        className="h-6 transition-all group-hover:brightness-0 group-hover:grayscale"
                    />
                    <div className="text-zinc-600 text-lg group-hover:text-black transition-all">
                        Logout
                    </div>
                </div>

                
            </div>
        </div>
    );
}

export default Leftbar;
