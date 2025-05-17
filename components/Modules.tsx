"use client"

import React from 'react'
import Card from './Card'
import { useRouter } from 'next/navigation'
import { useModuleStore } from '@/lib/stores/useModuleStore'


const Modules = () => {
  const {setModule} = useModuleStore()
  const router = useRouter()

  const redirect = (name:string)=>{
    setModule(name)
    router.push("/doctors")
  }
  return (
    <div className='h-full w-full items-center  flex flex-col gap-5'>
        <h2 className="text-center font-serif tracking-wider text-4xl py-5">Choose Module</h2>
            <Card text={"Video Generator"} icon={"video"} onclick={()=>redirect("video-generator")} />
            <Card text={"I-Pledge Generator"} icon='ipledge' onclick={()=>redirect("i-pledge")} />
            <Card text={"Poster and Dispenser Generator"} icon='' onclick={()=>redirect("poster")} />
    </div>
  )
}

export default Modules