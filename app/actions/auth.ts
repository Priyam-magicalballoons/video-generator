"use server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function isAuthenticate(id: string, password: string) {
  const data = await prisma.mr.findUnique({
    where: {
      mid: id,
    },
  });
  if (data) {
    cookies().set({
        name : "user",
        value : data.id,
        maxAge : 60 * 60 *24*7,
        httpOnly : true,
        secure : process.env.NODE_ENV === 'production',
        sameSite : "lax",
        path : "/"
    })
    return {
      status: 200,
      data: data,
    };
  } else {
    return {
      status: 400,
    };
  }
}
