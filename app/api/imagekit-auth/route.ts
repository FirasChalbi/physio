import { NextResponse } from "next/server"
import imagekit from "@/lib/imagekit"

export async function GET() {
    try {
        const authParams = imagekit.getAuthenticationParameters()
        return NextResponse.json(authParams)
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to generate auth parameters" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File
        const folder = (formData.get("folder") as string) || "/Life"
        const fileName = (formData.get("fileName") as string) || file.name

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const result = await imagekit.upload({
            file: buffer,
            fileName: fileName,
            folder: folder,
        })

        return NextResponse.json({
            url: result.url,
            fileId: result.fileId,
            name: result.name,
            filePath: result.filePath,
            thumbnailUrl: result.thumbnailUrl,
        })
    } catch (error: any) {
        console.error("ImageKit upload error:", error)
        return NextResponse.json(
            { error: error?.message || "Upload failed" },
            { status: 500 }
        )
    }
}
