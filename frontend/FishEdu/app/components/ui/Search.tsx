
import { debounce } from "@/app/utils/debounce"
import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import Ionicons from "@expo/vector-icons/Ionicons"
import { StyleSheet } from "react-native"
import InputGroup from "../FormInputs/InputGroup"

type FetchResult<T> = {
  result: T[]
}

type LocalProps<T> = {
  lastQuery: string
  placeholder: string
  setLastQuery: React.Dispatch<React.SetStateAction<string>>
  setItems: React.Dispatch<React.SetStateAction<T[]>>
  fetchFn: ((query: string) => Promise<FetchResult<T>>) | undefined
}

export default function Search<T>({
  lastQuery,
  placeholder,
  setLastQuery,
  setItems,
  fetchFn,
}: LocalProps<T>) {
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
        placeholder,
        onChangeText: debounce((query: string) => {
          query = query.trim().toLowerCase()

          if (query === lastQuery) return

          // Wyszukiwanie serwerowe zostanie podłączone później.
          if (fetchFn === undefined) return

          fetchFn(query).then(({ result }) => {
            setItems(result)
            setLastQuery(query)
          })
        }, 500),
      }}
      icon={
        <Ionicons
          name="search-outline"
          size={22}
          color={colors.primary}
        />
      }
    />
  )
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border.subtle,
      marginBottom: 20,
      overflow: "hidden",
    },
    inputWrapper: {
      backgroundColor: colors.background.card,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 18,
    },
    input: {
      flex: 1,
      color: colors.text.main,
      fontSize: 16,
      minWidth: 0,
      overflow: "hidden",
    },
  })
