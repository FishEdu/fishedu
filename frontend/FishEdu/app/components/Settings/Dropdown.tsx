import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

import type {
  AlertButton,
  StyleProp,
  ViewStyle,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { LanguageLabels } from "@/app/constants/language";

import type { LanguageCode } from "@/app/constants/language";

import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { useTheme } from "@/app/hooks/useTheme/useTheme";

import { getTranslation } from "@/app/utils/translation/getTranslation";


type LocalProps = {
  styles?: StyleProp<ViewStyle>;
  buttonText: string;
  menuItems?: Record<LanguageCode, string>;
};


export default function BaseDropdownMenu({
  styles: buttonStyles,
  buttonText,
  menuItems,
}: LocalProps) {
  const { setLanguage, languageCode } = useLanguage();
  const { colors } = useTheme();

  const options = menuItems ?? LanguageLabels;


  const handleLanguageChange = async (
    code: LanguageCode
  ) => {
    try {
      await AsyncStorage.setItem("language", code);

      setLanguage(code);
    } catch (error) {
      console.error(
        "Failed to save language:",
        error
      );
    }
  };


  const openLanguagePicker = () => {
    const buttons: AlertButton[] = Object.entries(
      options
    ).map(([code, language]) => ({
      text: language,
      onPress: () => {
        void handleLanguageChange(
          code as LanguageCode
        );
      },
    }));

    buttons.push({
      text: getTranslation(
        "settings.backup.cancel",
        languageCode
      ),
      style: "cancel",
    });

    Alert.alert(
      getTranslation(
        "settings.chooseLanguage",
        languageCode
      ),
      undefined,
      buttons
    );
  };


  return (
    <Pressable
      onPress={openLanguagePicker}
      style={[
        localStyles.trigger,
        {
          backgroundColor: colors.primary,
        },
        buttonStyles,
      ]}
      accessibilityRole="button"
      accessibilityLabel={getTranslation(
        "settings.chooseLanguage",
        languageCode
      )}
    >
      <Text
        style={[
          localStyles.triggerText,
          {
            color: colors.text.onPrimary,
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
      >
        {buttonText}
      </Text>
    </Pressable>
  );
}


const localStyles = StyleSheet.create({
  trigger: {
    width: 92,
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  triggerText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});