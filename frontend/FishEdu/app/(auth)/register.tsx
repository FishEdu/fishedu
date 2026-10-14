import { View, Text, StyleSheet, ScrollView } from "react-native";
import RegisterForm from "@/app/components/RegisterForm/RegisterForm";
import Container from "@/app/components/ui/Container";
import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { Link } from "expo-router";

function Register() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Container>
          <Text style={styles.headerText}>Welcome to FishEdu</Text>
        </Container>
      </View>
      <Container>
        <>
          <RegisterForm />
          <Text style={styles.promptText}>
            Already have an account? <Link style={styles.loginLink} href="/login">Login</Link>
          </Text>
        </>
      </Container>
    </ScrollView>
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  
  header: {
    backgroundColor: colors.primary,
    paddingBlock: 24
  },

  headerText: {
    color: colors.text.onPrimary,
    fontWeight: 600,
    fontSize: 40,
  },

  loginLink: {
    color: colors.primary,
    fontWeight: 600
  },
  promptText: { color: colors.text.main },
})

export default Register;
