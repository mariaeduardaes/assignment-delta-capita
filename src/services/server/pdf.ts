import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const pdfServerService = {
  signPdf: async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();

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

    return new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
  },
};
