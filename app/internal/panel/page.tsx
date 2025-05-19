"use client";

import { getAllDoctorVideos, updateUrl } from "@/app/actions/other.actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const page = () => {
  const [allData, setAllData] = useState<any[]>([]);
  const videoInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const getAllData = async () => {
    const data = await getAllDoctorVideos();
    console.log(data);
    setAllData(data!);
  };

  const handleButtonClick = ()=> {
    videoInputRef.current?.click()
    
  }

  const handleDownload = async (file:string,filename : string) => {

    try {
      const res = await fetch(file)
      const contentType = res.headers.get("content-type") || ""
      if (!res.ok) throw new Error("Failed to fetch file")


       const extensionMap: Record<string, string> = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
        "image/gif": ".gif",
        "image/bmp": ".bmp",
        "image/tiff": ".tiff",
        "image/svg+xml": ".svg",
        "image/x-icon": ".ico",
        "video/mp4": ".mp4",
        "application/pdf": ".pdf",
      }

      const extension = extensionMap[contentType] || ""
      const blob = await res.blob()
      const downloadUrl = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = `${filename}.${extension}`
      a.click()

      URL.revokeObjectURL(downloadUrl)
    } catch (err) {
      console.error(err)
      alert("Download failed.")
    }
  }

  const uploadVideo = async (e : ChangeEvent<HTMLInputElement>,videoId:string)=> {
    const file = e.target.files?.[0];
    if(!file){
        console.log("no videos found")
        return
    }

    console.log(file)
    if(!file.type.startsWith("video/")){
        toast("kindly upload a valid video file")
        return
    }
    try {
        setUploading(true)
        const formData = new FormData()
        formData.append("file",file)
        const res = await fetch(`/api/presign?filename=${file.name}&type=${file.type}`);
            const { url } = await res.json();
           const uploadRes = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
            'x-amz-acl': 'public-read'
          },
          body: file,
        });
        
        if (!uploadRes.ok) {
          toast("Upload failed. Please try again.");
          setUploading(false);
          return;
        }
         console.log(url.split('?')[0])

         const update = await updateUrl(videoId,url.split('?')[0])

         if(update?.data.url)
        {
            setUploading(false)
            window.location.reload()
        }
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    getAllData();
  }, []);
  return (
    <div className="w-full h-screen">
        <h2 className="text-4xl text-center font-serif font-semibold tracking-wider py-5">All Doctors Data</h2>
        <div className="flex w-full  justify-center">
      <table className="border">

        <thead>
          <th className="border">Doctor name</th>
          <th className="border">Mr name</th>
          <th className="border">Image url</th>
          <th className="border">Video url</th>
          <th className="border">Upload Video</th>
        </thead>
        <tbody>
          {allData?.map((item) => (
              <tr>
              <td className="border">{item.name}</td>
              <td className="border">{item.MR.name}</td>
              <td className="border max-w-[200px] truncate cursor-pointer text-blue-500"><p onClick={()=>handleDownload(item.refImageUrl,`${item.name}-image`)}>
                {item.refImageUrl} 
                </p>
                </td>
              <td className="border max-w-[200px] truncate cursor-pointer text-blue-500"><p onClick={()=>handleDownload(item.refVideoUrl,`${item.name}-video`)}>
                {item.refVideoUrl}
                </p>
                </td>
                <td className="flex justify-center border">
                    {
                        item.url ? <a className="text-blue-500 max-w-[200px] truncate" href={item.url}>{item.url}</a> : <><input onChange={(e)=>{uploadVideo(e,item.videoId)}} type="file" accept="video/*" ref={videoInputRef} hidden />
                    <Button onClick={handleButtonClick} type="button" >{uploading ? <div className="flex items-center gap-2"><Loader2 className="animate-spin" /><p>Uploading</p></div> : "Upload Video" }</Button></>
                    }
                </td>
                <td>{}</td>
            </tr>
          ))}
        </tbody>
      </table>
          </div>
    </div>
  );
};

export default page;
