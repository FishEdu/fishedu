import { Tabs } from "expo-router"
import Ionicons from '@expo/vector-icons/Ionicons'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        sceneStyle: { backgroundColor: "hsl(180, 5%, 96%)" }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => 
            <Ionicons name="home" size={size} color={color}></Ionicons>
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ size, color }) => 
            <Ionicons name="settings" size={size} color={color}></Ionicons>
        }}
      />

      <Tabs.Screen
        name="fishSearch"
        options={{
          title: "Fish Search",
          tabBarIcon: ({ size, color }) => 
            <Ionicons name="fish" size={size} color={color}></Ionicons>
        }}
      />
    </Tabs>
  )  
}
