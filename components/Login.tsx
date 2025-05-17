"use client"

import React, { useState } from 'react'
import CustomInput from './CustomInput'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'
import { isAuthenticate } from '@/app/api/auth/route'
import { Input } from './ui/input'
import { Label } from './ui/label'

const Login = () => {
    const [id, setId] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const onSubmit = async() => {
        const user = await isAuthenticate(id,password)
        if(user.status === 400){
            toast("unauthorised user")
            return
        }else{
            toast("logged in successfully")
            return router.push("/")
        }
    }
  return (
    <div className='w-full flex flex-col h-screen justify-between'>
        <Label htmlFor='username' >
            Username
        </Label>
        <Input id='username' className='border-[#9527DF]' placeholder='' />
        
    </div>
  )
}

export default Login