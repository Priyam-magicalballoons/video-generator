"use client"
import { logoutUser } from '@/app/actions/logout'
import AddDoctor from '@/components/AddDoctor'
import Card from '@/components/Card'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { cookies } from 'next/headers'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const page = () => {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const logout = async () => {
       logoutUser()
       router.push("/vitiligo-awareness-month/login")
    }
  return (
    <div className='w-full py-10 flex flex-col items-center sm:justify-center'>
      <div className='w-full pb-5 h-fit md:w-96 lg:w-1/4 border-gray-100 sm:shadow-lg rounded-lg border-1 sm:border md:border md:border-1 p-2 flex justify-center flex-col items-center'>
          <div className='w-full flex  justify-end'><Button className='border-primary' variant={"outline"} onClick={logout}><LogOut /></Button></div>
        <div className='w-[90%] justify-center py-10 gap-5 flex flex-col h-[85%]'>
            <div className='border border-primary rounded-xl py-2 hover:bg-primary group'>
            <Card icon='/icons/i-pledge.png' text='I Pledge Module' onclick={()=>{router.push("/vitiligo-awareness-month/i-pledge")}} />
            </div>
            <div className='border border-primary rounded-xl py-2 hover:bg-primary group cursor-pointer'>
            <Card icon='/icons/video.png' text='Video Module' onclick={()=>{router.push("/vitiligo-awareness-month/video-module")}} />

            </div>
            <div className='border border-primary rounded-xl py-2 hover:bg-primary group'>
            <Card icon='/icons/poster.png' text='Poster Module' onclick={()=>{router.push("/vitiligo-awareness-month/poster")}} />
            </div>
            <div className='border border-primary rounded-xl py-2 hover:bg-primary group'>
            <Card icon='/icons/view-reports.png' text='View Reports' onclick={()=>{router.push("/vitiligo-awareness-month/reports")}} />
            </div>
        </div>
        <div className='flex justify-end items-end w-full pb-5'>
            <Button variant={"ghost"} onClick={()=>setIsOpen(true)}>
            <img src="/icons/add-icon.png" alt="add-icon" height={40} width={40} />
            </Button>
        </div>
        <AddDoctor isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  )
}

export default page