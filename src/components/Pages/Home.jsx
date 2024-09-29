import React from 'react'
import Navbar from '../Navbar/Navbar';
import LeftSide from '../Leftsidebar/LeftSide';
import RightSidebar from '../RightSidebar/RightSidebar';
import CardSection from '../Main/CardSection';
import Main from  "../Main/Main";

const Home = () => {
  return (
    <div className='w-full'>
        <div className='fixed top-0 z-10 w-full bg-white'>
        <Navbar></Navbar>
        <div className='flex bg-gray-100'>
            <div className='flex-auto w-[20%]fixed top-12'>
                <LeftSide></LeftSide>
            </div>
            <div className='flex-auto w-[60%] absolute left-[20%] top-14 bg-gray-100 rounded-xl'>
              <div className='w-[80%] mx-auto'>
              <CardSection></CardSection>
              <Main></Main>
              </div>
                          </div>
            <div className='flex w-[5%] right-0 justify-end relative '>
               <RightSidebar></RightSidebar>
            </div>



            
        </div>
        </div>
    </div>
  )
}
export  default Home;