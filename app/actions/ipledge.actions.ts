"use server";
import prisma from "@/lib/prisma";

export const saveIpledge = async (docId: string, imageUrl: string) => {
  try {
    const createIpledge = await prisma.iPledge.create({
      data: {
        url: imageUrl,
        docId,
      },
    });

    const updateDoc = await prisma.doctor.update({
      where: { id: docId },
      data: { ipledgeId: createIpledge.id },
    });

    return { status: 200 };
  } catch (error: any) {
    console.error("Failed to save iPledge:", error);
    return {
      status: 400,
      message: error?.message || "Unknown server error",
    };
  }
};
