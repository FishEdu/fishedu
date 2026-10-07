import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs } from "expo-router"
import { useLanguage } from "../hooks/useLanguage/useLanguage"
import { getTranslation } from "../utils/translation/getTranslation"
import { useTheme } from "../hooks/useTheme/useTheme"

export default function TabsLayout() {
  const { languageCode } = useLanguage()
  const { colors } = useTheme()
  
  return (
    <Tabs
      screenOptions={{
        sceneStyle: { backgroundColor: colors.background.app },
        headerStyle: { backgroundColor: colors.background.card },
        headerTintColor: colors.text.main,
        tabBarStyle: { backgroundColor: colors.background.card, borderTopColor: colors.border.card },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.muted,
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
        name="records/index"
        options={{
          headerShown: false,
          title: getTranslation('tabs.records', languageCode),
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="education"
        options={{
          title: getTranslation('tabs.education', languageCode),
          tabBarIcon: ({ size, color }) =>
            <Ionicons name="library" size={size} color={color}></Ionicons>
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

      <Tabs.Screen
        name="records/add"
        options={{
          href: null,
          title: "Nowy post",
        }}
      />
    </Tabs>
  )  
}
