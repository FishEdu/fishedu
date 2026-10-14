import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type DetailSectionProps = { title: string; children: string | string[] };

export default function FishDetailSection({ title, children }: DetailSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const content = Array.isArray(children) ? children.filter(Boolean) : [children];

  return (
    <View style={styles.sectionCard}>
      <Pressable
        onPress={() => setIsOpen((current) => !current)}
        style={styles.sectionHeader}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={24}
          color="hsl(0, 0%, 45%)"
        />
      </Pressable>

      {isOpen && (
        <View style={styles.sectionContent}>
          {content.map((paragraph, index) => (
            <Text key={`${title}-${index}`} style={styles.sectionText}>
              {paragraph}
            </Text>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: "hsl(0, 0%, 100%)",
    borderRadius: 16,
    padding: 16,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 700,
  },
  sectionContent: {
    gap: 10,
    marginTop: 10,
  },
  sectionText: {
    color: "hsl(0, 0%, 22%)",
    fontSize: 15,
    lineHeight: 20,
  },
});
