"use server"
import prisma from "@/lib/prisma"

export const getAllDoctorVideos = async ()=>{
  try {
    const videos = await prisma.video.findMany({
      select : {
        docId : true,
        refImageUrl : true,
        refVideoUrl : true,
        url : true,
        id : true
      }
    })

    const doctorsWithVideos = await Promise.all(videos.map(async(video)=>{
      const doctor = await prisma.doctor.findFirst({
        where : {
          id : video.docId!
        },select : {
          name : true,
        }
      })
      return {
        ...video,
        doctor
      }
    }))

    console.log(doctorsWithVideos)
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