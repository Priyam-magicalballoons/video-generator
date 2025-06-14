"use server"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"

export const addDoctor = async (name : string,number:string,imageUrl : string, speciality:string,) => {
    try {
      const mrId = cookies().get("user")?.value as string
      const create = await prisma.doctor.create({
        data : {
            name,
            number,
            speciality,
            mrId,
            imageUrl,
        },select :{
          name : true,
          speciality : true,
        }
      })
      return {
        status : 200,
        data : create
      }
    } catch (error) {
      console.log(error)
      return {
        status : 400
      }
    }
}

export const getAllDoctors = async (type:string = "")=>{
  const mrId = cookies().get("user")?.value as string
  const retrieve = await prisma.doctor.findMany({
    where : {
      mrId
    },select : {
      imageUrl : true,
      name : true,
      speciality : true,
      number : true,
      id : true,
      videoId : true,
      ipledgeId : true,
      posterId : true,
    }
  })

  const videos = await Promise.all(retrieve.map(async(doc)=>{
    if(doc.videoId){
    const video = await prisma.video.findFirst({
      where : {
        id : doc.videoId
      },select : {
        url : true
      }
    })
    return {
      ...doc,
      video
    }
  }
  }))

  if(type === "poster"){
    const posterUrls = await Promise.all(videos.map(async(doc)=>{
      if(doc){
        const url = await prisma.poster.findFirst({
          where : {
            docId : doc?.id,
          },select : {
            url_1 : true,
            url_2 : true
          }
        })
        
        return {
          ...doc,
          url
        }
      }
    }))

    return posterUrls
  }

  return retrieve
}

export const editDoctor = async (number:string,id:string) => {
  try {
    const edit = await prisma.doctor.update({
    where : {
      id
    },
    data : {
      number,
    }
  })

  if(edit){
    return {
      status : 200,
    }
  }
  } catch (error) {
    console.log(error)
    return {
      status : 400,
    }
  }
}

export const getSingleDetails = async (docId:string)=> {
  try {
    const detail = await prisma.doctor.findUnique({
    where : {
      id : docId
    },select :{
      ipledgeId : true,
      posterId : true,
      videoId : true
    }
  })

  if(detail){
    return {
    status : 200,
    data : detail
  }
  }else{
    return {
      status : 400
    }
  }
  } catch (error) {
    console.log(error)
    return {
      status : 400,
    }
  }
}