import { JSX } from "react";
import { StyleSheet, View } from "react-native";

type localProps = {
  children: JSX.Element
}

function Container({ children }: localProps) {
  return ( 
    <View 
      style={styles.container}
    >
      { children }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingInline: 16,
    display: "flex",
    marginTop: 16
  }
})

export default Container
