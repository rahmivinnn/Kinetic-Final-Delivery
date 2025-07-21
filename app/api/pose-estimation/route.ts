import { NextResponse } from "next/server"
import { spawn } from "child_process"
import { promises as fs } from "fs"
import path from "path"
import { IncomingForm } from "formidable"
import { Readable } from "stream"

export const config = {
  api: {
    bodyParser: false,
  },
}

async function parseForm(req: Request) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ keepExtensions: true })
    form.parse(req as any, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })
}

export async function POST(req: Request) {
  try {
    // Parse multipart form
    const { fields, files }: any = await parseForm(req)
    const file = files?.file
    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 })
    }

    // Path to uploaded file
    const filePath = file.filepath || file.path

    // Jalankan script Python (OpenPose)
    const pythonProcess = spawn("python", [
      path.resolve(process.cwd(), "run_openpose.py"),
      filePath
    ])

    let output = ""
    let error = ""
    pythonProcess.stdout.on("data", (data) => {
      output += data.toString()
    })
    pythonProcess.stderr.on("data", (data) => {
      error += data.toString()
    })

    await new Promise((resolve) => pythonProcess.on("close", resolve))

    if (error) {
      return NextResponse.json({ success: false, message: error }, { status: 500 })
    }

    // Hapus file setelah proses
    await fs.unlink(filePath)

    // Kirim hasil ke frontend
    return NextResponse.json({ success: true, result: JSON.parse(output) })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
} 