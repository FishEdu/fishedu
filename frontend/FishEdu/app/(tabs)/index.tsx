import Container from "@/app/components/ui/Container";
import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../hooks/useLanguage/useLanguage";
import { getTranslation } from "../utils/translation/getTranslation";
import { ReactNode } from "react";

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
          <ButtonRow>
            <Pressable style={[styles.button]}>
              <Ionicons
                name='library'
                size={40}
                color={colors.primary}
              />
              <Text style={[ styles.buttonText, styles.mainButtonText ]}>
                { getTranslation('home.button.begginerGuide', language) }
              </Text>
            </Pressable>
          </ButtonRow>

          <ButtonRow>
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

            <Pressable style={styles.button}>
              <Ionicons
                name='book'
                size={24}
                color={colors.primary}
              />
              <Text style={styles.buttonText}>
                { getTranslation('home.button.fishingMethods', language)}
              </Text>
            </Pressable>
          </ButtonRow>

          <ButtonRow>
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
            <Pressable style={styles.button}>
              <Ionicons
                name='time'
                size={24}
                color={colors.primary}
              />
              <Text style={styles.buttonText}>
                { getTranslation('home.button.fishProtection', language)}
              </Text>
            </Pressable>
          </ButtonRow>

          <ButtonRow>
            <Pressable
              style={[styles.button, styles.widthHalf]}
              onPress={() => router.push("/(tabs)/favorite/favorites")}
            >
              <Ionicons
                name="star"
                size={24}
                color={colors.favorite}
              />
              <Text style={styles.buttonText}>
                {getTranslation('home.button.saved', language)}
              </Text>
            </Pressable>
          </ButtonRow>
        </View>
      </View>
    </Container>
  )
}

function ButtonRow(
  { 
    children 
  }: { children: ReactNode }
) {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  
  return (
    <View style={styles.row}>
      {children}
    </View>
  )
}

const buttonPaddingBlock = 16

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
    flexDirection: 'row',
    flexGrow: 1,
    flexWrap: 'wrap',
    rowGap: 16
  },
  mainButton: {
    width: '100%'
  },
  button: {
    backgroundColor: colors.background.card,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBlock: buttonPaddingBlock,
    paddingInline: 4,
    borderColor: colors.border.card,
    borderRadius: 8,
    borderWidth: 1,
    
    shadowColor: colors.text.main,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,

    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,

    //We are adding the padding * 2 so the card's height won't remove the padding
    height: 75 + buttonPaddingBlock * 2,
  },

  buttonText: {
    color: colors.text.main,
    fontSize: 20,
    textAlign: 'center'
  },
  mainButtonText: {
    fontSize: 24
  },

  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    columnGap: 8,
  },

  widthHalf: {
    maxWidth: '50%'
  }
})