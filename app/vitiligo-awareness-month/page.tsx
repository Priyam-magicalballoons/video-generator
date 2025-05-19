"use client"

import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
    const router = useRouter()
    useEffect(()=>
    {
        router.push("/vitiligo-awareness-month/dashboard")
    },[])
  return (
    <div>404 Not 
        Found
    </div>
  )
}

export default page