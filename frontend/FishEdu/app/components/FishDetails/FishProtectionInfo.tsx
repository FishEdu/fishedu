import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { FishGetResponse } from "@/app/api/fish";
import FishDetailSection from "./FishDetailSection";

export default function FishProtectionInfo({ fish }: { fish: FishGetResponse }) {
  const { languageCode } = useLanguage();
  const protectionLength = fish
    ? `${fish.min_protection_length} - ${fish.max_protection_length ? fish.max_protection_length : getTranslation('fishDetails.protectionLength.none', languageCode)}`
    : "";

  return (
    <FishDetailSection title={getTranslation('fishDetails.protectionInPoland', languageCode)}>

      {[
        `${getTranslation('fishDetails.protectionLength', languageCode)}: ${protectionLength}`,
        `${getTranslation('fishSearch.endangered', languageCode)}: ${fish.is_endangered
          ? getTranslation('common.yes', languageCode)
          : getTranslation('common.no', languageCode)
        }`,
      ]}
    </FishDetailSection>

  );
}
