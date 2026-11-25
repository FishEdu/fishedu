import { ReactNode } from "react";
import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { View, StyleSheet } from "react-native";

type localProps = {
  children: ReactNode
}

function Container({ children }: localProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {children}
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    paddingInline: 16,
    paddingTop: 64,
    backgroundColor: colors.background.app,
    display: "flex",
    flex: 1,
    position: 'relative',
  }
})

export default Container
