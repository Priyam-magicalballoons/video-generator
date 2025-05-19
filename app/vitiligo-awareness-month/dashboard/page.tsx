"use client"
import AddDoctor from '@/components/AddDoctor'
import Card from '@/components/Card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const page = () => {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
  return (
    <div className='w-full h-screen flex flex-col items-center'>
        <div className='w-[80%] py-10 gap-5 flex flex-col h-[85%]'>
            <div className='border border-primary rounded-xl py-2 hover:bg-primary group'>
            <Card icon='/icons/i-pledge.png' text='I Pledge Module' onclick={()=>{}} />
            </div>
            <div className='border border-primary rounded-xl py-2 hover:bg-primary group cursor-pointer'>
            <Card icon='/icons/video.png' text='Video Module' onclick={()=>{router.push("/vitiligo-awareness-month/video-module")}} />

            </div>
            <div className='border border-primary rounded-xl py-2 hover:bg-primary group'>
            <Card icon='/icons/poster.png' text='Poster Module' onclick={()=>{}} />
            </div>
            <div className='border border-primary rounded-xl py-2 hover:bg-primary group'>
            <Card icon='/icons/view-reports.png' text='View Reports' onclick={()=>{}} />
            </div>
        </div>
        <div className='flex justify-end items-end w-full pr-5 pb-5'>
            <Button variant={"ghost"} onClick={()=>setIsOpen(true)}>
            <img src="/icons/add-icon.png" alt="add-icon" height={50} width={50} />
            </Button>
        </div>
        <AddDoctor isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  )
}

export default page