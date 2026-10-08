import BaseDropdownMenu from "./Dropdown";
import { LanguageLabels } from "@/app/constants/language";
import { StyleSheet, View } from "react-native";

export default function LanguageSetting() {
  return (
    <View style={styles.optionContainer}>
      <BaseDropdownMenu buttonText="Choose language" menuItems={LanguageLabels} />
    </View>
  );
}

const styles = StyleSheet.create({
  optionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-end',
    gap: 4,
  },
});
