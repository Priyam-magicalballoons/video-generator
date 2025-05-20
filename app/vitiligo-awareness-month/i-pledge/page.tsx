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
import React, { useEffect, useState } from "react";

const page = () => {
  const [docid, setDocid] = useState("");
  const [docName, setDocName] = useState("");
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("Select Doctor");

  const [isAgree, setisAgree] = useState(false);

  useEffect(() => {
    const getDoctors = async () => {
      const data = await getAllDoctors();
      setAllDoctors(data);
    };
    getDoctors();
  }, []);
  return (
    <div className="w-full h-screen flex justify-center py-5">
      <div className="w-[90%] pb-5 h-fit md:w-96 lg:w-1/4 border-gray-100 sm:shadow-lg rounded-lg border-1 sm:border  md:border md:border-1 p-2">
        <div className="flex flex-col gap-2 w-full pb-5 ">
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
            <PopoverContent  className="w-full p-0">
              <Command className="w-full" >
                <CommandInput
                  placeholder="Search doctor..."
                  className="h-9 w-full"
                />
                <CommandList >
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup >
                    {allDoctors?.map((option) => (
                      <CommandItem
                        key={option.id}
                        value={option.name}
                        onSelect={(currentValue) => {
                            console.log(selectedValue,currentValue)
                          setSelectedValue(
                            currentValue === selectedValue
                              ? "Select Doctor"
                              : currentValue
                          );
                          setOpen(false);
                          setDocid(option.id);
                          setDocName(option.name);
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
        <div className="flex flex-col bg-[#F0DFFB] p-5 rounded-[30px] gap-5 h-fit py-10 pb-20">
          <div className="flex flex-col bg-[#FAF3FF] shadow-lg py-5">
            <h3 className="underline underline-offset-2 text-center text-xl py-3">
              Disclaimer
            </h3>
            <p className="py-5 text-center px-8 text-lg">
              By including this statement, you encourage your audience to
              prioritize their health and avoid self-diagnosis or treatment
              based solely on the information on your website.
            </p>
          </div>
          <div className="flex gap-5 items-center ml-2 py-3" >
            <div
              className="w-4  h-4 border relative border-black cursor-pointer"
              onClick={() => setisAgree(!isAgree)}
            >
              {isAgree && (
                <Check className="absolute -top-1 -left-1" color="green" />
              )}
            </div>
            <p className="cursor-pointer" onClick={() => setisAgree(!isAgree)}>I Agree</p>
          </div>
          <div className="w-full flex justify-center">
            <Button disabled={!isAgree} className="rounded-full px-10">Click & Generate</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
