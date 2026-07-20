import { CatchRecordGetResponse } from "@/app/api/records"
import { StyleSheet, Text, View } from "react-native"
import RecordCard from "./RecordCard"

type LocalProps = {
  records: CatchRecordGetResponse[],
  emptyText: string
}

export default function RecordsList({ records, emptyText }: LocalProps) {
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

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  emptyText: {
    color: "hsl(0, 0%, 35%)",
    fontSize: 16,
  }
})
