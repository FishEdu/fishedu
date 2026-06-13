import { StyleSheet, View, Image, Pressable } from "react-native"
import FishInfoGroup from "./FishInfoGroup"
import { getTranslation } from "@/app/utils/translation/getTranslation"
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage"
import { FishGetResponse } from "@/app/utils/fetch/fish/fetchFish"
import { router } from "expo-router"

type localProps = {
  fish: FishGetResponse,
  imageUrl?: string,
  name: string,
  isEndangered: boolean,
  feedingPlaces: string,
}

export default function FishListElement({
  fish,
  name, 
  isEndangered,
  feedingPlaces,
  imageUrl }: localProps
  ) {
    const { languageCode } = useLanguage()

    const handlePress = () => {
      const fishDetailsHref = {
        pathname: "/(tabs)/fish/[id]",
        params: {
          id: String(fish.id),
          fish: JSON.stringify(fish),
        }
      } as unknown as Parameters<typeof router.push>[0]

      router.push(fishDetailsHref)
    }
    
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.container,
          pressed && styles.containerPressed
        ]}
      >
        <View>
         <Image 
          source={require('../../../assets/images/fish.jpg')}
          alt='Fish image'
          style={{
            width: 100,
            height: 75,
          }}
        />
        </View>
        <View style={styles.textContainer}>
          <FishInfoGroup
            title={getTranslation('fishSearch.name', languageCode)}
            text={name}
            containerStyles={styles.info}
          />
          <FishInfoGroup
            title={getTranslation('fishSearch.environment', languageCode)}
            text={feedingPlaces}
            containerStyles={styles.info}
          />
          <FishInfoGroup
            title={getTranslation('fishSearch.endangered', languageCode)}
            text={ isEndangered 
              ? getTranslation('common.yes', languageCode)
              : getTranslation('common.no', languageCode)
            }
            containerStyles={styles.info}
          />
        </View>
      </Pressable>
    )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingEnd: 16,
    borderRadius: 24,
    overflow: 'hidden'
  },
  containerPressed: {
    opacity: 0.75,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  info: {
    width: '33.33%'
  }
})
