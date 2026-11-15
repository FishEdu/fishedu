
import Ionicons from "@expo/vector-icons/Ionicons"
import { Tabs } from "expo-router"

import { useLanguage } from "../hooks/useLanguage/useLanguage"
import { useTheme } from "../hooks/useTheme/useTheme"
import { getTranslation } from "../utils/translation/getTranslation"

export default function TabsLayout() {
  const { languageCode } = useLanguage()
  const { colors } = useTheme()

  return (
    <Tabs
      screenOptions={{
        sceneStyle: {
          backgroundColor: colors.background.app,
        },
        headerStyle: {
          backgroundColor: colors.background.card,
        },
        headerTintColor: colors.text.main,
        tabBarStyle: {
          backgroundColor: colors.background.card,
          borderTopColor: colors.border.card,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.muted,
      }}
    >
      {/* WYSZUKIWANIE RYB */}
      <Tabs.Screen
        name="fish/search"
        options={{
          title: getTranslation("tabs.fishSearch", languageCode),
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="fish" size={size} color={color} />
          ),
        }}
      />

      {/* DZIENNIK POŁOWÓW */}
      <Tabs.Screen
        name="journal"
        options={{
          headerShown: false,
          title: getTranslation("tabs.journal", languageCode),
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />

      {/* STRONA GŁÓWNA */}
      <Tabs.Screen
        name="index"
        options={{
          title: getTranslation("tabs.home", languageCode),
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* EDUKACJA */}
      <Tabs.Screen
        name="education"
        options={{
          title: getTranslation("tabs.education", languageCode),
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="library" size={size} color={color} />
          ),
        }}
      />

      {/* USTAWIENIA */}
      <Tabs.Screen
        name="settings"
        options={{
          title: getTranslation("tabs.settings", languageCode),
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />

      {/* UKRYTE EKRANY */}

      <Tabs.Screen
        name="records/index"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="records/add"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="records/edit/[id]"
        options={{ href: null }}
      />

      {/* ULUBIONE */}
      <Tabs.Screen
        name="favorite/favorites"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  )
}
