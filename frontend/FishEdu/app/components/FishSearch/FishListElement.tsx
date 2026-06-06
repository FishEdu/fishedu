import { StyleSheet, View, Image } from "react-native"
import FishInfoGroup from "./FishInfoGroup"
import { getTranslation } from "@/app/utils/translation/getTranslation"
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage"

type localProps = {
  imageUrl?: string,
  name: string,
  isEndangered: boolean,
}

export default function FishListElement({
  name, 
  isEndangered,
  imageUrl }: localProps
  ) {
    const { languageCode } = useLanguage()
    
    return (
      <View style={styles.container}>
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
            title={getTranslation('fishSearch.endangered', languageCode)}
            text={ isEndangered 
              ? getTranslation('common.yes', languageCode)
              : getTranslation('common.no', languageCode)
            }
            containerStyles={styles.info}
          />
        </View>
      </View>
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
  textContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  info: {
    width: '50%'
  }
})
