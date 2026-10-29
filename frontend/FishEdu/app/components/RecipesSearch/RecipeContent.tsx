
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";

type Props = {
  name: string;
  content: string;
};

type Section = {
  title: string;
  lines: string[];
};

const HEADINGS = [
  "polecana na:",
  "składniki:",
  "przygotowanie:",
  "sposób użycia:",
  "recommended for:",
  "ingredients:",
  "preparation:",
  "how to use:",
];

function parseSections(content: string): Section[] {
  const sections: Section[] = [];
  let current: Section | null = null;

  content.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      return;
    }

    const heading = HEADINGS.find(
      (item) => item === line.toLocaleLowerCase()
    );

    if (heading) {
      current = {
        title: line.replace(/:$/, ""),
        lines: [],
      };

      sections.push(current);
      return;
    }

    if (!current) {
      current = {
        title: "Opis",
        lines: [],
      };

      sections.push(current);
    }

    current.lines.push(line.replace(/^-+\s*/, ""));
  });

  return sections;
}

export default function RecipeContent({ name, content }: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const sections = parseSections(content ?? "");

  const [checkedIngredients, setCheckedIngredients] = useState<
    Record<string, boolean>
  >({});

  // Reset checkboxów po otwarciu innego przepisu.
  useEffect(() => {
    setCheckedIngredients({});
  }, [name, content]);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>

      {sections.map((section, sectionIndex) => {
        const normalizedTitle = section.title.toLocaleLowerCase();

        const isIngredients = [
          "składniki",
          "ingredients",
        ].includes(normalizedTitle);

        const isPreparation = [
          "przygotowanie",
          "preparation",
        ].includes(normalizedTitle);

        return (
          <View
            key={`${section.title}-${sectionIndex}`}
            style={styles.card}
          >
            <Text style={styles.heading}>{section.title}</Text>

            {section.lines.map((line, lineIndex) => {
              const itemKey = `${sectionIndex}-${lineIndex}`;

              // SKŁADNIKI — checkboxy
              if (isIngredients) {
                const isChecked = !!checkedIngredients[itemKey];

                return (
                  <Pressable
                    key={itemKey}
                    style={styles.lineRow}
                    onPress={() => {
                      setCheckedIngredients((previous) => ({
                        ...previous,
                        [itemKey]: !previous[itemKey],
                      }));
                    }}
                    accessibilityRole="checkbox"
                    accessibilityLabel={line}
                    accessibilityState={{ checked: isChecked }}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        isChecked && styles.checkboxChecked,
                      ]}
                    >
                      {isChecked && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>

                    <Text
                      style={[
                        styles.content,
                        isChecked && styles.checkedContent,
                      ]}
                    >
                      {line}
                    </Text>
                  </Pressable>
                );
              }

              // PRZYGOTOWANIE — numerowane kroki
              if (isPreparation) {
                return (
                  <View key={itemKey} style={styles.lineRow}>
                    <View style={styles.numberBadge}>
                      <Text style={styles.numberText}>
                        {lineIndex + 1}
                      </Text>
                    </View>

                    <Text style={styles.content}>{line}</Text>
                  </View>
                );
              }

              // POZOSTAŁE SEKCJE — punkty
              return (
                <View key={itemKey} style={styles.lineRow}>
                  <View style={styles.bullet} />

                  <Text style={styles.content}>{line}</Text>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      paddingBottom: 24,
    },

    name: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text.main,
      marginVertical: 16,
    },

    card: {
      backgroundColor: colors.background.card,
      borderColor: colors.border.card,
      borderWidth: 1,
      borderRadius: 16,
      padding: 16,
      marginBottom: 14,
    },

    heading: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.primary,
      marginBottom: 14,
      textTransform: "capitalize",
    },

    lineRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 12,
    },

    // Checkbox składnika
    checkbox: {
      width: 22,
      height: 22,
      borderWidth: 1.5,
      borderColor: colors.border.subtle,
      borderRadius: 5,
      marginRight: 11,
      alignItems: "center",
      justifyContent: "center",
    },

    checkboxChecked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    checkmark: {
      color: colors.text.onPrimary,
      fontSize: 14,
      fontWeight: "700",
      lineHeight: 17,
    },

    checkedContent: {
      color: colors.text.muted,
      textDecorationLine: "line-through",
    },

    // Numer kroku przygotowania
    numberBadge: {
      width: 27,
      height: 27,
      borderRadius: 14,
      backgroundColor: colors.background.primarySoft,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 11,
    },

    numberText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "700",
    },

    // Punkt w pozostałych sekcjach
    bullet: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: colors.primary,
      marginTop: 8,
      marginRight: 11,
    },

    content: {
      flex: 1,
      fontSize: 16,
      lineHeight: 23,
      color: colors.text.main,
    },
  });
