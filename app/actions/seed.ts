"use server";

import path from "path";
import fs from "fs/promises";
import { read, utils } from "xlsx";
import prisma from "@/lib/prisma";

export async function seedFromExcel() {
  try {
    const filePath = path.join(process.cwd(), "public", "final.xlsx");
    const fileBuffer = await fs.readFile(filePath);
    const workbook = read(fileBuffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[3]];
    const json = utils.sheet_to_json(sheet) as any[];

    // Step 1: Collect all unique EmployeeIDs from Excel
    const employeeIDs: string[] = Array.from(
      new Set(json.map((row) => String(row.EmployeeID)).filter(Boolean))
    );

    const count = await prisma.doctor.count();
    console.log(count);
    return;

    // Step 2: Fetch MRs in a single DB call
    const mrs = await prisma.mr.findMany({
      where: { mid: { in: employeeIDs } },
      select: { id: true, mid: true },
    });

    const mrMap = new Map<string, string>();
    mrs.forEach((mr) => mrMap.set(mr.mid, mr.id));

    // Step 3: Prepare candidate doctors with resolved mrId
    const candidates = json
      .map((row) => {
        const mrId = mrMap.get(String(row.EmployeeID));
        if (!mrId || !row.DoctorName) return null;

        return {
          name: String(row.DoctorName).trim(),
          mrId,
        };
      })
      .filter(Boolean) as { name: string; mrId: string }[];

    if (candidates.length === 0) {
      console.log("No valid candidates found.");
      return { success: false, error: "No valid data to insert." };
    }

    // Step 4: Fetch existing doctors to avoid duplicates
    const existingDoctors = await prisma.doctor.findMany({
      where: {
        OR: candidates.map((c) => ({
          name: c.name,
          mrId: c.mrId,
        })),
      },
      select: {
        name: true,
        mrId: true,
      },
    });

    const existingSet = new Set(
      existingDoctors.map((d) => `${d.name}|${d.mrId}`)
    );

    // Step 5: Filter new records
    const toInsert = candidates.filter(
      (d) => !existingSet.has(`${d.name}|${d.mrId}`)
    );

    if (toInsert.length === 0) {
      console.log("All records already exist. Nothing to insert.");
      return { success: true, inserted: 0, skipped: candidates.length };
    }

    // Step 6: Insert remaining doctors in bulk
    const result = await prisma.doctor.createMany({
      data: toInsert,
      skipDuplicates: true,
    });

    console.log(
      `Inserted: ${result.count}, Skipped: ${candidates.length - result.count}`
    );
    return {
      success: true,
      inserted: result.count,
      skipped: candidates.length - result.count,
    };
  } catch (err) {
    console.error("Error seeding from Excel:", err);
    return { success: false, error: "An error occurred while seeding." };
  }
}
