"use client";

import { getAllDoctors } from "@/app/actions/doctor.actions";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { useRouter } from "next/navigation";
import { createPosters } from "@/app/actions/poster.actions";

const page = () => {
  const [docData, setDocData] = useState<any>({});
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("Select Doctor");
  const [optionOneSelected, setOptionOneSelected] = useState(true);
  const [optionTwoSelected, setOptionTwoSelected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const poster_1_ref = useRef<HTMLDivElement | null>(null);
  const poster_2_ref = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

  useEffect(() => {
    const getDoctors = async () => {
      const data = await getAllDoctors("poster");
      const filteredDocs = data?.filter((d: any) => !d.url?.url_1 || !d?.url?.url_2);
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
      await new Promise(resolve => setTimeout(resolve, 100));
      const dataUrl = await toPng(poster_1_ref.current);
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `${Date.now()}-${docData.name}-poster_1.png`, { type: blob.type });
      const link = document.createElement("a");
    link.href = dataUrl;
    const timestamps = new Date();
    link.download = `${timestamps}-${docData.name}-poster_1.png`
    link.click();
      try {
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
        if (!uploadRes.ok) throw new Error("Upload failed");
        poster_1_url = url.split('?')[0];
      } catch (err) {
        toast("Upload failed");
        console.log(err);
      }
    }

    if (!docData?.url?.url_2 && optionTwoSelected) {
      if (!poster_2_ref.current) return;
      await new Promise(resolve => setTimeout(resolve, 100));
      const dataUrl = await toPng(poster_2_ref.current);
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `${Date.now()}-${docData.name}-poster_2.png`, { type: blob.type });
      const link = document.createElement("a");
    link.href = dataUrl;
    const timestamps = new Date();
    link.download = `${timestamps}-${docData.name}-poster_2.png`
    link.click();
      try {
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
        if (!uploadRes.ok) throw new Error("Upload failed");
        poster_2_url = url.split('?')[0];
      } catch (err) {
        toast("Upload failed");
        console.log(err);
      }
    }

    try {
      const saveToDb = await createPosters(docData?.id, poster_1_url, poster_2_url);
      if (saveToDb.status === 200) {
        toast("I-pledge Saved Successfully");
        router.push("/vitiligo-awareness-month/dashboard");
      } else {
        toast("Error saving i-pledge");
      }
    } catch (error) {
      console.log(error);
      toast("Error in saving file. Try again");
    } finally {
      setIsLoading(false);
    }
  };

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
                <CommandInput placeholder="Search doctor..." className="h-9 w-full" />
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
                        <Check className={cn("mr-2 h-4 w-4", selectedValue === option.name ? "opacity-100" : "opacity-0")} />
                        {option.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-full flex flex-col">
          <h2 className="text-center py-5 font-bold text-xl">Select Template</h2>
          <div className="flex flex-row w-full justify-around">
            <div className="flex flex-col justify-between items-center space-x-2">
              <Checkbox id="option-one" checked={optionOneSelected} onCheckedChange={() => setOptionOneSelected(!optionOneSelected)} disabled={docData?.url?.url_1} />
              <Label htmlFor="option-one" className="text-center">
                <p className="py-3">Poster 1</p>
                <div className="bg-[#FAF7F7] px-5 py-2">
                  <img alt="poster" src="/icons/poster-report.png" height={90} width={90} />
                </div>
              </Label>
            </div>
            <div className="flex flex-col justify-between items-center space-x-2">
              <Checkbox id="option-two" checked={optionTwoSelected} onCheckedChange={() => setOptionTwoSelected(!optionTwoSelected)} disabled={docData?.url?.url_2} />
              <Label htmlFor="option-two" className="text-center">
                <p className="py-3">Poster 2</p>
                <div className="bg-[#FAF7F7] px-5 py-2">
                  <img alt="poster" src="/icons/poster.png" height={90} width={90} />
                </div>
              </Label>
            </div>
          </div>
        </div>
        <div className="w-full justify-center flex pt-20 py-5">
          <Button
            disabled={!docData?.id || (!optionOneSelected && !optionTwoSelected) || isLoading}
            onClick={handleDownload}
            className="rounded-full px-10"
          >
            {isLoading ? "Saving..." : "Submit"}
          </Button>
        </div>
      </div>

      {/* Section that is to be changed */}
      {/* Remove the clasNames "opacity-0 overflow-hidden" to see the image */}
      <div className="absolute pointer-events-none h-0 w-0 opacity-0 overflow-hidden">
        {/* poster 1 */}
        <div className="relative w-[600px] h-auto" ref={poster_1_ref}>
          <img src="/poster.png" alt="poster1" className="w-full" />
          <img src={docData?.imageUrl} className="absolute top-[279px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md object-cover aspect-square" width={349} height={345} />
        </div>
        {/* poster 2 */}
        <div className="relative w-[600px] h-auto" ref={poster_2_ref}>
          <img src="/i-pledge.png" alt="poster2" className="w-full" />
          <img src={docData?.imageUrl} className="absolute top-[250px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md object-cover" width={175} height={175} />

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
