"use server"
import prisma from "@/lib/prisma"

export const addVideo = async (imageUrl:string,videoUrl:string,docId : string) => {
    console.log(imageUrl,videoUrl)
    const create = await prisma.video.create({
        data : {
            refImageUrl : imageUrl,
            refVideoUrl : videoUrl,
            docId
        }
    })
    console.log(create)
    return {
        status : 200
    }
}