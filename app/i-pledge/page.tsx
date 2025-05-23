"use client";

import { Button } from "@/components/ui/button";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { ArrowUp, Camera, SwitchCamera } from "lucide-react";

const IPledge = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageGenerated, setImageGenerated] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [cameraMode, setCameraMode] = useState("environment")

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = async () => {
    const dataUrl = await toPng(imageRef.current!);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "i-pledge.png";
    link.click();
  };
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log(cameraMode)
    if (typeof window !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            width: { ideal: 300 },
            height: { ideal: 300 },
            facingMode: "environment",
          },
          audio: false,
        })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
        });
    } else {
      console.error("Browser does not support getUserMedia");
    }
  }, [cameraMode]);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas size to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 image
    const dataUrl = canvas.toDataURL("image/png");
    setImage(dataUrl);
  };
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="h-full w-full flex flex-col items-center py-10 md:w-1/2 lg:w-1/3 px-2 md:h-[95vh] rounded-xl bg-[#0c61aa]/10 shadow-lg">
        <h2 className="py-5 text-4xl font-serif tracking-wider">
          I-Pledge Generator
        </h2>
        <div className="w-full justify-between h-full flex flex-col items-center ">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden flex-1"
          />
          <div
            className={`w-full flex flex-col items-center gap-5 ${
              isCapturing && "hidden"
            }`}
          >
            <Button
              variant="outline"
              className={`self-center shadow-md py-10 w-[80%] ${
                previewUrl ? "hidden" : "flex"
              } bg-gray-100 border-2 border-black`}
              onClick={() => setIsCapturing(true)}
            >
              <Camera /> Capture Doctor Image
            </Button>
            <Button
              variant="outline"
              className={`self-center shadow-md py-10 w-[80%] ${
                previewUrl ? "hidden" : "flex"
              } bg-gray-100 border-dotted border-2 border-black`}
              onClick={handleButtonClick}
            >
              <ArrowUp /> Upload Doctor Image
            </Button>
          </div>

          {previewUrl && !imageGenerated && (
            <div className="mt-4 flex flex-col items-center gap-2 w-full">
              <img
                src={previewUrl}
                alt="Doctor preview"
                className="max-w-[200px] max-h-[200px] rounded-md border aspect-auto"
              />
              <Button
                onClick={handleRemove}
                className="w-2/3 font-semibold"
                variant="destructive"
              >
                Remove Image
              </Button>
            </div>
          )}
          {imageGenerated && (
            <div className="relative w-full max-w-[600px]" ref={imageRef}>
              <img
                src="/Poster.png"
                alt="Poster"
                className="w-full h-auto block"
              />
              <div
                className="absolute"
                style={{
                  top: "12.5%",
                  left: "21%",
                  width: "57.5%",
                  aspectRatio: "1 / 1",
                }}
              >
                <img
                  src={previewUrl!}
                  alt="Doctor preview"
                  className="w-full h-full object-cover rounded-md"
                  style={{ display: "block" }}
                />
              </div>
            </div>
          )}
          <Button
            className={`w-[80%] ${(imageGenerated || !previewUrl) && "hidden"}`}
            onClick={() => setImageGenerated(true)}
          >
            Generate I-Pledge
          </Button>
          {isCapturing && (
            <div className="relative w-full max-w-[600px]" ref={imageRef}>
              <img
                src="/I-pledge.png"
                alt="Poster"
                className="w-full h-auto block"
              />
              <div
                className="absolute"
                style={{
                  top: "11.5%",
                  left: "21%",
                  width: "58%",
                  aspectRatio: "1 / 1",
                }}
              >
                <div className=" rounded overflow-hidden" onDoubleClick={()=>setCameraMode((mode)=>mode === "user" ? "environment" : "user")}>
                  {image ? (
                    <img
                      src={image}
                      alt="Captured"
                      className="w-full h-full object-cover rounded-md block"
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className={`w-full h-full object-cover rounded-md ${
                        image && "hidden"
                      }`}
                      style={{ display: "block" }}
                    />
                  )}
                </div>
              </div>
              <div className={`w-full pt-5 flex justify-center ${image && "hidden"}`}>
              <Button
                onClick={captureImage}
                className="px-4 py-2 bg-[#0c61aa] text-white rounded w-[80%] "
                >
                Capture Photo
              </Button>
                </div>
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>
          )}
          {(imageGenerated || image) && (
            <div className=" py-2 flex flex-col gap-2 w-full items-center">
              <Button
                className="w-[80%] bg-red-400 hover:bg-red-00/70"
                onClick={() => {
                  setImageGenerated(false);
                  setPreviewUrl("");
                  setImage("")
                  setIsCapturing(false)
                }}
              >
                Retake Picture
              </Button>
              <Button className="w-[80%]" onClick={handleDownload}>
                Download I-Pledge
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IPledge;
