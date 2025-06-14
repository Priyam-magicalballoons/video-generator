"use client";

import { editDoctor, getAllDoctors } from "@/app/actions/doctor.actions";
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
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { useRouter } from "next/navigation";
import { createPosters } from "@/app/actions/poster.actions";
import { getMrDetails } from "@/app/actions/mr.actions";
import {QRCodeSVG} from 'qrcode.react';
import { Buffer } from "buffer"; // ✅ important
import { Input } from "@/components/ui/input";

const page = () => {
  const [docData, setDocData] = useState<any>();
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("Select Doctor");
  const [optionOneSelected, setOptionOneSelected] = useState(true);
  const [optionTwoSelected, setOptionTwoSelected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [mrDetails, setMrDetails] = useState<any>();
  const [doctorNumber, setDoctorNumber] = useState("")
  const [updatingNumber, setupdatingNumber] = useState(false)

  useEffect(() => {
    const mrDetails = async () => {
      const data = await getMrDetails();
      setMrDetails(data);
    };
    mrDetails();
  }, []);

  const poster_1_ref = useRef<HTMLDivElement | null>(null);
  const poster_2_ref = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

  useEffect(() => {
    const getDoctors = async () => {
      const data = await getAllDoctors("poster");
      const filteredDocs = data?.filter(
        (d: any) => (!d.url?.url_1 || !d?.url?.url_2) && d.video.url
      );
      setAllDoctors(filteredDocs);
    };
    getDoctors();
  }, []);

  const handleDownload = async () => {
    let poster_1_url = "";
    let poster_2_url = "";

    setIsLoading(true);

    if (!docData?.url?.url_1 && optionOneSelected) {
      if (!poster_1_ref.current) return;
      await new Promise((resolve) => setTimeout(resolve, 100));
      const dataUrl = await toPng(poster_1_ref.current);
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File(
        [blob],
        `${Date.now()}-${docData.name}-poster_1.png`,
        { type: blob.type }
      );
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      
      console.log("started")
      const check = await fetch("/api/upload-to-space", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64,
          filename: `${docData.name}-poster-1`,
          contentType: file.type,
          folderPath: `poster/Region-${mrDetails.region}/HQ-${mrDetails.Hq}/${mrDetails.name}/${docData.name}`,
        }),
      });


      const link = document.createElement("a");
      link.href = dataUrl;
      const timestamps = new Date();
      link.download = `${timestamps}-${docData.name}-poster_1.png`;
      link.click();
      try {
        const res = await fetch(
          `/api/presign?filename=${file.name}&type=${file.type}`
        );
        const { url } = await res.json();
        const uploadRes = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
            "x-amz-acl": "public-read",
          },
          body: file,
        });
        if (!uploadRes.ok) throw new Error("Upload failed");
        poster_1_url = url.split("?")[0];
      } catch (err) {
        toast("Upload failed");
        console.log(err);
      }
    }

    if (!docData?.url?.url_2 && optionTwoSelected) {
      if (!poster_2_ref.current) return;
      await new Promise((resolve) => setTimeout(resolve, 100));
      const dataUrl = await toPng(poster_2_ref.current);
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File(
        [blob],
        `${Date.now()}-${docData.name}-poster_2.png`,
        { type: blob.type }
      );
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");

      await fetch("/api/upload-to-space", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64,
          filename: `${docData.name}-poster-2`,
          contentType: file.type,
          folderPath: `poster/Region-${mrDetails.region}/HQ-${mrDetails.Hq}/${mrDetails.name}/${docData.name}`,
        }),
      });


      const link = document.createElement("a");
      link.href = dataUrl;
      const timestamps = new Date();
      link.download = `${timestamps}-${docData.name}-poster_2.png`;
      link.click();
      try {
        const res = await fetch(
          `/api/presign?filename=${file.name}&type=${file.type}`
        );
        const { url } = await res.json();
        const uploadRes = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
            "x-amz-acl": "public-read",
          },
          body: file,
        });
        if (!uploadRes.ok) throw new Error("Upload failed");
        poster_2_url = url.split("?")[0];
      } catch (err) {
        toast("Upload failed");
        console.log(err);
      }
    }

    try {
      console.log("started")
      const saveToDb = await createPosters(
        docData?.id,
        poster_1_url,
        poster_2_url
      );
      if (saveToDb.status === 200) {
        toast("poster Saved Successfully");
        router.push("/vitiligo-awareness-month/dashboard");
      } else {
        toast("Error saving poster");
      }
    } catch (error) {
      console.log(error);
      toast("Error in saving file. Try again");
    } finally {
      setIsLoading(false);
    }
  };

  const saveDoctorNumber = async()=>{
    if(!doctorNumber || doctorNumber.length < 10 || (Array.from(doctorNumber).some((char)=> /[A-Za-z]/.test(char)))){
      toast("kindly enter a valid number")
      return
    }
    try {
      setupdatingNumber(true)
    const update = await editDoctor(doctorNumber,docData.id)
    if(update?.status === 200){
      toast("number updated successfully",{
        duration : 1000
      })
      setDocData({...docData,
        number : doctorNumber
      })
    }else{
       toast("error in updating number",{
        duration : 1000
      })
    }
    } catch (error) {
      toast("server error in updating number",{
        duration : 1000
      })
    }finally{
      setupdatingNumber(false)
      setDoctorNumber("")
    }
  }

  return (
    <div className="w-full h-fit flex flex-col items-center justify-center py-10 overflow-hidden">
      <div className="w-[90%] h-screen overflow-hidden pb-5 md:w-96 lg:w-1/4 border-gray-100 sm:shadow-lg rounded-lg border-1 sm:border md:border md:border-1 p-2 flex flex-col gap-5 py-5">
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
                          setSelectedValue(currentValue);
                          setOpen(false);
                          setDocData(option);
                          setOptionOneSelected(!option.url?.url_1);
                          setOptionTwoSelected(!option.url?.url_2);
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
          (docData && !docData?.number) && (
            <div className="flex flex-row gap-2">
            <Input 
            inputMode="numeric"
            maxLength={10}
            placeholder="Enter Docter Contact no."
            type="text"
            value={doctorNumber}
            onChange={(e)=>setDoctorNumber(e.target.value)}
            />
            <button onClick={saveDoctorNumber} disabled={doctorNumber.length < 10 } className={`border px-1 rounded-md ${doctorNumber.length < 10 ? "opacity-50" : "opacity-100"}`}>
              {
                !updatingNumber ? (
                  <Check color={doctorNumber.length < 10 ? "red" : "green"} size={"30"}/>
                ):(
                  <Loader2 className="animate-spin" />
                )
              }
                  </button>
            </div>
          )
        }
          
        <div className="w-full flex flex-col">
          <h2 className="text-center py-5 font-bold text-xl">
            Select Template
          </h2>
          <div className="flex flex-row w-full justify-around">
            <div className="flex flex-col justify-between items-center space-x-2">
              <Checkbox
                id="option-one"
                checked={optionOneSelected}
                onCheckedChange={() => setOptionOneSelected(!optionOneSelected)}
                disabled={docData?.url?.url_1}
              />
              <Label htmlFor="option-one" className="text-center">
                <p className="py-3">Poster 1</p>
                <div className="bg-[#FAF7F7] px-5 py-2">
                  <img
                    alt="poster"
                    src="/icons/poster-report.png"
                    height={90}
                    width={90}
                  />
                </div>
              </Label>
            </div>
            <div className="flex flex-col justify-between items-center space-x-2">
              <Checkbox
                id="option-two"
                checked={optionTwoSelected}
                onCheckedChange={() => setOptionTwoSelected(!optionTwoSelected)}
                disabled={docData?.url?.url_2}
              />
              <Label htmlFor="option-two" className="text-center">
                <p className="py-3">Poster 2</p>
                <div className="bg-[#FAF7F7] px-5 py-2">
                  <img
                    alt="poster"
                    src="/icons/poster.png"
                    height={90}
                    width={90}
                  />
                </div>
              </Label>
            </div>
          </div>
        </div>
        <div className="w-full justify-center flex pt-20 py-5">
          <Button
            disabled={
              !docData?.id ||
              (!optionOneSelected && !optionTwoSelected) || 
              !docData?.number ||
              isLoading
            }
            onClick={handleDownload}
            className="rounded-full px-10"
          >
            {isLoading ? "Saving..." : "Submit"}
          </Button>
        </div>
        
        
      </div>

      {/* Section that is to be changed */}
      {/* Remove the classNames "opacity-0 overflow-hidden" to see the image */}
      <div className="absolute pointer-events-none h-0 w-0 overflow-hidden">
        {/* poster 1 */}
        <div className="relative w-[600px] h-auto" ref={poster_1_ref}>
          <img src="/poster.png" alt="poster1" className="w-full" />
          <QRCodeSVG
            value={`https://www.magicalballoonsdigital.com/${docData?.id}`}
            title={"Title for my QR Code"}
            size={328}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"}
            className="absolute top-[279px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md object-cover aspect-square"
          />
          {/* <img
            src={"https://video-storage-bucket2.blr1.cdn.digitaloceanspaces.com/poster/Region-mah/HQ-mumbai/tester/Dr.%20priyam/Dr.%20priyam-poster-1.png"}
            className="absolute top-[279px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md object-cover aspect-square"
            width={349}
            height={345}
          /> */}
        </div>
        {/* poster 2 */}
        <div className="relative w-[600px] h-auto" ref={poster_2_ref}>
          <img src="/i-pledge.png" alt="poster2" className="w-full" />
          <img
            src={"https://video-storage-bucket2.blr1.cdn.digitaloceanspaces.com/poster/Region-mah/HQ-mumbai/tester/Dr.%20priyam/Dr.%20priyam-poster-1.png"}
            className="absolute top-[250px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md aspect-square bg-center object-center"
            width={175}
            height={175}
          />

          {/* Git commands */}

          {/* git add . */}
          {/* git commit -m "poster added" */}
          {/* git push */}
        </div>
      </div>
    </div>
  );
};

export default page;
