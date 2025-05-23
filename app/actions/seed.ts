'use server'

import path from 'path'
import fs from 'fs/promises'
import { read, utils } from 'xlsx'
import  prisma  from '@/lib/prisma'

export async function seedFromExcel() {
  const filePath = path.join(process.cwd(), 'public', 'Manpower.xlsx')

  console.log(filePath)

  try {
    const fileBuffer = await fs.readFile(filePath)
    const workbook = read(fileBuffer, { type: 'buffer' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const json = utils.sheet_to_json(sheet)

    // const records = json.map((row: any) => ({
    //   name: row.Names,
    //   mid: String(row.EmpNo),
    //   Hq : row.HQ,
    //   desg : row.Desgn,
    //   region : String(row.Region) 
    // }))

    const records = [{
      name: "RAJBIR SINGH",
      mid: "11111",
      Hq : "Amritsar",
      desg : "SO",
      region : "PJB" 
    },{
      name: "SURAJ KUMAR THAKUR",
      mid: "22222",
      Hq : "Purnea",
      desg : "SO",
      region : "ASSAM" 
    }]

    const result = await prisma.mr.createMany({
      data: records,
      skipDuplicates: true,
    })

    console.log(result.count)
    // return { success: true, count: result.count }
  } catch (err) {
    console.error('Error seeding from Excel:', err)
    // return { success: false, error: err }
  }
}
