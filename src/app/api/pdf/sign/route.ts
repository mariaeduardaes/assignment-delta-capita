import { pdfServerService } from "@/services/server/pdf";
import { NextResponse } from "next/server"

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb"
    },
  }
};

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
  }

  const signedFile = await pdfServerService.signPdf(file);

  return new Response(signedFile, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=signed.pdf",
    },
  })
}