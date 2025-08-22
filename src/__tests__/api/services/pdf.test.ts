/* eslint-disable @typescript-eslint/no-explicit-any */
import { pdfServerService } from "@/services/server/pdf";
import { PDFDocument } from "pdf-lib";

describe("pdfServerService.signPdf", () => {
  beforeEach(() => {
    // minimum mock for blob (jest doesnt have)
    global.Blob = class {
      parts: any;
      type: string;
      constructor(parts: any[], options: { type: string }) {
        this.parts = parts;
        this.type = options.type;
      }
      arrayBuffer() {
        // returns the concatenation of the parts in ArrayBuffer
        const bytes =
          this.parts[0] instanceof Uint8Array
            ? this.parts[0]
            : new Uint8Array([]);
        return Promise.resolve(bytes.buffer);
      }
    } as any;
  });
  
  it("should return a Blob of type application/pdf", async () => {
    // mock pdf
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage();
    const pdfBytes = await pdfDoc.save();

    // mocked file with arrayBuffer
    const file = {
      arrayBuffer: async () => pdfBytes,
      name: "test.pdf",
      type: "application/pdf",
    } as unknown as File;

    const result = await pdfServerService.signPdf(file);

    expect(result).toBeInstanceOf(Blob);
    expect(result.type).toBe("application/pdf");

    const arrayBuffer = await result.arrayBuffer();
    expect(arrayBuffer.byteLength).toBeGreaterThan(0);
  });

  it("should throw if an invalid PDF is provided", async () => {
    const invalidFile = {
      arrayBuffer: async () => new Uint8Array([1, 2, 3]),
      name: "invalid.pdf",
      type: "application/pdf",
    } as unknown as File;

    await expect(pdfServerService.signPdf(invalidFile)).rejects.toThrow();
  });
});
