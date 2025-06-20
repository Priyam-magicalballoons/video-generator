"use client";

import { Label } from "@/components/ui/label";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from "sonner";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadFile } from "../../actions/upload";
import { addVideo } from "../../actions/video.actions";
import { getAllDoctors } from "../../actions/doctor.actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState<string | null>("Select Doctor")

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
  setVideoLoading(false);
  return;
}
       console.log(url.split('?')[0])
       setVideoUrl(url.split('?')[0])

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
    
    if(!imageUrl || !videoUrl || !docid){
      toast("kindly provide all the data.")
      return
    }
    try {
    setLoading(true)
    const addToDb = await addVideo(imageUrl,videoUrl,docid!)
    console.log(addToDb)
    toast("video uploaded successfully")
    router.push("/vitiligo-awareness-month/dashboard")
    } catch (error) {
      console.log(error)
      toast("An error occured")
    }
  }

  useEffect(()=>{
    const getDoctors = async()=> 
    {
        const data = await getAllDoctors()
        const filteredDocs = data.filter((d)=>d?.videoId === null)
        setAllDoctors(filteredDocs)
    }
    getDoctors()
  },[])

  return (
    <div className="flex items-center w-full py-10 justify-center">
      <div className="w-[80%] pb-5 h-fit md:w-96 lg:w-1/4 border-gray-100 sm:shadow-lg rounded-lg border-1 sm:border md:border md:border-1 p-2 gap-8 flex flex-col py-5 border-t-0">
        <div className="flex flex-col gap-2 w-full">
           <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput placeholder="Search doctor..." className="h-9 w-full" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {allDoctors.map((option) => (
                <CommandItem
                  key={option.name}
                  value={option.name}
                  onSelect={(currentValue) => {
                    setSelectedValue(currentValue === selectedValue ? "Select Doctor" : currentValue)
                    setOpen(false)
                    setDocid(option.id)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedValue === option.name ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
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
          <Label className="text-lg text-gray-700">Upload 
            Video
          </Label>
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
