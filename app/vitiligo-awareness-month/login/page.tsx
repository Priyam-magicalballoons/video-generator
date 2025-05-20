"use client"

import Login from '@/components/Login'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { isAuthenticate } from '../../actions/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const LoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const authenticated = async ()=>{
    if(username !== password){
      toast("Invalid Credentials",{
        duration : 3000
      })
      return
    }
    const data = await isAuthenticate(username,password)
    if(data.status === 200){
      toast("Logged In Successfully",{
        duration : 3000
      })
      router.replace("/vitiligo-awareness-month/dashboard")
    }else{
      toast("Invalid Credentials",{
        duration : 3000
      })
    }
  }

  return (
    <div className='w-full flex justify-center items-center h-screen'>
      <div className='w-[90%] pb-5 h-fit md:w-96 lg:w-1/4 border-gray-100 sm:shadow-lg rounded-lg border-1 sm:border  md:border md:border-1 p-2 flex flex-col gap-5 py-10'>
        <div className='flex flex-col gap-2'>
      <Label htmlFor='username' className='text-[#9527DF]'>
      Username
        </Label>
        <Input id='username' value={username} onChange={(e)=>setUsername(e.target.value)} className='border-[#9527DF]' />
        </div>
        <div className='flex flex-col gap-2'>
      <Label htmlFor='password' className='text-[#9527DF]' >
      Password
        </Label>
        <Input type='password' value={password} onChange={(e)=>setPassword(e.target.value)} id='password' className='border-[#9527DF]'  />
        </div>
        <div className='w-full flex items-center justify-center pt-10'>
        <Button onClick={authenticated} className='w-[80%] rounded-full'>Login</Button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage