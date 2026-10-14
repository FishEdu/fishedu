import { View, Text, StyleSheet } from "react-native";
import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";

function Login() {
     const { colors } = useTheme();
     const styles = createStyles(colors);
     return (
        <View style={styles.container}>
            <Text style={styles.text}>Hello from Login Page</Text>
        </View>
    )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.app,
  },
  text: {
    color: colors.text.main,
  }
})

export default Login;
