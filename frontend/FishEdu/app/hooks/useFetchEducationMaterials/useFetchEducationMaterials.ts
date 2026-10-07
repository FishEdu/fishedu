import { EducationLevel, EducationMaterial, EducationMaterialType } from "@/app/api/education";
import { LanguageCode } from "@/app/constants/language";
import { getBaseApiUrl } from "@/app/utils/getBaseApiUrl";
import { useEffect, useState } from "react";

type Filters = {
  language: LanguageCode;
  type: EducationMaterialType | "all";
  level: EducationLevel | "all";
  search: string;
};

type FetchState = {
  url: string | null;
  data: EducationMaterial[];
  loading: boolean;
  error: boolean;
};

export const useFetchEducationMaterials = ({ language, type, level, search }: Filters) => {
  const params = new URLSearchParams({ language });
  if (level !== "all") params.set("level", level);
  if (type !== "all") params.set("type", type);
  if (search.trim()) params.set("query", search.trim());
  const url = `${getBaseApiUrl()}/education-materials?${params.toString()}`;
  const [state, setState] = useState<FetchState>({
    url: null,
    data: [],
    loading: true,
    error: false,
  });

  useEffect(() => {
    const controller = new AbortController();
    const delay = setTimeout(async () => {
      setState({ url, data: [], loading: true, error: false });

      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Could not fetch education materials");
        const data = await response.json() as EducationMaterial[];
        if (!controller.signal.aborted) {
          setState({ url, data, loading: false, error: false });
        }
      } catch (fetchError) {
        if (!controller.signal.aborted && (fetchError as Error).name !== "AbortError") {
          setState({ url, data: [], loading: false, error: true });
        }
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(delay);
    };
  }, [url]);

  const isCurrentRequest = state.url === url;
  return {
    data: isCurrentRequest ? state.data : [],
    loading: !isCurrentRequest || state.loading,
    error: isCurrentRequest && state.error,
  };
};
