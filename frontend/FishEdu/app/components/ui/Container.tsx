import { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";

type localProps = {
  children: ReactNode
  useScrollView?: boolean
}

function Container(
  { 
    children,
    useScrollView = true 
  }: localProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    useScrollView ?
      <ScrollView 
        style={styles.container}
      >
        { children }
      </ScrollView>
    : <View 
        style={styles.container}
      > 
      { children } 
    </View>
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    paddingInline: 16,
    paddingTop: 64,
    backgroundColor: colors.background.app,
    display: "flex",
    marginTop: 16,
    flex: 1
  }
})

export default Container
