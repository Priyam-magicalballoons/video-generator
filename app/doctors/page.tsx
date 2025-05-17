"use client";

// import Form from "@/components/Form";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Plus, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { getAllDoctors } from "@/app/actions/doctor.actions";
import { useRouter } from "next/navigation";
import { useDoctorStore } from "@/lib/stores/useDoctorStore";
import { useModuleStore } from "@/lib/stores/useModuleStore";

export default function Home() {
  const [doctors, Setdoctors] = useState<any[]>([]);
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isEditModuleOpen, SetisEditModuleOpen] = useState(false)
  const { setDoctor } = useDoctorStore();
  const { name } = useModuleStore();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const data = await getAllDoctors();
      setAllDoctors(data);
      console.log(data)
      Setdoctors(data);
      setLoading(false);
    };
    getData();
  }, []);

  const filteredDoctors = useMemo(() => {
    if (!searchValue.trim()) return allDoctors;
    return allDoctors.filter((doc) =>
      doc.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, allDoctors]);

  const openModelsPage = (docname: string, image: string) => {
    setDoctor({
      name: docname,
      image,
    });
    router.push(name as string);
  };

  return (
    <div
      className={` ${
        loading ? "h-screen" : "h-full"
      } flex flex-col items-center justify-center`}
    >
      <div className="w-full md:w-2/3 lg:w-1/3 md:border flex justify-start md:h-[95%] md:shadow-lg md:rounded-lg h-full sm:shadow-none sm:bottom-none flex-col py-5 bg-[#0c61aa]/10">
        <h2 className="text-4xl font-serif tracking-wider text-center py-2 pb-5">
          Choose Doctor
        </h2>
        <div className="w-full flex justify-center items-center relative py-2">
          <Search className="absolute z-20 left-[52px] md:left-16 text-gray-400 size-5" />
          <input
            type="search"
            placeholder="Search for doctors.."
            className="w-[80%] p-2 z-0 rounded-lg relative pl-10 border-none focus:outline-none focus:border-none"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="flex-1 w-[80%] self-center flex overflow-visible pb-5 flex-col gap-3 pt-2">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((data, index) => (
              <div key={index} className="w-full">
                <div className="bg-white shadow-lg p-2 rounded-xl flex gap-2 active:bg-gray-200">
                <div
                  className="flex gap-5 cursor-pointer flex-1"
                  onClick={() => openModelsPage(data.name, data.imageUrl)}
                  >
                  <div className="w-20 h-20 relative">
                    <img
                      src={data.imageUrl}
                      alt="image"
                      className="rounded-full border-gray-400 border-[1px] h-[100%] w-[100%] absolute"
                      />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-xl">{data.name}</p>
                    <p className="text-gray-600 text-sm">{data.speciality}</p>
                  </div>
                      </div>
                  <Edit size={20} className="cursor-pointer" onClick={()=>SetisEditModuleOpen(true)} />
                 
                </div>
              </div>
            ))
          ) : loading ? (
            <div className="w-full h-full items-center justify-center flex gap-3">
              <Loader2 className="animate-spin" />
              <p>Loading doctors list...</p>
            </div>
          ) : (
            <div className="w-full h-full items-center justify-center flex flex-col">
              <p>No Doctors available</p>
              <p className="text-sm text-gray-500">Kindly add some Doctors</p>
            </div>
          )}
        </div>
        <Dialog>
          <DialogTrigger className="w-full flex justify-center">
            <Button className="w-[80%]">
              <Plus />
              <p>Add Doctor</p>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95%] rounded-lg overflow-auto max-h-[80vh] md:w-1/2 lg:w-1/3">
            <DialogHeader>
              <DialogTitle></DialogTitle>
            </DialogHeader>
            {/* <Form /> */}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

//  const ffmpegRef = useRef<FFmpeg | null>(null)

//   useEffect(()=>{
//     loadFfmpeg()
//   },[])

//   const loadFfmpeg = async () => {
//     try {
//       const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
//       const ffmpeg = new FFmpeg()
//       ffmpegRef.current = ffmpeg
//        ffmpeg.on('log',({message})=>{
//         console.log(message)
//       })

//       await ffmpeg.load({
//             coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
//             wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
//         });

//     } catch (error) {
//       console.log("error",error)
//     }
//   }

//   const execute = async () => {

//     const ffmpeg = ffmpegRef.current
//     if(!ffmpeg) throw new Error(":ffmpeg not loaded")
//     const blob = new Blob([video!], { type: video?.type });
//     await ffmpeg.writeFile('input.mp4', await fetchFile(base64String!))
//     await ffmpeg.writeFile('arial.ttf', await fetchFile('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/arial.ttf'));

// // Run FFmpeg command
//     await ffmpeg.exec([
//     "-i", "input.mp4",
//     "-vf", "drawtext=text='Custom Text':fontfile=arial.ttf:fontsize=24:fontcolor=white:x=100:y=50",
//     "-c:a", "copy",
//     "output.mp4"
//     ]);

// const outputData = (await ffmpeg.readFile("output.mp4")) as Uint8Array;
// const url = URL.createObjectURL(
//     new Blob([outputData.buffer] , {type : "video/mp4"})
//     )
//     setVideoUrl(url)
//   }
