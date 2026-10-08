import Container from "@/app/components/ui/Container";
import BackButton from "@/app/components/ui/BackButton";
import RecipeContent from "@/app/components/RecipesSearch/RecipeContent";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

type LocalSearchParams = { id: string; name: string; content: string };

export default function RecipeScreen() {
  const { language } = useLanguage();
  const { name, content } = useLocalSearchParams<LocalSearchParams>();
  return (
    <ScrollView style={styles.screen}>
      <Container>
        <>
          <BackButton variant="filled" label={getTranslation("common.back", language)} onPress={() => router.back()} />
          <RecipeContent name={name} content={content} />
        </>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "hsl(180, 5%, 96%)",
  },
});
