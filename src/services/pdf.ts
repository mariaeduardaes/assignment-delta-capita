export const pdfService = {
    upload: async (file: File): Promise<void> => {
        const formData = new FormData();
        formData.append("file", file);
        
        const response = await fetch("/api/pdf/sign", {
            method: "POST",
            body: formData,
        });

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        window.open(url, '_blank');
    }
}