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
import { ArrowDown, Check, ChevronsUpDown, SquareCheckBig } from "lucide-react";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [docid, setDocid] = useState("");
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("Select Doctor");

  useEffect(() => {
    const getDoctors = async () => {
      const data = await getAllDoctors();
      setAllDoctors(data);
    };
    getDoctors();
  }, []);
  return (
    <div className="w-full h-screen flex justify-center py-5 gap-5">
      <div className="w-[90%]  h-full flex flex-col gap-5">
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
        <div className="flex flex-col w-full gap-5">
            <div className="bg-[#EDDAF1] py-2 px-3">
                <p>
                    Video
                </p>
                <div className="px-5 flex">
                    <div className="w-1/2">
                    <img src="/icons/video-report.png" alt="" height={100} width={100} />
                    </div>
                    <div className="flex justify-around w-1/2 flex-col pl-5 pb-2">
                        <Button variant={"ghost"} className="flex gap-2">
                        <p>Uploaded</p>
                        <SquareCheckBig color="green"/>
                        </Button>
                        <Button variant={"ghost"} className="flex gap-2">
                        <p>Download</p>
                        <ArrowDown color="red" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="bg-[#EDDAF1] py-2 px-3">
                <p>
                    I-Pledge
                </p>
            </div>
            <div className="bg-[#EDDAF1] py-2 px-3">
                <p>
                    Poster
                </p>
            </div>
            
        </div>
      </div>
    </div>
  );
};

export default Page;
