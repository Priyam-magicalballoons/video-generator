"use server";
import prisma from "@/lib/prisma";

export const getAllDoctorVideos = async () => {
  try {
    const videos = await prisma.video.findMany({
      select: {
        docId: true,
        refImageUrl: true,
        refVideoUrl: true,
        url: true,
        id: true,
      },
    });

    const doctorsWithVideos = await Promise.all(
      videos.map(async (video) => {
        const doctor = await prisma.doctor.findFirst({
          where: {
            id: video.docId!,
          },
          select: {
            name: true,
            mrId : true
          },
        });
        return {
          ...video,
          doctor,
        };
      })
    );

    const docWithVideoWithMr = await Promise.all(
      doctorsWithVideos.map(async(doc)=>{
        const mr = await prisma.mr.findUnique({
          where : {
            id : doc.doctor?.mrId
          },select : {
            name : true,
             region : true,
             Hq : true,
             mid : true,
             desg : true,
          }
        })
        return {
          ...doc,
          mr
        }
      })
    )


    return docWithVideoWithMr;
  } catch (error) {
    console.log(error);
  }
};

export const getAllDoctorPosters = async () => {
  try {
    const posters = await prisma.poster.findMany({
      select: {
        docId: true,
        url_1 : true,
        url_2 : true,
        id: true,
      },
    });

    const doctorsWithVideos = await Promise.all(
      posters.map(async (poster) => {
        const doctor = await prisma.doctor.findFirst({
          where: {
            id: poster.docId!,
          },
          select: {
            name: true,
            mrId : true
          },
        });
        return {
          ...poster,
          doctor,
        };
      })
    );

    const docWithPosterWithMr = await Promise.all(
      doctorsWithVideos.map(async(doc)=>{
        const mr = await prisma.mr.findFirst({
          where : {
            id : doc.doctor?.mrId
          },select : {
            name : true,
             region : true,
             Hq : true,
             mid : true,
             desg : true,
          }
        })
        return {
          ...doc,
          mr
        }
      })
    )


    return docWithPosterWithMr;
  } catch (error) {
    console.log(error);
  }
}

export const getAllDoctorIpledges = async () => {
  try {


    //  const orphanedIpledges = await prisma.$queryRaw`
    //   SELECT * FROM "IPledge"
    //   WHERE "docId" IS NOT NULL
    //   AND "docId" NOT IN (SELECT "id" FROM "Doctor");
    // `;
    // console.log(orphanedIpledges)

    const ipledges = await prisma.iPledge.findMany({
      select: {
        docId: true,
        url : true,
        id: true,
      },
    });


    const doctorsWithIpledges = await Promise.all(
      ipledges.map(async (ipledge) => {
        const doctor = await prisma.doctor.findFirst({
          where: {
            id: ipledge.docId!,
          },
          select: {
            name: true,
            mrId : true
          },
        });
        return {
          ...ipledge,
          doctor,
        };
      })
    );
    
    console.log(doctorsWithIpledges)
    
    const docWithIpledgeWithMr = await Promise.all(
      doctorsWithIpledges.map(async(doc)=>{
        const mr = await prisma.mr.findUnique({
          where : {
            id : doc.doctor?.mrId
          },select : {
            name : true,
             region : true,
             Hq : true,
             mid : true,
             desg : true,
          }
        })
        return {
          ...doc,
          mr
        }
      })
    )


    return docWithIpledgeWithMr;
  } catch (error) {
    console.log(error);
  }
}

export const updateUrl = async (videoId: string, url: string) => {
  try {
    const update = await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        url,
      },
    });

    if (update) {
      console.log(update);
      return {
        status: 200,
        data: update,
      };
    }
  } catch (error) {
    console.log(error);
  }
};

export const checkIsUploaded = async (docId: string) => {
  try {
    const isVideoUploaded = prisma.video.findFirst({
      where: {
        docId,
      },
      select: {
        refVideoUrl: true,
        url: true,
      },
    });

    const isPosterUploaded = prisma.poster.findFirst({
      where: {
        docId,
      },
      select: {
        url_1: true,
        url_2: true,
      },
    });

    const isIpledgeUploaded = prisma.iPledge.findFirst({
      where: {
        docId,
      },
      select: {
        url: true,
      },
    });

    const isUploaded = await prisma.$transaction([
      isVideoUploaded,
      isIpledgeUploaded,
      isPosterUploaded,
    ]);

    if (isUploaded) {
      return {
        status: 200,
        data: {
          video: isUploaded[0],
          poster: isUploaded[2],
          ipledge: isUploaded[1],
        },
      };
    } else {
      return {
        status: 200,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: 200,
    };
  }
};

export const getVideoUrl = async (docId: string) => {
  try {
    const data = await prisma.video.findFirst({
      where: {
        docId,
      },
      select: {
        url: true,
      },
    });
    if (data) {
      return {
        status: 200,
        data,
      };
    } else {
      return {
        status: 400,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: 400,
    };
  }
};
