import { FishGetResponse } from "@/app/api/fish"
import { AppColors } from "@/app/constants/theme"
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { getTranslation } from "@/app/utils/translation/getTranslation"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"

type LocalProps = {
  fish: FishGetResponse
  imageUrl?: string
  name: string
  isEndangered: boolean
}

export default function FishListElement({
  fish,
  name,
  isEndangered,
  imageUrl,
}: LocalProps) {
  const { languageCode } = useLanguage()
  const { colors } = useTheme()
  const styles = createStyles(colors)

  const handlePress = () => {
    const fishDetailsHref = {
      pathname: "/(tabs)/fish/[id]",
      params: {
        id: String(fish.id),
        fish: JSON.stringify(fish),
      },
    } as unknown as Parameters<typeof router.push>[0]

    router.push(fishDetailsHref)
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
    >
      <Image
        source={
          imageUrl
            ? { uri: imageUrl }
            : require("../../../assets/images/fish.jpg")
        }
        style={styles.image}
      />

      <View style={styles.textContainer}>
        <View style={styles.nameContainer}>
          <Text numberOfLines={1} style={styles.name}>{name}</Text>
        </View>
        {isEndangered && (
          <View style={styles.status}>
              <Ionicons
                name="alert-circle-outline"
                size={15}
                color={colors.danger}
              />
              <Text style={styles.statusText}>
                {getTranslation("fishSearch.endangered", languageCode)}
              </Text>
          </View>
        )}
      </View>
    </Pressable>
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 96,
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: colors.background.card,
    borderColor: colors.border.card,
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",

    padding: 7,
    gap: 14,

    // delikatny efekt karty
    shadowColor: colors.text.main,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  containerPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },

  image: {
    width: 110,
    height: 82,

    borderRadius: 6,

    resizeMode: "cover",
  },

  textContainer: {
    flex: 1,
    alignSelf: "stretch",
    minHeight: 82,
    paddingRight: 4,
  },
  nameContainer: { flex: 1, justifyContent: "center" },
  name: { color: colors.text.main, fontSize: 21, fontWeight: "700", lineHeight: 26 },
  status: { position: "absolute", right: 4, bottom: 2, alignItems: "center", flexDirection: "row", gap: 4 },
  statusText: { color: colors.text.muted, fontSize: 12, fontWeight: "500" },
})
