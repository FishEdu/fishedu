import { Text, View, StyleSheet } from "react-native"
import { Link } from "expo-router"

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text>Welcome to FishEdu.</Text>
      <Link href={"/register"}>Visit Register Page</Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
})
