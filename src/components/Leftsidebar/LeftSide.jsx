import React, { useContext } from 'react';
import "../../components/Leftsidebar/LeftSide.css";
import nature from "../../assets/images/nature.jpg";
import { Tooltip, Avatar } from '@material-tailwind/react';
import avatar from "../../assets/images/nexus.png";
import job from "../../assets/images/job.jpg";
import location from "../../assets/images/location.png";
import facebook from "../../assets/images/facebook.png";
import twitter from "../../assets/images/twitter.png";
import { AuthContext } from '../AppContext/AppContext';

const LeftSide = () => {
    const { user } = useContext(AuthContext); 
    return (
        <div className='flex flex-col lg:flex-col h-screen w-full lg:w-64  bg-white pb-8 border-2 rounded-xl shadow-2xl'>
            <div className='flex flex-col items-center relative'>
                <img className="h-32 w-full rounded-t-xl object-cover  hidden md:block lg:block" src={nature} alt='nature' />
                <div className='absolute top-24 right-5 sm:w-8' >
                    <Tooltip content="Profile" placement="top" >
                        <Avatar size='md' src={user?.photoURL || avatar} alt='avatar' />
                    </Tooltip>
                </div>
            </div>
            <div className='flex flex-col items-center pt-24 text-center relative bottom-14  '>
                <p className='font-Merriweather font-medium text-md text-gray-700 tracking-normal leading-none'>
                    {user?.email}
                </p>
                <p className='font-Merriweather font-medium text-xs text-gray-700 tracking-normal leading-none'>
                    Access exclusive tools & insights
                </p>
                <p className='font-Merriweather font-medium text-sm text-gray-700 tracking-normal leading-none py-2'>
                    Try premium for free
                </p>
            </div>
            <div className='flex flex-col items-start pl-4 pt-6 hidden md:block lg:block relative bottom-14 '>
                <div className='flex items-center pb-4'>
                    <img className='h-8 w-8' src={location} alt="location" />
                    <p className='font-Merriweather font-bold text-lg tracking-normal leading-none ml-2'>California</p>
                </div>
                <div className='flex items-center pb-4'>
                    <img className='h-8 w-8' src={job} alt="job" />
                    <p className='font-Merriweather font-bold text-lg tracking-normal leading-none ml-2'>React Developer</p>
                </div>
                <div className='flex flex-wrap justify-center items-center pt-4'>
                    <p className='font-Merriweather font-bold text-md text-[#0177b7] cursor-pointer mx-1'>Events</p>
                    <p className='font-Merriweather font-bold text-md text-[#0177b7] cursor-pointer mx-1'>Groups</p>
                    <p className='font-Merriweather font-bold text-md text-[#0177b7] cursor-pointer mx-1'>Follow</p>
                    <p className='font-Merriweather font-bold text-md text-[#0177b7] cursor-pointer mx-1'>More</p>
                </div>
            </div>
            <div className='ml-2 pt-6 relative bottom-14 '>
                <p className='font-Merriweather font-bold text-lg py-2 hidden md:block lg:block'>Social Profiles</p>
                <div className='flex items-center mb-3 hidden md:block lg:block'>
                    <img className='h-8 w-8 mr-2' src={facebook} alt='facebook' />
                    <p className='font-Merriweather font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-700 leading-none'>Social Network</p>
                </div>
                <div className='flex items-center mb-3 hidden md:block lg:block'>
                    <img className='h-8 w-8 mr-2' src={twitter} alt='twitter' />
                    <p className='font-Merriweather font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-700 leading-none'>Social Network</p>
                </div>
            </div>
            <div className='flex flex-col items-center pt-4'>
                <p className='font-Merriweather font-bold text-lg py-2'>Random Ads</p>
                <div className='changing'>
                    {/* Placeholder for ads */}
                </div>
            </div>
        </div>
    );
}

export default LeftSide;
