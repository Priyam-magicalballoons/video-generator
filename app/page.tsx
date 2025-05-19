"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { seedFromExcel } from './actions/seed'

const page = () => {
  const router = useRouter()

  useEffect(()=>{
    router.push("/dashboard")
  },[])
  return (
    <div>
      404 not found
    </div>
  )
}

export default page