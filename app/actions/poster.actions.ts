"use server"
import prisma from "@/lib/prisma"

export const createPosters = async (docId:string,poster_1_url:string,poster_2_url:string)=> {


    try {
        const checkExistingPoster = await prisma.doctor.findUnique({
        where : {
            id : docId  
        },
        select : {
            posterId : true
        }
    })

    if (!checkExistingPoster?.posterId) {
        const createPoster = await prisma.poster.create
        ({
            data : {
                docId,
                url_1 : poster_1_url,
                url_2 : poster_2_url
            }
        })
        
        const updateDoc = await prisma.doctor.update({
            where: {
                id : docId,
            },
            data : {
                posterId : createPoster.id
            }
        })

        return {
            status : 200
        }
    }else{
        if(poster_1_url){
            const updatePoster1 = await prisma.poster.update({
                where : {
                    id : checkExistingPoster.posterId
                },
                data : {
                    url_1 : poster_1_url
                }
            })

            return {
                status : 200,
            }
        }else if(poster_2_url){
             const updatePoster2 = await prisma.poster.update({
                where : {
                    id : checkExistingPoster.posterId
                },
                data : {
                    url_2 : poster_2_url
                }
            })
             return {
                status : 200,
            }
        }else{
            return {
                status : 400
            }
        }
    }
    } catch (error) {
        console.log(error)
        return {
            status  : 400
        }
    }
}