import Modules from '@/components/Modules'
import React from 'react'

const page = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="w-full md:w-2/3 lg:w-1/3 md:border flex justify-start md:h-[95%] md:shadow-lg md:rounded-lg h-full sm:shadow-none sm:bottom-none flex-col py-5 bg-[#0c61aa]/10" >
        <Modules />
      </div>
    </div>
  )
}

export default page