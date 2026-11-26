import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import BaseDropdownMenu from "./Dropdown";

import { LanguageLabels } from "@/app/constants/language";

import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { useTheme } from "@/app/hooks/useTheme/useTheme";

import { getTranslation } from "@/app/utils/translation/getTranslation";


export default function LanguageSetting() {
  const { colors } = useTheme();
  const { languageCode } = useLanguage();

  return (
    <View style={styles.row}>
      <Ionicons
        name="globe-outline"
        size={34}
        color={colors.primary}
      />

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text.main,
            },
          ]}
          numberOfLines={1}
        >
          {getTranslation(
            "settings.language",
            languageCode
          )}
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.text.muted,
            },
          ]}
          numberOfLines={1}
        >
          {LanguageLabels[languageCode]}
        </Text>
      </View>

      <BaseDropdownMenu
        buttonText={
          languageCode === "pl"
            ? "Zmień"
            : "Change"
        }
        menuItems={LanguageLabels}
        styles={styles.dropdown}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  row: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },

  textContainer: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  subtitle: {
    fontSize: 14,
  },

  dropdown: {
    width: 92,
    flexShrink: 0,
  },
});