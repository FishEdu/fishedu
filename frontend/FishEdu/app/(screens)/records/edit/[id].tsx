import { useEffect, useState } from "react"
import { Modal, Pressable, StyleSheet, Text, View,} from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"

import AddRecordForm from "@/app/components/Records/AddRecordForm"
import Container from "@/app/components/ui/Container"
import { CatchRecordGetResponse } from "@/app/api/records"
import {deleteRecord,fetchRecords,} from "@/app/utils/fetch/records/fetchRecords"

export default function EditRecord() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const [record, setRecord] = useState<CatchRecordGetResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

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
    const handleDelete = () => {
      setDeleteModalVisible(true)
    }

    const confirmDelete = async () => {
      const success = await deleteRecord(record.id)

      if (success) {
        setDeleteModalVisible(false)
        router.back()
      }
    }

  return (
    <Container>
      <AddRecordForm record={record} />

      <Pressable
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Ionicons name="trash-outline" size={20} color="#d32f2f" />
        <Text style={styles.deleteText}>
          Usuń rekord
        </Text>
      </Pressable>

        <Modal
            visible={deleteModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setDeleteModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>

                <View style={styles.modalIcon}>
                  <Ionicons
                    name="trash-outline"
                    size={28}
                    color="#d32f2f"
                  />
                </View>

                <Text style={styles.modalTitle}>
                  Usuń rekord?
                </Text>

                <Text style={styles.modalDescription}>
                  Czy na pewno chcesz usunąć ten rekord?
                  Tej operacji nie można cofnąć.
                </Text>

                <View style={styles.modalButtons}>
                  <Pressable
                    style={styles.cancelButton}
                    onPress={() => setDeleteModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>
                      Anuluj
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.confirmDeleteButton}
                    onPress={confirmDelete}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={17}
                      color="#fff"
                    />

                    <Text style={styles.confirmDeleteText}>
                      Usuń
                    </Text>
                  </Pressable>
                </View>

              </View>
            </View>
          </Modal>
    </Container>
  )

}

  const styles = StyleSheet.create({
    deleteButton: {
      marginTop: 12,
      marginBottom: 20,
      alignSelf: "center",

      borderWidth: 1,
      borderColor: "#d32f2f",
      borderRadius: 8,

      paddingVertical: 8,
      paddingHorizontal: 16,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },

    deleteText: {
      color: "#d32f2f",
      fontSize: 12,
      fontWeight: "600",
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.45)",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },

    modalContainer: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: "#fff",
      borderRadius: 20,
      padding: 24,
      alignItems: "center",
    },

    modalIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "#fdecec",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
    },

    modalTitle: {
      fontSize: 19,
      fontWeight: "700",
      color: "#111",
      marginBottom: 8,
    },

    modalDescription: {
      textAlign: "center",
      color: "#666",
      fontSize: 13,
      lineHeight: 19,
      marginBottom: 22,
    },

    modalButtons: {
      width: "100%",
      flexDirection: "row",
      gap: 10,
    },

    cancelButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 10,
      paddingVertical: 11,
      alignItems: "center",
      justifyContent: "center",
    },

    cancelButtonText: {
      color: "#555",
      fontSize: 13,
      fontWeight: "600",
    },

    confirmDeleteButton: {
      flex: 1,
      backgroundColor: "#d32f2f",
      borderRadius: 10,
      paddingVertical: 11,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },

    confirmDeleteText: {
      color: "#fff",
      fontSize: 13,
      fontWeight: "600",
    },
})
