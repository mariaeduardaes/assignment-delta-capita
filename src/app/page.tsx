"use client";

import { pdfClientService } from "@/services/client/pdf";
import { CloudDownload } from "lucide-react";
import { useRef, useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const delayWithProgress = async (ms: number) => {
    setProgress(0);
    return new Promise<void>((resolve) => {
      let elapsed = 0;
      const interval = 100; // 100ms refresh
      const timer = setInterval(() => {
        elapsed += interval;
        setProgress(Math.min(100, Math.floor((elapsed / ms) * 100)));
        if (elapsed >= ms) {
          clearInterval(timer);
          resolve();
        }
      }, interval);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    setLoading(true);
    try {
      // simulating a "processing time" with bar
      await delayWithProgress(3000);

      await pdfClientService.upload(selectedFile);

      if (inputRef.current) inputRef.current.value = "";
      setFile(null);
    } catch (error) {
      console.error("Erro ao enviar PDF:", error);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white-200 p-4">
      <div className="md:max-w-120 flex flex-col md:flex-row items-center">
        <div className="md:mr-4">
          <h1 className="text-2xl font-semibold mb-2">Sign your PDF here</h1>
          <h2 className="text-l font-normal mb-8">
            Upload a PDF document for signing it
          </h2>
        </div>
        <div className="flex gap-8 w-full md:w-[800px]">
          <label className="flex-1 bg-white p-12 rounded-lg shadow-md flex flex-col items-center justify-center hover:bg-gray-50 transition">
            <div className="border-4 p-8 rounded-lg cursor-pointer border-dotted border-gray-200 items-center justify-center flex flex-col w-full">
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
                aria-label="upload"
              />
              <CloudDownload size={50} className="text-gray-400 mb-6" />
              <p className="text-blue-400 text-center font-semibold">
                {file ? file.name : "Tap to upload your PDF file"}
              </p>

              {loading && (
                <div className="w-full mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-400 h-2 rounded-full transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-blue-400 mt-2 text-sm">
                    Processing... {progress}%
                  </p>
                </div>
              )}
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}