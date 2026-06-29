import Container from "@components/Container";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../hooks/useLanguage/useLanguage";
import { getTranslation } from "../utils/translation/getTranslation";

export default function Index() {
  const { language } = useLanguage()
  return (
    <Container>
      <View>
        <View>
          <Text style={styles.heading}>{ getTranslation('home.welcome', language) }</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <View style={[styles.button, styles.mainButton]}>
            <Ionicons
              name='library'
              size={40}
            />
            <Text style={[ styles.buttonText, styles.mainButtonText ]}>
              { getTranslation('home.button.begginerGuide', language) }
            </Text>
          </View>
          
          <Pressable 
            style={styles.button}
            onPress={() => {
              router.push('../(screens)/ecoTips')
            }}
          >
            <Ionicons
              name='leaf'
              size={24} 
            />
            <Text style={styles.buttonText}>
              { getTranslation('home.button.ecoTips', language)}
            </Text>
          </Pressable>
          {/* <View style={styles.button}>
            
          </View> */}

          <View style={styles.button}>
            <Ionicons
              name='book'
              size={24}
            />
            <Text style={styles.buttonText}>
              { getTranslation('home.button.fishingMethods', language)}
            </Text>
          </View>

          <View style={styles.button}>
             <Ionicons
              name='receipt'
              size={24}
            />
            <Text style={styles.buttonText}>
              { getTranslation('home.button.recipes', language)}
            </Text>
          </View>

          <View style={styles.button}>
             <Ionicons
              name='time'
              size={24} 
            />
            <Text style={styles.buttonText}>
              { getTranslation('home.button.fishProtection', language)}
            </Text>
          </View>

          <View style={styles.button}>
            <Ionicons
              name='star'
              size={24} 
            />
            <Text style={styles.buttonText}>
              { getTranslation('home.button.saved', language)}
            </Text>
          </View>
        </View>
      </View>
    </Container>
   
  )
}

const styles = StyleSheet.create({
  heading: {
    fontWeight: 600,
    fontSize: 40,
    marginBottom: 24
  },
  buttonsContainer: {
    // flex: 1,
    flexDirection: 'row',
    flexGrow: 1,
    flexWrap: 'wrap',
    gap: 12
  },
  mainButton: {
    width: '100%'
  },
  button: {
    width: '48%',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBlock: 16
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center'
  },
  mainButtonText: {
    fontSize: 28
  }
})