import { pdfClientService } from "@/services/client/pdf";

describe("pdfClientService.upload", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    global.URL.createObjectURL = jest.fn(() => "blob:http://localhost/fake-blob");
    global.URL.revokeObjectURL = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  it("should call fetch, create anchor with correct attributes, and revoke URL", async () => {
    const fakeBlob = new Blob(["signed pdf"], { type: "application/pdf" });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: async () => fakeBlob,
    });

    const file = new File(["dummy pdf"], "test.pdf", { type: "application/pdf" });

    // spy on appendChild
    const appendChildSpy = jest.spyOn(document.body, "appendChild");

    await pdfClientService.upload(file);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/pdf/sign", expect.objectContaining({
      method: "POST",
      body: expect.any(FormData),
    }));

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(fakeBlob);

    // verifies if <a> has ben added w/ href and download
    expect(appendChildSpy).toHaveBeenCalled();
    const anchor = appendChildSpy.mock.calls[0][0] as HTMLAnchorElement;
    expect(anchor.href).toBe("blob:http://localhost/fake-blob");
    expect(anchor.download).toBe("signed.pdf");

    // timer and verifies revokeObjectURL
    jest.advanceTimersByTime(1000);
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:http://localhost/fake-blob");
  });

  it("should handle fetch errors gracefully", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const file = new File(["dummy pdf"], "test.pdf", { type: "application/pdf" });

    await pdfClientService.upload(file);

    expect(consoleSpy).toHaveBeenCalledWith("Upload failed:", expect.any(Error));
    consoleSpy.mockRestore();
  });
});