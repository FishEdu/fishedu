import { ScrollView, StyleSheet, Text, View } from "react-native"
import Container from "@/app/components/ui/Container"
import AddRecordForm from "@/app/components/Records/AddRecordForm"

export default function AddRecord() {
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.heading}>Nowy post</Text>
        </View>

        <AddRecordForm />
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 14,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
  },
})
