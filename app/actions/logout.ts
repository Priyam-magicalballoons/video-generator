"use server"

import { cookies } from "next/headers"

export const logoutUser = ()=> {
    cookies().delete({
        name : "user"
    })
}