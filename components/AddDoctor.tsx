import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Divide, Loader2, X } from "lucide-react";
import { addDoctor } from "@/app/actions/doctor.actions";

interface AddDoctorModule {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

const AddDoctor = ({ isOpen, setIsOpen }: AddDoctorModule) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [number, setNumber] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

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
      setImageLoading(true);
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
      setImageLoading(false);
    } catch (error) {
      console.log(error);
      setImageLoading(false);
    }
  };

  const handleRemove = async () => {
    try {
      setImageLoading(true);
      const res = await fetch("/api/upload", {
        method: "DELETE",
        body: JSON.stringify({
          secure_url: imageUrl,
        }),
      });

      const data = await res.json();
      if (!data.status) {
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
      setImageLoading(false);
    } catch (error) {
      console.log(error);
      setImageLoading(false);
    }
  };

  const handleSubmit = async () => {
      if (!name || !number || !speciality) {
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
        const formattedName = `${title} ${name}`
        const saveData = await addDoctor(
          formattedName,
          number,
          imageUrl,
          speciality,
        );
        console.log(saveData);
        if(saveData.status === 200){
          toast("Doctor added successfully",{
            duration : 2000,
            position : "top-center"
          })
        }
        setLoading(false);
        setIsOpen(false)
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
  return (
    <div className="">
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="w-[90%] rounded-xl">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <div className="w-full flex flex-col gap-5 py-10 justify-start">
              <div className="flex flex-col items-start gap-2 ">
                <Label htmlFor="name" className="text-gray-700">
                  Add Doctor Name
                </Label>
                <div className="w-full flex gap-2 flex-row">
                  <Select onValueChange={(e)=>setTitle(e)}>
                    <SelectTrigger className="w-1/6 border-primary">
                      <SelectValue placeholder="Dr." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr.">Mr.</SelectItem>
                      <SelectItem value="Ms.">Ms.</SelectItem>
                      <SelectItem value="Dr.">Dr.</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input className="border-primary" id="name" value={name} onChange={(e)=>setName(e.target.value)} />
                </div>
              </div>
              <div className="flex items-start flex-col gap-2">
                <Label htmlFor="mobile" className="text-gray-700">
                  Add Mobile Number / Doctor MSL Code
                </Label>
                <Input id="mobile" value=
                {number} onChange={(e)=>setNumber(e.target.value)} className="border-primary" />
              </div>
              <div className="flex items-start flex-col gap-2">
                <Label htmlFor="speciality" className="text-gray-700">
                  Speciality
                </Label>
                <Input id="speciality" value=
                {speciality} onChange={(e)=>setSpeciality(e.target.value)}  className="border-primary" />
              </div>
              <div className="flex flex-col items-start gap-2">
                <Label className="text-lg text-gray-700">Upload Image</Label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  hidden
                  onChange={handleImageChange}
                />
                <div className="flex">
                  <Button
                    onClick={handleButtonClick}
                    className={`p-12 rounded-none bg-[#FAF7F7 hover:bg-transparent ${
                      previewUrl ? "hidden" : "flex"
                    }`}
                  >
                    <img
                      src="/icons/add-image.png"
                      alt="add-image"
                      height={60}
                      width={50}
                      className=""
                    />
                  </Button>
                  {imageLoading && !previewUrl && (
                    <div className="opacity-90 bg-black h-[100px] w-[150px] absolute flex items-center justify-center">
                      <Loader2 className="animate-spin text-white size-8" />
                    </div>
                  )}
                  <div>
                    {previewUrl && (
                      <div className="flex flex-col items-center gap-2 w-full relative">
                        <img
                          src={previewUrl}
                          alt="Doctor preview"
                          className="max-w-[100px] w-[100px] max-h-[100px] h-[100px] rounded-md border aspect-auto"
                        />
                        <button
                          onClick={handleRemove}
                          className="font-semibold absolute p-1"
                        >
                          {imageLoading ? (
                            <div className="opacity-90 bg-black h-[100px] w-[100px] absolute -left-12 top-0 flex items-center justify-center">
                              <Loader2 className="animate-spin text-white size-8" />
                            </div>
                          ) : (
                            <X className="text-black -right-[70px] -top-1 absolute cursor-pointer" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full flex justify-center pt-5">
                <Button onClick={handleSubmit} className="w-1/2 rounded-full"> {loading ? <div className="flex gap-2 items-center"><Loader2 className="animate-spin" /><p>Submitting</p></div>  : "Submit"}</Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddDoctor;
