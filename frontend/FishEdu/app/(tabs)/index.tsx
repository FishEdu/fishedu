import Container from "@/app/components/ui/Container";
import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../hooks/useLanguage/useLanguage";
import { getTranslation } from "../utils/translation/getTranslation";

export default function Index() {
  const { language } = useLanguage()
  const { colors } = useTheme()
  const styles = createStyles(colors)
  
  return (
    <Container>
      <View style={styles.page}>
        <View>
          <Text style={styles.heading}>{ getTranslation('home.welcome', language) }</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <View style={[styles.button, styles.mainButton]}>
            <Ionicons
              name='library'
              size={40}
              color={colors.primary}
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
              color={colors.secondary}
            />
            <Text style={styles.buttonText}>
              { getTranslation('home.button.ecoTips', language)}
            </Text>
          </Pressable>

          <View style={styles.button}>
            <Ionicons
              name='book'
              size={24}
              color={colors.primary}
            />
            <Text style={styles.buttonText}>
              { getTranslation('home.button.fishingMethods', language)}
            </Text>
          </View>

          <Pressable
            style={styles.button}
            onPress={() => {
              router.push('/(screens)/recipes/search')
            }}
          >
            <Ionicons
              name='receipt'
              size={24}
              color={colors.primary}
            />
            <Text style={styles.buttonText}>
              { getTranslation('home.button.recipes', language)}
            </Text>
          </Pressable>

          <View style={styles.button}>
             <Ionicons
              name='time'
              size={24}
              color={colors.primary}
            />
            <Text style={styles.buttonText}>
              { getTranslation('home.button.fishProtection', language)}
            </Text>
          </View>

          <View style={styles.button}>
            <Ionicons
              name='star'
              size={24}
              color={colors.favorite}
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

const createStyles = (colors: AppColors) => StyleSheet.create({
    heading: {
      color: colors.text.main,
      fontWeight: 600,
      fontSize: 40,
      marginBottom: 32
    },
    page: {
      flex: 1,
      paddingTop: 70
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
    backgroundColor: colors.background.card,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBlock: 16
  },
  buttonText: {
    color: colors.text.main,
    fontSize: 20,
    textAlign: 'center'
  },
  mainButtonText: {
    fontSize: 28
  }
})
