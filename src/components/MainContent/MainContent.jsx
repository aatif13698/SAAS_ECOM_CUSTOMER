import React, { Suspense } from 'react'

import { Outlet } from 'react-router-dom'
import Loader1 from '../loader/Loader1'

const MainContent = () => {
  return (
    <div className='w-[100%]    '>
      <Suspense fallback={<InnerLoading/>}>
        <Outlet />
      </Suspense>
    </div>
  )
}

export default MainContent


function InnerLoading () {
  return ( 
    <div className='flex w-full h-full flex-col justify-center items-center'>
      <Loader1/>
    </div>
  )
}