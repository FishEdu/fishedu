import { EducationLevel, EducationMaterial, EducationMaterialType } from "@/app/api/education";
import { LanguageCode } from "@/app/(tabs)/settings";
import { getBaseApiUrl } from "@/app/utils/getBaseApiUrl";
import { useEffect, useState } from "react";

type Filters = {
  language: LanguageCode;
  type: EducationMaterialType | "all";
  level: EducationLevel | "all";
  search: string;
};

export const useFetchEducationMaterials = ({ language, type, level, search }: Filters) => {
  const [data, setData] = useState<EducationMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const delay = setTimeout(async () => {
      setLoading(true);
      setError(false);

      const params = new URLSearchParams({ language });
      params.set("level", level);
      params.set("material_type", type);
      if (search.trim()) params.set("query", search.trim());

      try {
        console.log(`${getBaseApiUrl()}/education-materials?${params.toString()}`)
        const response = await fetch(
          `${getBaseApiUrl()}/education-materials?${params.toString()}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Could not fetch education materials");
        
        setData(await response.json());
      } catch (fetchError) {
        if ((fetchError as Error).name !== "AbortError") {
          setData([]);
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(delay);
    };
  }, [language, type, level, search]);

  return { data, loading, error };
};
