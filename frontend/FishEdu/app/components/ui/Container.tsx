import { JSX, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";

type localProps = {
  children: ReactNode
}

function Container({ children }: localProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return ( 
    <View 
      style={styles.container}
    >
      { children }
    </View>
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    paddingInline: 16,
    backgroundColor: colors.background.app,
    display: "flex",
    marginTop: 16,
    flex: 1
  }
})

export default Container
