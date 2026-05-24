import { View, Text, StyleSheet } from "react-native";

function Login() {
     return (
        <View style={styles.container}>
            <Text>Hello from Login Page</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default Login;
