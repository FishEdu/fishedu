import { FishGetResponse } from "@/app/api/fish";
import { AppColors } from "@/app/constants/theme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { debounce } from "@/app/utils/debounce";
import { fetchFish } from "@/app/utils/fetch/fish/fetchFish";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";
import InputGroup from "../FormInputs/InputGroup";

type LocalProps  = {
  lastFishQuery: string,
  setLastFishQuery: React.Dispatch<
    React.SetStateAction<string>>,
  setFish: React.Dispatch<
    React.SetStateAction<FishGetResponse[]>
  >
}

export default function FishSearchInput ({ lastFishQuery, setFish, setLastFishQuery }: LocalProps) {
  const { languageCode } = useLanguage()
  const { colors } = useTheme()
  const styles = createStyles(colors)
  
  return (
    <InputGroup
       styles={{
        containerStyles: styles.container,
        titleStyles: {},
        inputStyles: styles.input,
        inputWrapper: styles.inputWrapper,
      }}
      inputProps={{
        placeholder: getTranslation('fishSearch.searchFish', languageCode),
        placeholderTextColor: colors.text.muted,
        onChangeText: debounce((fishQuery: string) => {
          fishQuery = fishQuery.trim().toLowerCase()

          if(fishQuery === lastFishQuery)
            return

          fetchFish(fishQuery)
            .then(({ fish }) => { 
              setFish(fish)
              setLastFishQuery(fishQuery)
            })
        }, 500)
      }}
      icon={<Ionicons name='search' size={21} color={colors.text.main} />}
    />
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  input: {
    color: colors.text.main,
    fontSize: 16,
    width: '100%',
    overflow: 'hidden'
  },
  container: {
    backgroundColor: colors.background.card,
    borderColor: colors.border.card,
    borderRadius: 10,
    borderWidth: 1,
    elevation: 1,
    marginBottom: 2,
    overflow: 'hidden'
  },
  inputWrapper: {
    backgroundColor: colors.background.card,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBlock: 9,
    paddingInline: 12,
    borderRadius: 10,
  }
})
