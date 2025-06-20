"use client";

import { getAllDoctors } from "@/app/actions/doctor.actions";
import { saveIpledge } from "@/app/actions/ipledge.actions";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toPng } from "html-to-image";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [docData, setDocData] = useState<any>();
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("Select Doctor");
  const [showIpledge, setShowIpledge] = useState(false);
  const [isAgree, setisAgree] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(true);
  const [openDailog, setOpenDailog] = useState(false);

  const fullComponentRef = useRef<HTMLDivElement | null>(null);
  const imageOnlyRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getDoctors = async () => {
      const data = await getAllDoctors();
      const filteredDocs = data?.filter((d) => d?.ipledgeId === null);
      setAllDoctors(filteredDocs);
    };
    getDoctors();
  }, []);

  // useEffect(() => {
  //   const check = () => {
  //     console.log(docData);
  //     if (docData?.id && (!docData?.speciality || !docData?.number)) {
  //       setOpenDailog(true);
  //     } else {
  //       setOpenDailog(false);
  //     }
  //   };
  //   check();
  // }, [docData]);

  useEffect(() => {
    if (showIpledge && isCapturing) {
      if (
        typeof window !== "undefined" &&
        navigator.mediaDevices?.getUserMedia
      ) {
        navigator.mediaDevices
          .getUserMedia({
            video: {
              width: { ideal: 300 },
              height: { ideal: 300 },
              facingMode: "user",
            },
            audio: false,
          })
          .then((stream) => {
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play();
            }
          })
          .catch((err) => {
            alert("Error accessing camera: " + err.message);
            console.error("Error accessing camera:", err);
          });
      } else {
        alert("Browser does not support getUserMedia");
      }
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [showIpledge, isCapturing]);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setImage(dataUrl);
    setIsCapturing(false);
  };

  const handleDownload = async () => {
    if (!imageOnlyRef.current) return;
    const dataUrl = await toPng(imageOnlyRef.current,{ quality : 0.7, width:400});
    
    const link = document.createElement("a");
    link.href = dataUrl;
    const timestamps = new Date();
    link.download = `${timestamps}-${docData}-i-pledge.png`;
    link.click();

    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], `${timestamps}-${docData}-i-pledge.png`, {
      type: blob.type,
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

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

      if (!uploadRes.ok) {
        toast("Upload failed. Please try again.");
        return;
      }
      if (url) {
        const saveToDb = await saveIpledge(docData.id, url.split("?")[0]);
        if (saveToDb.status === 200) {
          toast("I-pledge Saved Successfully");
        } else {
          toast("Error in saving i-pledge to database");
        }
        router.push("/vitiligo-awareness-month/dashboard");
      }
    } catch (error) {
      toast("Error in saving i-pledge from server");
    }
  };

  const handleRetake = () => {
    setImage(null);
    setIsCapturing(true);
  };

  return (
    <div className="w-full h-screen flex justify-center py-5">
      {!showIpledge ? (
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
            <div className="flex gap-5 items-center ml-2 py-3">
              <div
                className="w-4  h-4 border relative border-black cursor-pointer"
                onClick={() => setisAgree(!isAgree)}
              >
                {isAgree && (
                  <Check className="absolute -top-1 -left-1" color="green" />
                )}
              </div>
              <p
                className="cursor-pointer"
                onClick={() => setisAgree(!isAgree)}
              >
                I Agree
              </p>
            </div>
            <div className="w-full flex justify-center">
              <Button
                disabled={!isAgree}
                onClick={() => {
                  if (!docData) {
                    return toast("kindly select the doctor first");
                  }
                  setShowIpledge(true);
                  setIsCapturing(true);
                }}
                className="rounded-full px-10"
              >
                Click & Generate
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div ref={fullComponentRef} className="flex flex-col items-center">
          <div
            ref={imageOnlyRef}
            className="relative mx-auto"
            style={{ width: 400 }}
          >
            <img
              src="/I-pledge.png"
              alt="template"
              className="block w-full"
              style={{ maxWidth: 400 }}
            />
            <div
              className="absolute"
              style={{
                top: 89,
                left: 111,
                width: 180,
                height: 180,
                borderRadius: "50%",
                overflow: "hidden",
                background: "#eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isCapturing && (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    background: "#eee",
                  }}
                />
              )}
              {!isCapturing && image && (
                <div
                  style={{
                    position: "relative",
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Blurred background */}
                  <img
                    src={image}
                    alt="Blurred Background"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      filter: "blur(12px)",
                      transform: "scale(1.2)", // slight zoom to hide edges
                      zIndex: 1,
                    }}
                  />

                  {/* Main Circular Image */}
                  <img
                    src={image}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "center",
                      borderRadius: "50%",
                      zIndex: 2,
                    }}
                  />
                </div>
              )}
            </div>
            <div className="absolute w-full text-center" style={{ top: 325 }}>
              <p className="text-[#613e92] font-bold text-xl">
                {docData?.name}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="w-full flex flex-col items-center gap-2 mt-6"
            style={{ maxWidth: 400 }}
          >
            {isCapturing && (
              <>
                <Button
                  onClick={captureImage}
                  className="px-4 py-2 bg-[#0c61aa] text-white rounded w-[80%]"
                >
                  Capture Photo
                </Button>

                <Button
                  className="w-[80%] mt-2"
                  onClick={() =>
                    document.getElementById("imageUpload")?.click()
                  }
                >
                  Upload Image
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  id="imageUpload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImage(reader.result as string);
                        setIsCapturing(false);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </>
            )}
            {!isCapturing && (
              <>
                <Button
                  className="w-[80%] bg-red-400 hover:bg-red-400/70 mt-2"
                  onClick={handleRetake}
                >
                  Retake Picture
                </Button>
                <Button className="w-[80%] mt-2" onClick={handleDownload}>
                  Save and Download
                </Button>
              </>
            )}
          </div>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      )}
      <div>
        <Dialog open={openDailog}>
          <DialogTrigger></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Page;
