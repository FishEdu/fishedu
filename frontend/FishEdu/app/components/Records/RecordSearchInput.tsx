import Ionicons from "@expo/vector-icons/Ionicons"
import InputGroup from "../FormInputs/InputGroup"
import { StyleSheet } from "react-native"

type LocalProps = {
  placeholder: string,
  onChangeText: (value: string) => void
}

export default function RecordSearchInput({ placeholder, onChangeText }: LocalProps) {
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
      icon={<Ionicons name="search" size={20} color="hsl(0, 0%, 25%)" />}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
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
    flex: 1,
    fontSize: 14,
  }
})
