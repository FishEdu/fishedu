import { useState } from "react";

import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  StyleProp,
  ViewStyle,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { LanguageLabels } from "@/app/constants/language";

import type { LanguageCode } from "@/app/constants/language";

import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { useTheme } from "@/app/hooks/useTheme/useTheme";

import { getTranslation } from "@/app/utils/translation/getTranslation";


type LocalProps = {
  styles?: StyleProp<ViewStyle>;
  buttonText?: string;
  menuItems?: Record<LanguageCode, string>;
};


export default function BaseDropdownMenu({
  styles: buttonStyles,
  buttonText,
  menuItems,
}: LocalProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { setLanguage, languageCode } = useLanguage();
  const { colors } = useTheme();

  const options = menuItems ?? LanguageLabels;


  const handleLanguageChange = async (
    code: LanguageCode
  ) => {
    try {
      await AsyncStorage.setItem("language", code);

      setLanguage(code);
      setIsExpanded(false);
    } catch (error) {
      console.error(
        "Failed to save language:",
        error
      );
    }
  };


  return (
    <>
      <Pressable
        onPress={() => setIsExpanded(true)}
        style={[
          localStyles.button,
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
            localStyles.buttonText,
            {
              color: colors.text.onPrimary,
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
          {buttonText ??
            (languageCode === "pl" ? "Zmień" : "Change")}
        </Text>
      </Pressable>


      <Modal
        visible={isExpanded}
        transparent
        animationType="fade"
        onRequestClose={() => setIsExpanded(false)}
      >
        <View style={localStyles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setIsExpanded(false)}
          />

          <View
            style={[
              localStyles.menu,
              {
                backgroundColor: colors.background.card,
                borderColor: colors.border.subtle,
              },
            ]}
          >
            <View style={localStyles.header}>
              <Text
                style={[
                  localStyles.title,
                  {
                    color: colors.text.main,
                  },
                ]}
              >
                {getTranslation(
                  "settings.chooseLanguage",
                  languageCode
                )}
              </Text>

              <Pressable
                onPress={() => setIsExpanded(false)}
                style={[
                  localStyles.closeButton,
                  {
                    backgroundColor: colors.background.primarySoft,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={getTranslation(
                  "settings.backup.cancel",
                  languageCode
                )}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={colors.text.main}
                />
              </Pressable>
            </View>


            {Object.entries(options).map(
              ([code, language]) => {
                const selected = code === languageCode;

                return (
                  <Pressable
                    key={code}
                    onPress={() =>
                      void handleLanguageChange(
                        code as LanguageCode
                      )
                    }
                    style={[
                      localStyles.option,
                      {
                        backgroundColor: selected
                          ? colors.background.primarySoft
                          : "transparent",
                        borderColor: selected
                          ? colors.primary
                          : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        localStyles.optionText,
                        {
                          color: colors.text.main,
                          fontWeight: selected ? "600" : "400",
                        },
                      ]}
                    >
                      {language}
                    </Text>

                    {selected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={colors.primary}
                      />
                    )}
                  </Pressable>
                );
              }
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}


const localStyles = StyleSheet.create({
  button: {
    width: 92,
    minHeight: 42,
    borderRadius: 10,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  buttonText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 24,
  },

  menu: {
    width: "100%",
    maxWidth: 320,
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingHorizontal: 4,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  option: {
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },

  optionText: {
    fontSize: 15,
  },
});