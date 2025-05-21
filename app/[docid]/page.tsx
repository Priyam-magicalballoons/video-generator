"use client"

import { useEffect, useState } from "react"
import { getVideoUrl } from "../actions/other.actions"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CircleAlert, MoveLeft } from "lucide-react"

const page = ({params}:{params : {docid : string}}) => {
    const [url, setUrl] = useState("")
    const router = useRouter()
    useEffect(()=>{
        const getUrl =async ()=>{
            const data = await getVideoUrl(params?.docid)
            setUrl(data.data?.url!)
        }
        getUrl()
    },[])

   if(url){
    return router.push(url)
   }
  return (
    <div className="w-full h-screen items-center justify-center flex">
        <div className="flex flex-col text-center gap-2 items-center">
            <CircleAlert size={80} color="red" className="my-5" />
        <h1 className="text-xl md:text-2xl lg:text-4xl font-serif font-semibold tracking-wide">Video Not Available At This Moment !</h1>
        <h3 className="text-lg font-serif md:text-xl lg:text-2xl tracking-wider">Kindly Try Again After Some Time</h3>
        </div>
    </div>
  )
}

export default page