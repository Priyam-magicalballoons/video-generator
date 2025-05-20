"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { seedFromExcel } from './actions/seed'
import { Loader2 } from 'lucide-react'

const page = () => {
  const router = useRouter()

  useEffect(()=>{
    router.push("/vitiligo-awareness-month/dashboard")
    // seedFromExcel()
  },[])
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='flex items-center flex-row gap-2'>
        <Loader2 className='animate-spin' />
        <p className='text-2xl'>Loading...</p>
      </div>
    </div>
  )
}

export default page