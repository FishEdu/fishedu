import Ionicons from "@expo/vector-icons/Ionicons";
import InputGroup from "../FormInputs/InputGroup";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { StyleSheet } from "react-native";
import { debounce } from "@/app/utils/debounce";
import { fetchFish, FishGetResponse } from "@/app/utils/fetch/fish/fetchFish";

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
  
  return (
    <InputGroup
       styles={{
        containerStyles: styles.container,
        titleStyles: {},
        inputStyles: styles.input,
        inputWrapper: styles.inputWrapper,
      }}
      inputProps={{
        placeholder: getTranslation('fishSerach.searchFish', languageCode),
        onChangeText: debounce((fishQuery: string) => {
          fishQuery = fishQuery.trim().toLowerCase()
          console.log(`FishQuery: ${fishQuery}, last: ${lastFishQuery}`)

          if(fishQuery === lastFishQuery)
            return

          console.log('Fetching from input')
          fetchFish(fishQuery)
            .then(({ fish }) => { 
              setFish(fish)
              setLastFishQuery(fishQuery)
            })
        }, 500)
      }}
      icon={<Ionicons name='search' size={20} />}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    fontSize: 20
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 24,
    marginBottom: 24
  },
  inputWrapper: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBlock: 12,
    paddingInline: 8,
    borderRadius: 24
  }
})

  // containerStyles?: StyleProp<ViewStyle>,
  // titleStyles?: StyleProp<TextStyle>,
  // inputStyles?: StyleProp<TextStyle>,
  // inputWrapper?: StyleProp<ViewStyle>