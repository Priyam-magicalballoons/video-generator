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

      console.log(create)
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

export const getAllDoctors = async ()=>{
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
    }
  })

  return retrieve
}

export const editDoctor = async (name : string,number:string,imageUrl : string, speciality:string,id:string) => {
  try {
    const edit = await prisma.doctor.update({
    where : {
      id
    },
    data : {
      imageUrl,
      name,
      number,
      speciality
    }
  })

  console.log(edit)
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