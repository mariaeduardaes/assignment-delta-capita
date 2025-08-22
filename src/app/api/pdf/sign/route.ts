import { NextResponse } from "next/server"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

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

  const arrayBuffer = await file.arrayBuffer()
  
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  firstPage.drawText("Digital signed - Delta Capita", {
    x: 50,
    y: 150,
    size: 18,
    font: helveticaFont,
    color: rgb(1, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();

  const signedFile = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" })

  return new Response(signedFile, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=signed.pdf",
    },
  })
}