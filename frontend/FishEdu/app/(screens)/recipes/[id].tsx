import Container from "@/app/components/ui/Container";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type localSearchParams = {
  id: string,
  name: string,
  content: string,
}

export default function RecipeScreen() {
  const { language } = useLanguage()
  const { name, content } = useLocalSearchParams<localSearchParams>()
  
  const prepareContent = (content: string) => {
    return content.replaceAll('-', '--')
  } 

  return (
    <ScrollView style={styles.screen}>
      <Container>
        <> 
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="hsl(0, 0%, 100%)" />
            <Text style={styles.backButtonText}>
              { getTranslation('common.back', language)}
            </Text>
          </Pressable>
          <View>
            <Text style={styles.name}>
              { name }
            </Text>
            <View>
              { prepareContent(content)
                .split('\n-').map((string, index) => (
                  <Text key={index} style={styles.content}>
                    { string }
                  </Text>
              )) }
            </View>
          </View>
        </>
      </Container>
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
  },
  name: {
    fontSize: 32,
    fontWeight: 600,
    marginBlock: 16
  },
  content: {
    fontSize: 16
  }
})