"use client";

import { Label } from "@/components/ui/label";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadFile } from "../actions/upload";
import { addVideo } from "../actions/video.actions";
import { getAllDoctors } from "../actions/doctor.actions";
import { useRouter } from "next/navigation";

const page = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoLoading, setVideoLoading] = useState(false);
  const [loading, setLoading] = useState(false)
  const [docid, setDocid] = useState("")
  const [allDoctors, setAllDoctors] = useState<any[]>([])
const router = useRouter()
  const handleVideoClick = () => {
    videoInputRef.current?.click();
  };
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleVideoRemove = () => {
    setVideoPreviewUrl(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleVideoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast("Please upload a valid image file.");
      return;
    }
    setVideoLoading(true)
    const formData = new FormData();
    formData.append('file', file);
//      const res = await fetch(`/api/presign?filename=${file.name}&type=${file.type}`);
//     const { url } = await res.json();
//    const uploadRes = await fetch(url, {
//   method: 'PUT',
//   headers: {
//     'Content-Type': file.type,
//   },
//   body: file,
// });

// if (!uploadRes.ok) {
//   toast("Upload failed. Please try again.");
//   setVideoLoading(false);
//   return;
// }
    //    console.log(url.split('?')[0])
    //    setVideoUrl(url.split('?')[0])

    const data = await uploadFile(formData)
    setVideoUrl(data.url!)

    const reader = new FileReader();
    reader.onloadend = () => {
      setVideoPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    setVideoLoading(false)
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };

    try {
      setImageLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
        reader.readAsDataURL(file);
      }
      setImageLoading(false);
    } catch (error) {
      console.log(error);
      setImageLoading(false);
    }
  };

  const handleRemove = async () => {
    try {
      setImageLoading(true);
      const res = await fetch("/api/upload", {
        method: "DELETE",
        body: JSON.stringify({
          secure_url: imageUrl,
        }),
      });

      const data = await res.json();
      if (!data.status) {
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
      setImageLoading(false);
    } catch (error) {
      console.log(error);
      setImageLoading(false);
    }
  };

  const handleSubmit =async ()=>{
    setLoading(true)
    const addToDb = await addVideo(imageUrl!,videoUrl,docid)
        toast("video uploaded successfully")
        router.push("/dashboard")

  }

  useEffect(()=>{
    const getDoctors = async()=> 
    {
        const data = await getAllDoctors()
        setAllDoctors(data)
    }
    getDoctors()
  },[])
  return (
    <div className=" flex items-center w-full py-10 justify-center">
      <div className="w-[90%] flex flex-col gap-8">
        <div>
          <Label>Select Doctor</Label>
          <Select>
            <SelectTrigger className="w-full border-primary">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {
                allDoctors.map((item,index)=>(
                    <SelectItem onClick={()=>setDocid(item.id)} value={item.name}>{item.name}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-start gap-2">
          <Label className="text-lg text-gray-700">Upload Image</Label>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            hidden
            onChange={handleImageChange}
          />
          <div className="flex">
            <Button
              onClick={handleButtonClick}
              className={`p-12 rounded-none bg-[#FAF7F7] hover:bg-transparent shadow-lg ${
                previewUrl ? "hidden" : "flex"
              }`}
            >
              <img
                src="/icons/add-image.png"
                alt="add-image"
                height={60}
                width={50}
                className=""
              />
            </Button>
            {imageLoading && !previewUrl && (
              <div className="opacity-90 bg-black h-[100px] w-[150px] absolute flex items-center justify-center">
                <Loader2 className="animate-spin text-white size-8" />
              </div>
            )}
            <div>
              {previewUrl && (
                <div className="flex flex-col items-center gap-2 w-full relative">
                  <img
                    src={previewUrl}
                    alt="Doctor preview"
                    className="max-w-[100px] w-[100px] max-h-[100px] h-[100px] rounded-md border aspect-auto"
                  />
                  <button
                    onClick={handleRemove}
                    className="font-semibold absolute p-1"
                  >
                    {imageLoading ? (
                      <div className="opacity-90 bg-black h-[100px] w-[100px] absolute -left-12 top-0 flex items-center justify-center">
                        <Loader2 className="animate-spin text-white size-8" />
                      </div>
                    ) : (
                      <X className="text-black -right-[70px] -top-1 absolute cursor-pointer" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Video upload and preview */}
        <div className="flex flex-col items-start gap-2">
          <Label className="text-lg text-gray-700">Video Image</Label>
          <input
            type="file"
            accept="video/*"
            ref={videoInputRef}
            hidden
            onChange={handleVideoChange}
          />
          <div className="flex">
            <Button
              onClick={handleVideoClick}
              className={`p-12 rounded-none bg-[#FAF7F7] hover:bg-transparent shadow-lg ${
                videoPreviewUrl ? "hidden" : "flex"
              }`}
            >
              <img
                src="/icons/add-video.png"
                alt="add-video"
                height={50}
                width={50}
                className="bg-red-500"
              />
            </Button>
            {videoLoading && !videoPreviewUrl && (
              <div className="opacity-90 bg-black h-[100px] w-[150px] absolute flex items-center justify-center">
                <Loader2 className="animate-spin text-white size-8" />
              </div>
            )}
            <div>
              {videoPreviewUrl && (
                <div className="flex flex-col items-center gap-2 w-full relative">
                  <video
                    src={videoPreviewUrl}
                    className="max-w-[100px] w-[100px] max-h-[100px] h-[100px] rounded-md border aspect-auto"
                  />
                  <button
                    onClick={handleVideoRemove}
                    className="font-semibold absolute p-1"
                  >
                    {videoLoading ? (
                      <div className="opacity-90 bg-black h-[100px] w-[100px] absolute -left-12 top-0 flex items-center justify-center">
                        <Loader2 className="animate-spin text-white size-8" />
                      </div>
                    ) : (
                      <X className="text-black -right-[70px] -top-1 absolute cursor-pointer" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
{/* submit button */}
        <div className="w-full flex justify-center pt-5">
            <Button onClick={handleSubmit} className=" w-1/2 rounded-full">{loading ? <div className="flex gap-2 items-center"><Loader2 className="animate-spin"/><p>Submitting</p></div> : "Submit" }</Button>
        </div>
      </div>
    </div>
  );
};

export default page;
