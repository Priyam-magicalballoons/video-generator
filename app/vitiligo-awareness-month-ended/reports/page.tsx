"use client";

import { getAllDoctors, getSingleDetails } from "@/app/actions/doctor.actions";
import { checkIsUploaded } from "@/app/actions/other.actions";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ArrowDown, Check, ChevronsUpDown, CircleX, SquareCheckBig } from "lucide-react";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [docid, setDocid] = useState("");
  const [docName, setDocName] = useState("")
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("Select Doctor");
  const [selectDocDetails, setSelectDocDetails] = useState<any>()
  const [loading, setLoading] = useState(false)

  const handleDownload = async (file:string,filename : string) => {
    try {
      console.log(file)
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
      console.log("reached")
      const downloadUrl = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = `${filename}${extension}`
      document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    } catch (err) {
      console.error(err)
      alert("Download failed.")
    }
  }

  const handleDownloadVideo = async (file:string,filename : string) => {
    try {
      console.log(file)
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
      const a = document.createElement("a")
      a.href = file
      a.style.display = "none";
      a.download = `${filename}${extension}`
      document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    } catch (err) {
      console.error(err)
      alert("Download failed.")
    }
  }

  useEffect(() => {
    const getDoctors = async () => {
      const data = await getAllDoctors();
      setAllDoctors(data);
    };
    getDoctors();
  }, []);

  useEffect(()=>{
    setLoading(true)
    const getIsUploaded = async () => {
      const uploadedData = await checkIsUploaded(docid)
      setSelectDocDetails(uploadedData.data)
      setLoading(false)
    }
    getIsUploaded()
  },[docid])

  return (
    <div className="w-full h-screen flex justify-center py-5 gap-5">
      <div className="w-[90%] pb-5 h-fit md:w-96 lg:w-1/4 border-gray-100 sm:shadow-lg rounded-lg border-1 sm:border  md:border md:border-1 p-2 flex flex-col gap-5 py-5">
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
                <CommandInput
                  placeholder="Search doctor..."
                  className="h-9 w-full"
                />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {allDoctors?.map((option) => (
                      <CommandItem
                        key={option.id}
                        value={option.name}
                        onSelect={(currentValue) => {
                          setSelectedValue(
                            currentValue === selectedValue
                              ? "Select Doctor"
                              : currentValue
                          );
                          setOpen(false);
                          setDocid(option.id);
                          setDocName(option.name)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedValue === option.name
                              ? "opacity-100"
                              : "opacity-0"
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
        {
          (docid && !loading) && (
        <div className="flex flex-col w-full gap-5">
            <div className="bg-[#EDDAF1] py-2 px-3 w-full rounded-sm">
                <p className="font-semibold pb-3">
                    Video
                </p>
                <div className="px-5 flex">
                    <div className="w-1/2">
                    <img src="/icons/video-report.png" alt="" height={100} width={100} />
                    </div>
                    <div className="flex justify-around w-1/2 flex-col pl-5 pb-2">
                        <Button variant={"ghost"} className="flex gap-2 hover:bg-transparent cursor-default">
                        <p>Uploaded</p>
                        {
                          selectDocDetails?.video?.refVideoUrl ?  <SquareCheckBig color="green"/> : <CircleX color="red" />
                        }
                          </Button>
                        {
                          selectDocDetails?.video?.url ? (
                            <Button variant={"ghost"} className="flex gap-2 w-fit self-center" onClick={()=>handleDownloadVideo(selectDocDetails?.video?.url,`${docName}-video`)}>
                        <p>Download</p>
                        <ArrowDown color="red" />
                        </Button>
                        ) : <p>{""}</p>
                        }
                    </div>
                </div>
            </div>
            <div className="bg-[#EDDAF1] py-2 px-3 w-full rounded-sm">
                <p className="font-semibold pb-3">
                    I Pledge
                </p>
                <div className="px-5 flex">
                    <div className="w-1/2">
                    <img src="/icons/i-pledge-report.png" alt="" height={80} width={90} />
                    </div>
                    <div className="flex justify-around w-1/2 flex-col pl-5 pb-2">
                        <Button variant={"ghost"} className="flex gap-2 hover:bg-transparent cursor-default">
                        <p>Uploaded</p>
                        {
                          selectDocDetails?.ipledge?.url ?  <SquareCheckBig color="green"/> : <CircleX color="red"/>
                        }
                        </Button>
                        {
                          selectDocDetails?.ipledge?.url ? (

                            <Button variant={"ghost"} className="flex gap-2 w-fit self-center" onClick={()=>handleDownload(selectDocDetails?.ipledge?.url,`${docName}-i-pledge`)}>
                        <p>Download</p>
                        <ArrowDown color="red" />
                        </Button>
                        ) : <p>{""}</p>
                      }
                    </div>
                </div>
            </div>
            <div className="bg-[#EDDAF1] py-2 px-3 w-full rounded-sm">
                <p className="font-semibold pb-3">
                    Poster -1
                </p>
                <div className="px-5 flex">
                    <div className="w-1/2 ">
                    <img src="/icons/poster-report.png" alt="" height={90} width={90}  />
                    </div>
                    <div className="flex justify-around w-1/2 flex-col pl-5 pb-2">
                        <Button variant={"ghost"} className="flex gap-2 hover:bg-transparent cursor-default">
                        <p>Uploaded</p>
                        {
                          selectDocDetails?.poster?.url_1 ?  <SquareCheckBig color="green"/> : <CircleX color="red"/>
                        }
                        </Button>
                        {
                          selectDocDetails?.poster?.url_1 ? (

                            <Button variant={"ghost"} className="flex gap-2 w-fit self-center" onClick={()=>handleDownload(selectDocDetails?.poster?.url_1,`${docName}-poster-1`)}>
                        <p>Download</p>
                        <ArrowDown color="red" />
                        </Button>
                        ) : <p>{""}</p>
                      }
                    </div>
                </div>
            </div>            
            <div className="bg-[#EDDAF1] py-2 px-3 w-full rounded-sm">
                <p className="font-semibold pb-3">
                    Poster - 2
                </p>
                <div className="px-5 flex">
                    <div className="w-1/2 ">
                    <img src="/icons/poster-report.png" alt="" height={90} width={90}  />
                    </div>
                    <div className="flex justify-around w-1/2 flex-col pl-5 pb-2">
                        <Button variant={"ghost"} className="flex gap-2 hover:bg-transparent cursor-default">
                        <p>Uploaded</p>
                        {
                          selectDocDetails?.poster?.url_2 ?  <SquareCheckBig color="green"/> : <CircleX color="red"/>
                        }
                        </Button>
                        {
                          selectDocDetails?.poster?.url_2 ? (

                            <Button variant={"ghost"} className="flex gap-2 w-fit self-center" onClick={()=>handleDownload(selectDocDetails?.poster?.url_2,`${docName}-poster-2`)}>
                        <p>Download</p>
                        <ArrowDown color="red" />
                        </Button>
                        ) : <p>{""}</p>
                      }
                    </div>
                </div>
            </div>            
        </div>
         )
        }
      </div>
    </div>
  );
};

export default Page;
