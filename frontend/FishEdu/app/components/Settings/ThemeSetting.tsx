
import {
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";

export default function ThemeSetting() {
  const { colors, mode, setMode } = useTheme();
  const { languageCode } = useLanguage();

  return (
    <View style={styles.row}>
      <Ionicons
        name="color-palette-outline"
        size={34}
        color={colors.primary}
      />

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            { color: colors.text.main },
          ]}
        >
          {getTranslation("settings.darkMode", languageCode)}
        </Text>
      </View>

      <View style={styles.switchWrapper}>
        <Switch
          style={styles.switch}
          value={mode === "dark"}
          onValueChange={(enabled) =>
            void setMode(enabled ? "dark" : "light")
          }
          trackColor={{
            false: colors.border.subtle,
            true: colors.primary,
          }}
          thumbColor={colors.text.onPrimary}
          ios_backgroundColor={colors.border.subtle}
          accessibilityLabel={getTranslation(
            "settings.darkMode",
            languageCode
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 14,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  switchWrapper: {
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  switch: {
    alignSelf: "center",
    margin: 0,
  },
});
