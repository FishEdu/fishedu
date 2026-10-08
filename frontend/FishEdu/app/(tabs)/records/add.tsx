import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import Container from "@/app/components/ui/Container"
import AddRecordForm from "@/app/components/Records/AddRecordForm"

export default function AddRecord() {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.header}>
          <Text style={styles.heading}>Nowy post</Text>
        </View>

        <AddRecordForm />
      </ScrollView>
    </Container>
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  header: {
    marginBottom: 14,
  },
  heading: {
    color: colors.text.main,
    fontSize: 24,
    fontWeight: "700",
  },
})
