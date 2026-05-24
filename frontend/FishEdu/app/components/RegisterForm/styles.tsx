import { StyleSheet } from "react-native";

export const registerFormStyles = StyleSheet.create({
  inputContainerStyles: {
    paddingBlock: 16,
    fontSize: 20
  },
  titleStyles: {
    fontSize: 32,
    fontWeight: "600",
    paddingBottom: 8
  },
  inputStyles: {
    color: "hsl(0, 0%, 35%)",
  },
  inputWrapper: {
    backgroundColor: "white",
    paddingBlock: 8,
    paddingInline: 12,
    borderRadius: 12
  },
  submitBtn: {
    marginBlock: 16,
    backgroundColor: "hsl(226, 75%, 59%)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center"
  },
  submitText: {
    color: "white",
    fontSize: 24,
    fontWeight: "600"
  }
})
