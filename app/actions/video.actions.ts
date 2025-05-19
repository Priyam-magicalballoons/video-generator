"use server"
import prisma from "@/lib/prisma"

export const addVideo = async (imageUrl:string,videoUrl:string,docId : string) => {

    console.log(docId)

    const create = await prisma.video.create({
        data : {
            refImageUrl : imageUrl,
            refVideoUrl : videoUrl,
            docId
        }
    })

    
    const updateDoctor = await prisma.doctor.update({
        where : {
            id : docId,
        },
        data : {
            videoId : create.id
        }
    })
    console.log(updateDoctor)
    return {
        status : 200
    }
}