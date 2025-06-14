"use server"

import prisma from "@/lib/prisma"
import { cookies } from "next/headers"

export const  getMrDetails = async () => {
    const mrId = cookies().get("user")?.value as string 

    const mrDetails = await prisma.mr.findUnique({
        where : {
            mid : mrId
        }
    })

    return mrDetails
}