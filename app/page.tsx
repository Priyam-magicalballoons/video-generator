"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { seedFromExcel } from './actions/seed'

const page = () => {
  const router = useRouter()

  useEffect(()=>{
    router.push("/vitiligo-awareness-month/dashboard")
    // seedFromExcel()
  },[])
  return (
    <div>
      404 not found
    </div>
  )
}

export default page