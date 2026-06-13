import { Host, DropdownMenu, DropdownMenuItem, Button, Text } from '@expo/ui/jetpack-compose';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LanguageCode, LanguageLabels } from '@/app/(tabs)/settings';
import { useLanguage } from '@/app/hooks/useLanguage/useLanguage';
import { getTranslation } from '@/app/utils/translation/getTranslation';


type localProps = {
  styles?: StyleSheet,
  buttonText?: string,
  menuItems?: Record<LanguageCode, string>,
}

export default function BaseDropdownMenu({
  styles,
  buttonText,
  menuItems,
}: localProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { setLanguage, languageCode } = useLanguage()
  
  return (
    <Host matchContents>
      <DropdownMenu expanded={isExpanded} onDismissRequest={() => setIsExpanded(false)}>
        <DropdownMenu.Trigger>
          <Button 
            onClick={
              () => setIsExpanded(true)
            }
            colors={{
              containerColor: 'hsl(226, 75%, 59%)',
              contentColor: 'white'
            }}
          >
            <Text>
              { getTranslation('common.changeLanguage', languageCode) }
            </Text>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          { 
            Object.entries(LanguageLabels)
              ?.map(([code, language]) => (
                <DropdownMenuItem
                  key={language}
                  onClick={async () => {
                    setIsExpanded(false)
                    await AsyncStorage.setItem('language', code)
                    setLanguage(code as LanguageCode)
                  }}
                >
                <DropdownMenuItem.Text>
                  <Text>
                    { language }
                  </Text>
                </DropdownMenuItem.Text>
              </DropdownMenuItem>
          ))}
        </DropdownMenu.Items>
      </DropdownMenu>
    </Host>
  )
}
