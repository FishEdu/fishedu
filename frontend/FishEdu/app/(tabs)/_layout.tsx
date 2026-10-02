import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs } from "expo-router"
import { useTheme } from "../hooks/useTheme/useTheme"
import { useLanguage } from "../hooks/useLanguage/useLanguage"
import { getTranslation } from "../utils/translation/getTranslation"

export default function TabsLayout() {
  const { languageCode } = useLanguage()
  const { colors } = useTheme()
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background.app },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarStyle: { backgroundColor: colors.background.card, borderTopColor: colors.border.card },
      }}
    >
      <Tabs.Screen
        name="fish/search"
        options={{
          title: getTranslation('tabs.fishSearch', languageCode),
          tabBarIcon: ({ size, color }) => 
            <Ionicons name="fish" size={size} color={color}></Ionicons>
        }}
      />

      <Tabs.Screen
        name="fish/[id]"
        options={{
          href: null,
        }}
      />
      
      <Tabs.Screen
        name="index"
        options={{
          title: getTranslation('tabs.home', languageCode),
          tabBarIcon: ({ size, color }) => 
            <Ionicons name="home" size={size} color={color}></Ionicons>
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: getTranslation('tabs.settings', languageCode),
          tabBarIcon: ({ size, color }) => 
            <Ionicons name="settings" size={size} color={color}></Ionicons>
        }}
      />
    </Tabs>
  )  
}
