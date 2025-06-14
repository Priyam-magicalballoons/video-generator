import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

function sanitize(name: string) {
  return name.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, mr, doctor, fileName } = body;

    if (!url || !mr || !doctor || !fileName) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const fileRes = await fetch(url);
    if (!fileRes.ok) {
      return NextResponse.json({ error: "Failed to fetch file." }, { status: 400 });
    }

    const contentType = fileRes.headers.get("content-type") || "";
    const extensionMap: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/gif": ".gif",
      "application/pdf": ".pdf",
    };

    const extension = extensionMap[contentType] || "";
    const finalFileName = `${sanitize(doctor.name)}-i-pledge${extension}`;

    // Construct the updated folder structure:
    const savePath = path.join(
      process.cwd(),
      "public",
      "ajanta-pharma",
      sanitize(mr.name),
      `HQ - ${sanitize(mr.Hq)}`,
      `Designation - ${sanitize(mr.desg)}`,
      "Doctors"
    );

    // Ensure all directories exist
    await fs.mkdir(savePath, { recursive: true });

    const fileBuffer = await fileRes.arrayBuffer();
    await fs.writeFile(path.join(savePath, finalFileName), Buffer.from(fileBuffer));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Save error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
