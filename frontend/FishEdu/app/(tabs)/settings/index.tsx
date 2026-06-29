import BaseDropdownMenu from "@/app/components/Settings/Dropdown";
import Container from "@components/Container";
import { StyleSheet, View } from "react-native";


export enum LanguageCode {
  PL = 'pl',
  EN = 'en',
}

export const LanguageLabels: Record<LanguageCode, string> = {
  [LanguageCode.PL]: 'Polski',
  [LanguageCode.EN]: 'English',
}

export default function Settings() {
  return (
    <Container>
      <View
        style={styles.container}
      >
        <View style={styles.optionContainer}>
          <BaseDropdownMenu
            buttonText='Choose language'
            menuItems={
              LanguageLabels
            }
          />
        </View>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    minHeight: '100%',
    paddingBlock: 16,
    paddingInline: 8,
    alignItems: 'flex-end'
  },
  title: {
    fontSize: 24,
    fontWeight: '600'
  },
  button: {
    backgroundColor: 'white',
    fontSize: 32,
    marginLeft: 'auto'
  },
  optionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  }
})
