import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UploadPage from "@/app/page";

// Mock for pdfClientService
jest.mock("@/services/client/pdf", () => ({
  pdfClientService: {
    upload: jest.fn().mockResolvedValue("ok"),
  },
}));

describe("UploadPage", () => {
  it("should render the titles correctly", () => {
    render(<UploadPage />);
    expect(screen.getByText("Sign your PDF here")).toBeInTheDocument();
    expect(
      screen.getByText("Upload a PDF document for signing it")
    ).toBeInTheDocument();
  });

  it("should allow to select a file and show the name", async () => {
    render(<UploadPage />);
    const input = screen.getByLabelText("upload") as HTMLInputElement;

    const file = new File(["dummy content"], "example.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(input, { target: { files: [file] } });

    expect(await screen.findByText("example.pdf")).toBeInTheDocument();
  });

  it("should show the message Processing... during the upload", async () => {
    render(<UploadPage />);
    const input = screen.getByLabelText("upload") as HTMLInputElement;

    const file = new File(["dummy content"], "example.pdf", {
        type: "application/pdf",
    });

    fireEvent.change(input, { target: { files: [file] } });

    expect(await screen.findByText(/Processing/i)).toBeInTheDocument();
  });

  it("should clean the input and the state after the upload", async () => {
    render(<UploadPage />);
    const input = screen.getByLabelText("upload") as HTMLInputElement;

    const file = new File(["dummy content"], "example.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(input.value).toBe(""));
  });
});