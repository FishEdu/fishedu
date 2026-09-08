import { FishGetResponse } from "@/app/api/fish"
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage"
import { getTranslation } from "@/app/utils/translation/getTranslation"
import { router } from "expo-router"
import { Image, Pressable, StyleSheet, View } from "react-native"
import FishInfoGroup from "./FishInfoGroup"

type LocalProps = {
  fish: FishGetResponse
  imageUrl?: string
  name: string
  isEndangered: boolean
  feedingPlaces: string
}

export default function FishListElement({
  fish,
  name,
  isEndangered,
  imageUrl,
}: LocalProps) {
  const { languageCode } = useLanguage()

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
      {/* ZDJĘCIE */}
      <Image
        source={
          imageUrl
            ? { uri: imageUrl }
            : require("../../../assets/images/fish.jpg")
        }
        style={styles.image}
      />

      {/* INFORMACJE */}
      <View style={styles.textContainer}>
        <FishInfoGroup
          title={getTranslation("fishSearch.name", languageCode)}
          text={name}
          containerStyles={styles.info}
        />

        <FishInfoGroup
          title={getTranslation("fishSearch.endangered", languageCode)}
          text={
            isEndangered
              ? getTranslation("common.yes", languageCode)
              : getTranslation("common.no", languageCode)
          }
          containerStyles={styles.info}
        />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 90,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderRadius: 20,
    overflow: "hidden",

    padding: 8,
    gap: 14,

    // delikatny efekt karty
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },

  containerPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },

  image: {
    width: 100,
    height: 74,

    borderRadius: 14,

    resizeMode: "cover",
  },

  textContainer: {
    flex: 1,

    flexDirection: "row",
    alignItems: "center",

    gap: 10,
  },

  info: {
    flex: 1,
  },
})