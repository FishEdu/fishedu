import { View, Text, StyleSheet, ScrollView } from "react-native";
import RegisterForm from "@/app/components/RegisterForm/RegisterForm";
import Container from "@/app/components/Container";
import { Link } from "expo-router";

function Register() {
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
          <Text>
            Already have an account? <Link style={styles.loginLink} href="/login">Login</Link>
          </Text>
        </>
      </Container>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  header: {
    backgroundColor: "hsl(226, 75%, 59%)",
    paddingBlock: 24
  },

  headerText: {
    color: "white",
    fontWeight: 600,
    fontSize: 40,
  },

  loginLink: {
    color: "hsl(226, 75%, 59%)",
    fontWeight: 600
  },
})

export default Register;
