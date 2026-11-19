
import { useState } from 'react'
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { addNetworkStateListener } from 'expo-network'
import { useLanguage } from '@/app/hooks/useLanguage/useLanguage'
import { getTranslation } from '@/app/utils/translation/getTranslation'

export function OfflineBanner() {
  // To test the banner switch initial state to false and setDissmissed to false
  const [ dismissed, setDismissed ] = useState<boolean>(true)
  const { language } = useLanguage()

  addNetworkStateListener(({ isConnected }) => {
    setDismissed(isConnected ?? true)
  })
  
  const handleDismiss = () => {
    setDismissed(true)
  } 

  if(dismissed) {
    return null
  }


  return (
    <View style={styles.container}>
      <Pressable
        style={styles.banner}
        onPress={handleDismiss}
        accessibilityRole="button"
        accessibilityLabel="Dismiss offline notification"
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>!</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {
              getTranslation('offlineBanner.noConnection', language)
            }
          </Text>

          <Text style={styles.description}>
            {
              getTranslation('offlineBanner.description', language)
            }
          </Text>
        </View>

        <Text style={styles.close}>✕</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 999,
    position: 'absolute',
    bottom: '10%'
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    borderColor: '#FFCC66',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5A000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 17,
  },
  textContainer: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#664D03',
  },
  description: {
    fontSize: 12,
    lineHeight: 17,
    color: '#664D03',
  },
  close: {
    fontSize: 16,
    color: '#664D03',
    padding: 4,
  },
})
