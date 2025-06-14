import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: Request) {
  try {
    const { base64Image, doctorName, type, RSM, HQ, SO } = await req.json();

    if (!base64Image || !doctorName || !RSM || !HQ || !SO) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Extract base64 data from Data URL
    const matches = base64Image.match(/^data:image\/png;base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
    }

    const base64Data = matches[1];
    const buffer = Buffer.from(base64Data, "base64");

    // Sanitize inputs for safe folder/file names
    const safeDoctorName = doctorName.replace(/[^a-z0-9_\-]/gi, "_");
    const safeRSM = RSM.replace(/[^a-z0-9_\-]/gi, "_");
    const safeHQ = HQ.replace(/[^a-z0-9_\-]/gi, "_");
    const safeSO = SO.replace(/[^a-z0-9_\-]/gi, "_");

    // Updated folder structure: RSM-RSMname/HQ/SO-SOname/DoctorName
    const folderPath = path.join(
      process.cwd(),
      "public",
      "ajanta-pharma",
      `RSM-${safeRSM}`,
      safeHQ,
      `SO-${safeSO}`,
      safeDoctorName
    );

    // Ensure folder exists
    await fs.mkdir(folderPath, { recursive: true });

    // Create file: QR.png or sticker.png
    const fileName = `${type}.png`;
    const filePath = path.join(folderPath, fileName);

    // Save file
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ message: "Saved successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error saving image:", error);
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }
}
