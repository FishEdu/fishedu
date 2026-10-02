import Container from "@/app/components/ui/Container";
import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
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
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const { name, content } = useLocalSearchParams<localSearchParams>()
  
  const prepareContent = (content: string) => {
    return content.replaceAll('-', '--')
  } 

  return (
    <ScrollView style={styles.screen}>
      <Container>
        <> 
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color={colors.primary} />
            <Text style={styles.backButtonText}>
              {getTranslation('common.back', language)}
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

const createStyles = (colors: AppColors) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.app,
  },
  backButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 2,
    paddingBlock: 8,
    paddingEnd: 8,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  name: {
    color: colors.text.main,
    fontSize: 32,
    fontWeight: 600,
    marginBlock: 16
  },
  content: {
    color: colors.text.main,
    fontSize: 16
  }
})
