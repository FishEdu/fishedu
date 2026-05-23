import { View, Text, StyleSheet, ScrollView } from "react-native";
import RegisterForm from "@/Components/RegisterForm";
import Container from "@/Components/Container";
import convertRemToPixels from "../utils/convertRemToPixels";

function Register() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Container>
          <Text style={styles.headerText}>Welcome to FishEdu</Text>
        </Container>
      </View>
      <Container>
        <RegisterForm />
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
    paddingBlock: convertRemToPixels(1.5)
  },

  headerText: {
    color: "white",
    fontWeight: 600,
    fontSize: 40,
  }
})

export default Register;
