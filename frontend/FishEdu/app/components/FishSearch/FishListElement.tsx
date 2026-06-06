import { StyleSheet, View, Image } from "react-native"
import FishInfoGroup from "./FishInfoGroup"

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
            title='Name'
            text={name}
            containerStyles={styles.info}
          />
          <FishInfoGroup
            title='Endangered'
            text={ isEndangered ? 'Yes' : 'No' }
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
