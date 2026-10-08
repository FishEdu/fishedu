import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import Ionicons from "@expo/vector-icons/Ionicons"
import InputGroup from "../FormInputs/InputGroup"
import { StyleSheet } from "react-native"

type LocalProps = {
  placeholder: string,
  onChangeText: (value: string) => void
}

export default function RecordSearchInput({ placeholder, onChangeText }: LocalProps) {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  return (
    <InputGroup
      styles={{
        containerStyles: styles.container,
        inputStyles: styles.input,
        inputWrapper: styles.inputWrapper,
      }}
      inputProps={{
        placeholder,
        onChangeText,
      }}
      icon={<Ionicons name="search" size={20} color={colors.text.muted} />}
    />
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: 4,
    marginBottom: 16,
  },
  inputWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingBlock: 8,
    paddingInline: 10,
  },
  input: {
    color: colors.text.main,
    flex: 1,
    fontSize: 14,
  }
})
