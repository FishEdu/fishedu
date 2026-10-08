import Container from "@/app/components/ui/Container";
import HomeActions from "@/app/components/Home/HomeActions";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const { language } = useLanguage();
  return (
    <Container>
      <View>
        <View>
          <Text style={styles.heading}>{getTranslation("home.welcome", language)}</Text>
        </View>
        <HomeActions />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontWeight: 600,
    fontSize: 40,
    marginBottom: 24
  },
});
