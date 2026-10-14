import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { useEffect, useState } from "react"
import { Modal, Pressable, ScrollView, StyleSheet, Text, View,} from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"

import AddRecordForm from "@/app/components/Records/AddRecordForm"
import Container from "@/app/components/ui/Container"
import { CatchRecordGetResponse } from "@/app/api/records"
import {deleteRecord,fetchRecord,} from "@/app/utils/fetch/records/fetchRecords"

export default function EditRecord() {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const { id } = useLocalSearchParams<{ id: string }>()

  const [record, setRecord] = useState<CatchRecordGetResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  useEffect(() => {
    const loadRecord = async () => {
      const foundRecord = await fetchRecord(Number(id))

      setRecord(foundRecord ?? null)
      setLoading(false)
    }

    loadRecord()
  }, [id])

  if (loading) {
    return (
      <Container>
        <Text style={styles.statusText}>Ładowanie...</Text>
      </Container>
    )
  }

  if (!record) {
    return (
      <Container>
        <Text style={styles.statusText}>Nie znaleziono rekordu.</Text>
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
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <AddRecordForm key={record.id} record={record} />

      <Pressable
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Ionicons name="trash-outline" size={20} color={colors.danger} />
        <Text style={styles.deleteText}>
          Usuń rekord
        </Text>
      </Pressable>
      </ScrollView>

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
                    color={colors.danger}
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
                      color={colors.text.onPrimary}
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

  const createStyles = (colors: AppColors) => StyleSheet.create({
    statusText: { color: colors.text.muted },
    deleteButton: {
      marginTop: 12,
      marginBottom: 20,
      alignSelf: "center",

      borderWidth: 1,
      borderColor: colors.danger,
      borderRadius: 8,

      paddingVertical: 8,
      paddingHorizontal: 16,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },

    deleteText: {
      color: colors.danger,
      fontSize: 12,
      fontWeight: "600",
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: colors.background.overlay,
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },

    modalContainer: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: colors.background.card,
      borderRadius: 20,
      padding: 24,
      alignItems: "center",
    },

    modalIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.background.dangerSoft,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
    },

    modalTitle: {
      fontSize: 19,
      fontWeight: "700",
      color: colors.text.main,
      marginBottom: 8,
    },

    modalDescription: {
      textAlign: "center",
      color: colors.text.muted,
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
      borderColor: colors.border.card,
      borderRadius: 10,
      paddingVertical: 11,
      alignItems: "center",
      justifyContent: "center",
    },

    cancelButtonText: {
      color: colors.text.main,
      fontSize: 13,
      fontWeight: "600",
    },

    confirmDeleteButton: {
      flex: 1,
      backgroundColor: colors.danger,
      borderRadius: 10,
      paddingVertical: 11,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },

    confirmDeleteText: {
      color: colors.text.onPrimary,
      fontSize: 13,
      fontWeight: "600",
    },
})