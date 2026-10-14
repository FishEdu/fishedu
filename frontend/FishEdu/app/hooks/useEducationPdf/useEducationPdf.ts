import { Directory, File, Paths } from "expo-file-system";
import { useEffect, useState } from "react";

type PdfState = { url: string | null; localUri: string | null; hasError: boolean };

export const useEducationPdf = (url: string) => {
  const [state, setState] = useState<PdfState>({ url: null, localUri: null, hasError: false });

  useEffect(() => {
    let isActive = true;
    const downloadPdf = async () => {
      try {
        if (!url) throw new Error("Missing PDF URL");
        const directory = new Directory(Paths.cache, "pdfs");
        directory.create({ idempotent: true, intermediates: true });
        const nameFromUrl = url.split("/").pop()?.split("?")[0] || "document.pdf";
        const destination = new File(directory, nameFromUrl);
        const downloadedFile = destination.exists && destination.size > 0
          ? destination
          : await File.downloadFileAsync(url, destination, { idempotent: true });
        if (isActive) setState({ url, localUri: downloadedFile.uri, hasError: false });
      } catch {
        if (isActive) setState({ url, localUri: null, hasError: true });
      }
    };
    void downloadPdf();
    return () => { isActive = false; };
  }, [url]);

  return {
    loading: state.url !== url,
    localUri: state.url === url ? state.localUri : null,
    hasError: state.url === url && state.hasError,
    onError: () => setState(current => current.url === url ? { ...current, hasError: true } : current),
  };
};
