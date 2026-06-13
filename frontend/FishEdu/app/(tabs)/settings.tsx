import { View, StyleSheet } from "react-native";
import BaseDropdownMenu from "@/app/components/Settings/Dropdown";
import Container from "@components/Container";


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
        <BaseDropdownMenu
          buttonText='Choose language'
          menuItems={
            LanguageLabels
          }
        />
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
