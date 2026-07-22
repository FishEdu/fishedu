import { useEffect, useState } from "react"
import { Text } from "react-native"
import { useLocalSearchParams } from "expo-router"

import AddRecordForm from "@/app/components/Records/AddRecordForm"
import Container from "@/app/components/ui/Container"
import { CatchRecordGetResponse } from "@/app/api/records"
import { fetchRecords } from "@/app/utils/fetch/records/fetchRecords"

export default function EditRecord() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const [record, setRecord] = useState<CatchRecordGetResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRecord = async () => {
      const records = await fetchRecords()

      const foundRecord = records.find(
        r => r.id === Number(id)
      )

      setRecord(foundRecord ?? null)
      setLoading(false)
    }

    loadRecord()
  }, [id])

  if (loading) {
    return (
      <Container>
        <Text>Ładowanie...</Text>
      </Container>
    )
  }

  if (!record) {
    return (
      <Container>
        <Text>Nie znaleziono rekordu.</Text>
      </Container>
    )
  }

  return (
    <Container>
      <AddRecordForm record={record} />
    </Container>
  )
}
