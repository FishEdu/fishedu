import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function RecipeScreen() {
  const { language } = useLanguage()

  return (
    <ScrollView style={styles.screen}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="hsl(0, 0%, 100%)" />
        <Text style={styles.backButtonText}>
          {getTranslation('fishDetails.back', language)}
        </Text>
      </Pressable>
      <View>
        Recipe name
      </View>
      <View>
        Recipe content
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "hsl(180, 5%, 96%)",
  },
  backButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "hsl(226, 75%, 59%)",
    borderRadius: 24,
    flexDirection: "row",
    gap: 4,
    paddingBlock: 10,
    paddingInline: 20,
  },
  backButtonText: {
    color: "hsl(0, 0%, 100%)",
    fontSize: 18,
    fontWeight: 500,
  }
})