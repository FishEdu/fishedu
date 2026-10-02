import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { CatchRecordGetResponse } from "@/app/api/records"
import { StyleSheet, Text, View } from "react-native"
import RecordCard from "./RecordCard"

type LocalProps = {
  records: CatchRecordGetResponse[],
  emptyText: string
}

export default function RecordsList({ records, emptyText }: LocalProps) {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  if(records.length === 0)
    return <Text style={styles.emptyText}>{emptyText}</Text>

  return (
    <View style={styles.container}>
      {records.map(record => (
        <RecordCard key={record.id} record={record} />
      ))}
    </View>
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    gap: 16,
  },
  emptyText: {
    color: colors.text.muted,
    fontSize: 16,
  }
})
