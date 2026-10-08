import { StyleSheet, Text, View } from "react-native";

type Props = { name: string; content: string };

export default function RecipeContent({ name, content }: Props) {
  const paragraphs = content.replaceAll("-", "--").split("\n-");
  return (
    <View>
      <Text style={styles.name}>{name}</Text>
      <View>
        {paragraphs.map((paragraph, index) => <Text key={index} style={styles.content}>{paragraph}</Text>)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 32,
    fontWeight: 600,
    marginBlock: 16
  },
  content: {
    fontSize: 16
  }
});
