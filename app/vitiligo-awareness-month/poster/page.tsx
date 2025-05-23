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
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const page = () => {
  const [docData, setDocData] = useState<any>({});
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("Select Doctor");
  const [optionOneSelected, setOptionOneSelected] = useState(true)
  const [optionTwoSelected, setOptionTwoSelected] = useState(true)

  useEffect(() => {
    const getDoctors = async () => {
      const data = await getAllDoctors("poster");
      const filteredDocs = data?.filter((d:any)=>!d.url?.url_1 || !d?.url?.url_2)
      console.log(filteredDocs)
      setAllDoctors(filteredDocs);
    };
    getDoctors();
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center py-10">
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
                          setDocData(option);
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
        <div className="w-full flex flex-col">
          <h2 className="text-center py-5 font-bold text-xl">Select Template</h2>
          <div
            className="flex flex-row w-full justify-around"
          >
            <div className="flex flex-col justify-between items-center space-x-2" >
              <Checkbox id="option-one" checked={optionOneSelected} onCheckedChange={()=>setOptionOneSelected(!optionOneSelected)} disabled={docData?.url?.url_1} />
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
             <Checkbox id="option-two" checked={optionTwoSelected} onCheckedChange={()=>setOptionTwoSelected(!optionTwoSelected)} disabled={docData?.url?.url_2} />
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
            <Button className="rounded-full px-10 ">
                Submit
            </Button>
        </div>
      </div>

      {/* <div className="relative">
        <img src="/i-pledge.png" alt="" className="relative" />
        <img src={docData?.imageUrl} className="absolute top-[80px] left-[100px] rounded-full aspect-square object-cover" width={175} height={175} />
      </div> */}
    </div>
  );
};

export default page;
