import { EducationMaterial } from "@/app/api/education";
import type { LanguageCode } from "@/app/constants/language";
import { getBaseApiUrl } from "@/app/utils/getBaseApiUrl";
import { useEffect, useState } from "react";

type FetchState = { url: string | null; material: EducationMaterial | null; loading: boolean };

export const useFetchEducationMaterial = (id: string, language: LanguageCode) => {
  const url = `${getBaseApiUrl()}/education-materials/${id}?language=${language}`;
  const [state, setState] = useState<FetchState>({ url: null, material: null, loading: true });

  useEffect(() => {
    const controller = new AbortController();
    const loadMaterial = async () => {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Could not fetch education material");
        const material = await response.json() as EducationMaterial;
        if (!controller.signal.aborted) setState({ url, material, loading: false });
      } catch {
        if (!controller.signal.aborted) setState({ url, material: null, loading: false });
      }
    };
    void loadMaterial();
    return () => controller.abort();
  }, [url]);

  return {
    material: state.url === url ? state.material : null,
    loading: state.url !== url || state.loading,
  };
};
