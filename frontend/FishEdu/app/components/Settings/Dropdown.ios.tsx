
import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  LanguageCode,
  LanguageLabels,
} from '@/app/constants/language';

import { useLanguage } from '@/app/hooks/useLanguage/useLanguage';
import { getTranslation } from '@/app/utils/translation/getTranslation';
import { useTheme } from '@/app/hooks/useTheme/useTheme';

type LocalProps = {
  styles?: object;
  buttonText?: string;
  menuItems?: Record<LanguageCode, string>;
};

export default function BaseDropdownMenu({
  styles,
  buttonText,
  menuItems,
}: LocalProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { setLanguage, languageCode } = useLanguage();
  const { colors } = useTheme();

  const options = menuItems ?? LanguageLabels;

  const handleLanguageChange = async (code: LanguageCode) => {
    setIsExpanded(false);

    await AsyncStorage.setItem('language', code);
    setLanguage(code);
  };

  return (
    <>
      <Pressable
        onPress={() => setIsExpanded(true)}
        style={[
          localStyles.button,
          { backgroundColor: colors.primary },
          styles,
        ]}
      >
        <Text
          style={[
            localStyles.buttonText,
            { color: colors.text.onPrimary },
          ]}
        >
          {buttonText ??
            getTranslation('common.changeLanguage', languageCode)}
        </Text>

        <Text style={{ color: colors.text.onPrimary }}>
          ▾
        </Text>
      </Pressable>

      <Modal
        visible={isExpanded}
        transparent
        animationType="fade"
        onRequestClose={() => setIsExpanded(false)}
      >
        <Pressable
          style={localStyles.overlay}
          onPress={() => setIsExpanded(false)}
        >
          <View
            style={[
              localStyles.menu,
              {
                borderColor: colors.border.subtle,
              },
            ]}
          >
            {Object.entries(options).map(([code, language]) => {
              const selected = code === languageCode;

              return (
                <Pressable
                  key={code}
                  onPress={() =>
                    handleLanguageChange(code as LanguageCode)
                  }
                  style={[
                    localStyles.option
                  ]}
                >
                  <Text
                    style={{
                      color: colors.text.main,
                      fontWeight: selected ? '600' : '400',
                    }}
                  >
                    {language}
                  </Text>

                  {selected && (
                    <Text style={{ color: colors.primary }}>
                      ✓
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const localStyles = StyleSheet.create({
  button: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 24,
  },
  menu: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    borderWidth: 1,
    padding: 8,
  },
  option: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
