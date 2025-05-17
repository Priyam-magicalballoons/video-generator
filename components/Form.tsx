import React, { ChangeEvent, useRef, useState } from "react";
import CustomInput from "./CustomInput";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { addDoctor } from "@/app/actions/doctor.actions";
import { Loader2 } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const Form = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [clinic, setClinic] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [phone, setPhone] = useState<number>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

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
      setImageLoading(true)
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
      setImageLoading(false)
    } catch (error) {
      console.log(error)
      setImageLoading(false)
    }
  };

  const handleRemove = async () => {
    try {
      setImageLoading(true)
      const res = await fetch("/api/upload", {
        method: "DELETE",
        body: JSON.stringify({
          secure_url: imageUrl,
        }),
      });

      const data = await res.json();
      if (!data.status) {
        toast("image removed");
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
      setImageLoading(false)
    } catch (error) {
      console.log(error);
      setImageLoading(false)
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!name || !phone || !speciality || !clinic) {
      toast("kindly fill all the fields");
      return;
    }
    if (!imageUrl) {
      toast("kindly upload a image first");
      return;
    }

    try {
      setLoading(true);
      console.log(imageUrl);
      const saveData = await addDoctor(
        name,
        phone,
        imageUrl,
        speciality,
        clinic
      );
      console.log(saveData);
      setLoading(false);
      window.location.reload()
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center py-5 px-4">
      <div className="w-full max-w-md flex flex-col gap-6 items-center">
        <div>
          <Label>Add Doctor Name</Label>
          <div>
            <Select onValueChange={(e) => setSpeciality(e)}>
          <SelectTrigger className="w-[80%] border-l-0 border-r-0 border-t-0 rounded-none p-0 border-b border-black ring-0 focus:ring-0 border-0 focus:outline-none focus:border-b shadcn-select-focused pt-7 pb-4">
            <SelectValue placeholder="Choose Speciality" />
          </SelectTrigger>
          <SelectContent className="">
            <SelectItem value="physiotherapist">physiotherapist</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="cardiologist">Cardiologist</SelectItem>
          </SelectContent>
        </Select>
        <Input />
          </div>
        </div>
        
        
        <Select onValueChange={(e) => setSpeciality(e)}>
          <SelectTrigger className="w-[80%] border-l-0 border-r-0 border-t-0 rounded-none p-0 border-b border-black ring-0 focus:ring-0 border-0 focus:outline-none focus:border-b shadcn-select-focused pt-7 pb-4">
            <SelectValue placeholder="Choose Speciality" />
          </SelectTrigger>
          <SelectContent className="">
            <SelectItem value="physiotherapist">physiotherapist</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="cardiologist">Cardiologist</SelectItem>
          </SelectContent>
        </Select>
        <div className="w-full justify-center flex flex-col items-center">
          <div className="w-full justify-center flex flex-col items-center">
            <input
              type="file"
              accept="image/"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />

            <Button
              variant="outline"
              className={`self-center shadow-md py-10 w-[80%] ${
                previewUrl ? "hidden" : "flex"
              } bg-gray-100 border-dotted border-2 border-black`}
              onClick={handleButtonClick}
            >
              {imageLoading ? (
                <div className="h-full w-full flex items-center gap-2 justify-center">
                  {" "}
                  <Loader2 className="animate-spin size-30" />
                  Uploading Image
                </div>
              ) : (
                <p>{"+ Upload Doctor Image"}</p>
              )}
            </Button>

            {previewUrl && (
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
                  {imageLoading ? (
                    <div className="flex gap-2 items-center">
                      <Loader2 className="animate-spin" />
                      Removing Image
                    </div>
                  ) : (
                    <p>{"Remove Image"}</p>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
        <Button onClick={handleSubmit} className="w-[80%]">
          {
            loading ? <div className="flex items-center gap-2"><Loader2 className="animate-spin size" />Submitting</div> : (
              <p>Submit</p>
            )
          }
        </Button>
      </div>
    </div>
  );
};

export default Form;
