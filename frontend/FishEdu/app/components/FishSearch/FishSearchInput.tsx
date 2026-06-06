import Ionicons from "@expo/vector-icons/Ionicons";
import InputGroup from "../FormInputs/InputGroup";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { useLanguage } from "@/app/hooks/useLanguage";
import { StyleSheet } from "react-native";
import { debounce } from "@/app/utils/debounce";
import { fetchFishSingle } from "@/app/utils/fetch/fish/fetchFishSingle";
import { fetchFish, FishGetResponse } from "@/app/utils/fetch/fish/fetchFish";

type LocalProps  = {
  setFish: React.Dispatch<
    React.SetStateAction<FishGetResponse[] | undefined>
  >
}

export default function FishSearchInput ({ setFish }: LocalProps) {
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
        onChangeText: debounce((text: string) => {
          text = text.trim().toLowerCase()
          if(text === '') {
            fetchFish()
            .then((fish) => setFish(fish))
            return
          }
          
          fetchFishSingle(text)
          .then(fish => setFish([fish]))
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
    borderRadius: 24
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