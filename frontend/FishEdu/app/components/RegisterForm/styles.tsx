import convertRemToPixels from "@/app/utils/convertRemToPixels"
import { StyleSheet } from "react-native"

export const registerFormStyles = StyleSheet.create({
  inputContainerStyles: {
    paddingBlock: convertRemToPixels(1),
    fontSize: convertRemToPixels(1.25)
  },
  titleStyles: {
    fontSize: convertRemToPixels(2),
    fontWeight: "600",
    paddingBottom: convertRemToPixels(.5)
  },
  inputStyles: {
    color: "hsl(0, 0%, 35%)",
  },
  inputWrapper: {
    backgroundColor: "white",
    paddingBlock: convertRemToPixels(.5),
    paddingInline: convertRemToPixels(.75),
    borderRadius: convertRemToPixels(.75)
  },
  submitBtn: {
    marginBlock: convertRemToPixels(1),
    backgroundColor: "hsl(226, 75%, 59%)",
    padding: convertRemToPixels(1),
    borderRadius: convertRemToPixels(.75),
    alignItems: "center"
  },
  submitText: {
    color: "white",
    fontSize: convertRemToPixels(1.5),
    fontWeight: "600"
  }
})
