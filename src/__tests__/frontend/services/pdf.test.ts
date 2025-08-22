// src/__tests__/pdfClientService.test.ts
import { pdfClientService } from "@/services/client/pdf";

describe("pdfClientService.upload", () => {
  beforeEach(() => {
    // mock global fetch
    global.fetch = jest.fn();
    // mock window.open
    global.open = jest.fn();
    // mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => "blob:http://localhost/fake-blob");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should call fetch with FormData and open the returned blob", async () => {
    const fakeBlob = new Blob(["signed pdf"], { type: "application/pdf" });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: async () => fakeBlob,
    });

    const file = new File(["dummy pdf"], "test.pdf", { type: "application/pdf" });

    await pdfClientService.upload(file);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/pdf/sign", expect.objectContaining({
      method: "POST",
      body: expect.any(FormData),
    }));

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(fakeBlob);

    expect(global.open).toHaveBeenCalledWith("blob:http://localhost/fake-blob", "_blank");
  });

  it("should throw if fetch fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      blob: async () => new Blob(),
    });

    const file = new File(["dummy pdf"], "test.pdf", { type: "application/pdf" });

    await expect(pdfClientService.upload(file)).resolves.toBeUndefined();
  });
});