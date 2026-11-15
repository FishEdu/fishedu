
import { RecipesGetResponse } from "@/app/api/recipes"
import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { router } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Pressable, StyleSheet, Text, View } from "react-native"

function getRecommendedFish(content: string) {
  const match = content.match(
    /(?:Polecana na|Polecane na|Polecany na|Recommended for)\s*:\s*([\s\S]*?)(?=\n\s*\n|\n\s*(?:Składniki|Przygotowanie|Sposób użycia|Ingredients|Preparation|How to use)\s*:|$)/i
  )

  if (!match) return ""

  return match[1]
    .split("\n")
    .map(item => item.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 3)
    .join(" · ")
}

export default function RecipesListElement({
  id,
  content,
  name,
}: RecipesGetResponse) {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  const recommendedFish = getRecommendedFish(content ?? "")

  const handlePress = () => {
    const recipeDetailsHref = {
      pathname: "/(screens)/recipes/[id]",
      params: {
        id: String(id),
        name,
        content,
      },
    } as unknown as Parameters<typeof router.push>[0]

    router.push(recipeDetailsHref)
  }

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name="fish-outline"
          size={27}
          color={colors.primary}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.name}>
          {name}
        </Text>

        {recommendedFish ? (
          <Text style={styles.description} numberOfLines={2}>
            {recommendedFish}
          </Text>
        ) : null}
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.primary

        }
      />
    </Pressable>
  )
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background.card,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      paddingVertical: 17,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border.subtle,
    },
    containerPressed: {
      opacity: 0.75,
      transform: [{ scale: 0.99 }],
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: colors.background.primarySoft,
      alignItems: "center",
      justifyContent: "center",
    },
    textContainer: {
      flex: 1,
      minWidth: 0,
      gap: 5,
    },
    name: {
      color: colors.text.main,
      fontSize: 16,
      fontWeight: "600",
      lineHeight: 22,
    },
    description: {
      color: colors.text.muted,
      fontSize: 13,
      lineHeight: 18,
    },

    chevronContainer: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.background.primarySoft,
      alignItems: "center",
      justifyContent: "center",
    },
  })
