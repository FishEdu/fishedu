
import {
  Host,
  DropdownMenu,
  DropdownMenuItem,
  Button,
  Text,
} from '@expo/ui/jetpack-compose';

import { useState } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  LanguageCode,
  LanguageLabels,
} from '@/app/constants/language';

import { useLanguage } from '@/app/hooks/useLanguage/useLanguage';
import { getTranslation } from '@/app/utils/translation/getTranslation';
import { useTheme } from '@/app/hooks/useTheme/useTheme';

type LocalProps = {
  styles?: StyleSheet.NamedStyles<any>;
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
  const { colors, mode } = useTheme();

  return (
    <Host matchContents colorScheme={mode}>
      <DropdownMenu
        expanded={isExpanded}
        onDismissRequest={() => setIsExpanded(false)}
      >
        <DropdownMenu.Trigger>
          <Button
            onClick={() => setIsExpanded(true)}
            colors={{
              containerColor: colors.primary,
              contentColor: colors.text.onPrimary,
            }}
          >
            <Text>
              {getTranslation('common.changeLanguage', languageCode)}
            </Text>
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Items>
          {Object.entries(menuItems ?? LanguageLabels).map(
            ([code, language]) => (
              <DropdownMenuItem
                key={code}
                onClick={async () => {
                  setIsExpanded(false);
                  await AsyncStorage.setItem('language', code);
                  setLanguage(code as LanguageCode);
                }}
              >
                <DropdownMenuItem.Text>
                  <Text>{language}</Text>
                </DropdownMenuItem.Text>
              </DropdownMenuItem>
            )
          )}
        </DropdownMenu.Items>
      </DropdownMenu>
    </Host>
  );
}
