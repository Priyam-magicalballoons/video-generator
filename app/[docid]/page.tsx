"use client"

import { useEffect, useState } from "react"
import { getVideoUrl } from "../actions/other.actions"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CircleAlert, Loader2, MoveLeft } from "lucide-react"

const page = ({params}:{params : {docid : string}}) => {
    const [url, setUrl] = useState("")
    const [Loading, setLoading] = useState(false)
    const router = useRouter()
    useEffect(()=>{
        const getUrl =async ()=>{
            setLoading(true)
            const data = await getVideoUrl(params?.docid)
            setUrl(data.data?.url!)
            setLoading(false)
        }
        getUrl()
    },[])

   if(url){
    return router.push(url)
   }
  return (
    <div className="w-full h-screen items-center justify-center flex">
        {
            !Loading ? (

                <div className="flex flex-col text-center gap-2 items-center">
            <CircleAlert size={80} color="red" className="my-5" />
        <h1 className="text-xl md:text-2xl lg:text-4xl font-serif font-semibold tracking-wide">Video Not Available At This Moment !</h1>
        <h3 className="text-lg font-serif md:text-xl lg:text-2xl tracking-wider">Kindly Try Again After Some Time</h3>
        </div>
) : (
    <div className="flex items-center gap-5">
        <Loader2 className="animate-spin size-10" /><p className="text-4xl">Loading...</p>
    </div>
)
}
    </div>
  )
}

export default page