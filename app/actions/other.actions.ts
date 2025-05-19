"use server"
import prisma from "@/lib/prisma"

export const getAllDoctorVideos = async ()=>{
  try {
    const doctor = await prisma.doctor.findMany({
    select : {
        videoId : true,
        name : true,
        MR : {
            select : {
                name : true
            }
        },
    }
  })

   const doctorWithVideos = await Promise.all(
    doctor.map(async (doc) => {
        console.log(doc)
      const video = await prisma.video.findFirst({
        where: {
          id: doc.videoId!, 
        },
        select: {
          refImageUrl: true,
          refVideoUrl: true,
          url: true,
        },
      });

      return {
        ...doc,
        ...video,
      };
    })
  );

  return doctorWithVideos
  } catch (error) {
    console.log(error)
  }
  }


  export const updateUrl = async (videoId : string,url:string)=>{
    try {
      const update = await prisma.video.update({
        where : {
          id : videoId
        },data : {
          url
        }
      })

      if(update){
        console.log(update)
        return {
          status : 200,
          data : update
        }
      }
    } catch (error) {
      console.log(error)
    }
  }