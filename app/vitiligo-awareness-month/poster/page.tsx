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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const page = () => {
  const [docid, setDocid] = useState("");
  const [docName, setDocName] = useState("");
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
        <div className="w-full flex flex-col">
          <h2 className="text-center py-5 font-bold text-xl">Select Template</h2>
          <RadioGroup
            defaultValue="option-one"
            className="flex flex-row w-full justify-around"
          >
            <div className="flex flex-col justify-between items-center space-x-2">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one" className="text-center">
                <p className="py-3">Option One</p>
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
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two" className="text-center">
                <p className="py-3">Option two</p>
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
          </RadioGroup>
        </div>
        <div className="w-full justify-center flex pt-20 py-5">
            <Button className="rounded-full px-10 ">
                Submit
            </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
