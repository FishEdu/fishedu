import { View, Text, StyleSheet } from "react-native";
import convertRemToPixels from "../utils/convertRemToPixels";
import RegisterForm from "@/components/RegisterForm";

function Register() {
     return (
        <View>
            <Text style={styles.header}>Welcome to FishEdu</Text>
            <RegisterForm />
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "hsl(226, 75%, 59%)",
    color: "white",
    fontWeight: 600,
    textAlign: "center",
    fontSize: 40,
    paddingBlock: convertRemToPixels(1)
  }
})

export default Register;
