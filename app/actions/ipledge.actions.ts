"use server"
import prisma from "@/lib/prisma"

export const saveIpledge = async (docId :string,imageUrl : string)=>{
    try {

        const createIpledge = await prisma.iPledge.create({
            data : {
                url : imageUrl,
                docId
            }
        })

        const updateDoc =await prisma.doctor.update({
            where : {
                id : docId
            },data : {
                ipledgeId : createIpledge.id
            }
        })

        if(createIpledge && updateDoc){
            return {
                status : 200,
            }
        }else{
            return {
                status : 400
            }
        }
    } catch (error) {
        console.log(error)
        return {
            status : 400
        }
    }
}