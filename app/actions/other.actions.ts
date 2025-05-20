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

    return doctorsWithVideos
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

  export const checkIsUploaded = async (docId : string)=>{
    try {
      const isVideoUploaded = prisma.video.findFirst({
      where : {
        docId 
      },select : {
        refVideoUrl : true,
        url : true
      }
    })

    const isPosterUploaded = prisma.poster.findFirst({
      where : {
        docId
      },select : {
        url_1 : true,
        url_2 : true
      }
    })

    const isIpledgeUploaded = prisma.iPledge.findFirst({
      where : {
        docId
      },select : {
        url : true
      }
    })

    const isUploaded = await prisma.$transaction([isVideoUploaded,isIpledgeUploaded,isPosterUploaded])

    if(isUploaded){
      return {
        status : 200,
        data : {
          video : isUploaded[0],
          poster : isUploaded[2],
          ipledge : isUploaded[1]
        }
      }
    }else{
      return {
        status : 200
      }
    }
    } catch (error) {
      console.log(error)
       return {
        status : 200
      }
    }
  }