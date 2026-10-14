import { StyleSheet } from "react-native";
import { AppColors } from "@/app/constants/theme";

export const createRegisterFormStyles = (colors: AppColors) => StyleSheet.create({
  inputContainerStyles: {
    paddingBlock: 16,
    fontSize: 20
  },
  titleStyles: {
    color: colors.text.main,
    fontSize: 32,
    fontWeight: "600",
    paddingBottom: 8
  },
  inputStyles: {
    color: colors.text.main,
  },
  inputWrapper: {
    backgroundColor: colors.background.card,
    paddingBlock: 8,
    paddingInline: 12,
    borderRadius: 12
  },
  submitBtn: {
    marginBlock: 16,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center"
  },
  submitText: {
    color: colors.text.onPrimary,
    fontSize: 24,
    fontWeight: "600"
  }
})
