import { useEffect, useState } from "react"
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { router } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"

import InputGroup from "../FormInputs/InputGroup"
import FishingSpotPicker from "../FormInputs/FishingSpotPicker"

import {
  createRecord,
  updateRecord,
} from "@/app/utils/fetch/records/fetchRecords"

import { useFetchFish } from "@/app/hooks/useFetchFish/useFetchFish"
import { CatchRecordGetResponse } from "@/app/api/records"

type FormData = {
  fish_id: number
  fish_name: string
  fishing_spot: string
  total_length: string
  fork_length: string
  weight: string
  description: string
}

type Props = {
  record?: CatchRecordGetResponse
}

export default function AddRecordForm({ record }: Props) {
  const [formData, setFormData] = useState<FormData>({
    fish_id: 0,
    fish_name: "",
    fishing_spot: "",
    total_length: "",
    fork_length: "",
    weight: "",
    description: "",
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showFishList, setShowFishList] = useState(false)

useEffect(() => {
  if (record) {
    console.log("EDIT RECORD:", record)

    setFormData({
      fish_id: record.fish_id ?? 0,
      fish_name: record.fish_name ?? "",
      fishing_spot: record.fishing_spot,
      total_length: record.total_length?.toString() ?? "",
      fork_length: record.fork_length?.toString() ?? "",
      weight: record.weight?.toString() ?? "",
      description: record.description ?? "",
    })
  }
}, [record])

  const { data: fishes } = useFetchFish(formData.fish_name)

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    if (
      !formData.fish_name.trim() ||
      !formData.fishing_spot.trim()
    ) {
      setError("Uzupełnij rybę i łowisko")
      return
    }

    setLoading(true)
    setError("")

    const data = {
      fish_id: formData.fish_id,
      fish_name: formData.fish_name.trim(),
      fishing_spot: formData.fishing_spot.trim(),
      total_length:
        Number(formData.total_length) || undefined,
      fork_length:
        Number(formData.fork_length) || undefined,
      weight:
        Number(formData.weight.replace(",", ".")) || undefined,
      description:
        formData.description.trim() || undefined,
    }

    const result = record
      ? await updateRecord(record.id, data)
      : await createRecord(data)

    setLoading(false)

    if (!result) {
      setError("Nie udało się zapisać rekordu")
      return
    }

    if (!record) {
      setFormData({
        fish_id: 0,
        fish_name: "",
        fishing_spot: "",
        total_length: "",
        fork_length: "",
        weight: "",
        description: "",
      })
    }

    router.replace("/(tabs)/records")
  }

  return (
    <View style={styles.container}>

      {/* IMAGE */}

      <View style={styles.imageInput}>
        <View style={styles.imageIconContainer}>
          <Ionicons
            name="camera-outline"
            size={30}
            color="#777"
          />
        </View>

        <Text style={styles.imageTitle}>
          Dodaj zdjęcie
        </Text>

        <Text style={styles.imageSubtitle}>
          Opcjonalnie
        </Text>
      </View>


      {/* FISH */}

      <View style={[styles.section, styles.fishSection]}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="fish-outline"
            size={18}
            color="hsla(200, 75%, 52%, 0.96)"
          />

          <Text style={styles.sectionTitle}>
            Ryba
          </Text>
        </View>

        <View style={styles.fishWrapper}>

          <View style={styles.fishInputContainer}>
            <Ionicons
              name="search-outline"
              size={18}
              color="#888"
            />

            <InputGroup
              styles={fishInputStyles}
              inputProps={{
                placeholder: "Wyszukaj rybę...",
                value: formData.fish_name,

                onFocus: () => {
                  setShowFishList(true)
                },

                onChangeText: value => {
                  updateField("fish_name", value)
                  setShowFishList(true)
                },

              }}
            />

            {formData.fish_name && (
              <Pressable
                onPress={() => {
                  setFormData(prev => ({
                    ...prev,
                    fish_id: 0,
                    fish_name: "",
                  }))
                }}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color="#aaa"
                />
              </Pressable>
            )}
          </View>


          {showFishList &&
            Array.isArray(fishes) &&
            fishes.length > 0 && (

              <View style={styles.fishResults}>

                <Text style={styles.resultsTitle}>
                  Wyniki wyszukiwania
                </Text>

                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                  style={styles.resultsScroll}
                >
                  {fishes.map(fish => {
                    const selected =
                      fish.id === formData.fish_id

                    return (
                      <Pressable
                        key={fish.id}
                        style={[
                          styles.fishResult,
                          selected &&
                            styles.selectedFishResult,
                        ]}
                        onPress={() => {
                          setFormData(prev => ({
                            ...prev,
                            fish_id: fish.id,
                            fish_name: fish.name,
                          }))

                          setShowFishList(false)
                        }}
                      >
                        <View style={styles.fishResultLeft}>

                          <View style={styles.fishResultIcon}>
                            <Ionicons
                              name="fish-outline"
                              size={18}
                              color={
                                selected
                                  ? "hsla(200, 75%, 52%, 0.96)"
                                  : "#777"
                              }
                            />
                          </View>

                          <Text
                            style={[
                              styles.fishResultText,
                              selected &&
                                styles.selectedFishText,
                            ]}
                          >
                            {fish.name}
                          </Text>

                        </View>

                        {selected && (
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color="hsla(200, 75%, 52%, 0.96)"
                          />
                        )}
                      </Pressable>
                    )
                  })}
                </ScrollView>

              </View>
            )}
        </View>
      </View>


      {/* FISHING SPOT */}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="location-outline"
            size={18}
            color="hsla(200, 75%, 52%, 0.96)"
          />

          <Text style={styles.sectionTitle}>
            Łowisko
          </Text>
        </View>

        <FishingSpotPicker
          value={formData.fishing_spot}
          onChange={value =>
            updateField("fishing_spot", value)
          }
          disabled={showFishList}
        />
      </View>


      {/* MEASUREMENTS */}

      <View style={styles.section}>

        <View style={styles.sectionHeader}>
          <Ionicons
            name="resize-outline"
            size={18}
            color="hsla(200, 75%, 52%, 0.96)"
          />

          <Text style={styles.sectionTitle}>
            Wymiary i waga
          </Text>
        </View>

        <View style={styles.lengthRow}>

          <View style={styles.measureInput}>
            <Text style={styles.measureLabel}>
              TL
            </Text>

            <InputGroup
              styles={measureInputStyles}
              inputProps={{
                placeholder: "cm",
                keyboardType: "numeric",
                value: formData.total_length,
                onChangeText: value =>
                  updateField(
                    "total_length",
                    value
                  ),
              }}
            />
          </View>


          <View style={styles.measureInput}>
            <Text style={styles.measureLabel}>
              FL
            </Text>

            <InputGroup
              styles={measureInputStyles}
              inputProps={{
                placeholder: "cm",
                keyboardType: "numeric",
                value: formData.fork_length,
                onChangeText: value =>
                  updateField(
                    "fork_length",
                    value
                  ),
              }}
            />
          </View>


          <View style={styles.measureInput}>
            <Text style={styles.measureLabel}>
              Waga
            </Text>

            <InputGroup
              styles={measureInputStyles}
              inputProps={{
                placeholder: "kg",
                keyboardType: "numeric",
                value: formData.weight,
                onChangeText: value =>
                  updateField(
                    "weight",
                    value
                  ),
              }}
            />
          </View>

        </View>
      </View>


      {/* DESCRIPTION */}

      <View style={styles.section}>

        <View style={styles.sectionHeader}>
          <Ionicons
            name="document-text-outline"
            size={18}
            color="hsla(200, 75%, 52%, 0.96)"
          />

          <Text style={styles.sectionTitle}>
            Opis
          </Text>
        </View>

        <InputGroup
          styles={{
            ...inputStyles,
            inputWrapper:
              styles.descriptionWrapper,
          }}
          inputProps={{
            placeholder:
              "Dodaj opis połowu...",
            multiline: true,
            value: formData.description,
            onChangeText: value =>
              updateField(
                "description",
                value
              ),
          }}
        />

      </View>


      {/* ERROR */}

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={18}
            color="#d32f2f"
          />

          <Text style={styles.error}>
            {error}
          </Text>
        </View>
      ) : null}


      {/* SUBMIT */}

      <Pressable
        onPress={handleSubmit}
        style={({ pressed }) => [
          styles.submitButton,
          pressed &&
            styles.submitButtonPressed,
          loading &&
            styles.submitButtonDisabled,
        ]}
        disabled={loading}
      >
        <Ionicons
          name={
            record
              ? "checkmark-circle-outline"
              : "add-circle-outline"
          }
          size={19}
          color="#fff"
        />

        <Text style={styles.submitText}>
          {loading
            ? "Zapisywanie..."
            : record
              ? "Zapisz zmiany"
              : "Dodaj rekord"}
        </Text>
      </Pressable>

    </View>
  )
}


/* INPUT STYLES */

const inputStyles = StyleSheet.create({
  containerStyles: {
    marginBottom: 8,
  },

  inputWrapper: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },

  inputStyles: {
    fontSize: 13,
    color: "#222",
  },
})


const fishInputStyles = StyleSheet.create({
  containerStyles: {
    flex: 1,
    marginBottom: 0,
  },

  inputWrapper: {
    backgroundColor: "transparent",
    paddingVertical: 0,
    paddingHorizontal: 0,
  },

  inputStyles: {
    fontSize: 13,
    color: "#222",
  },
})


const measureInputStyles = StyleSheet.create({
  containerStyles: {
    width: "100%",
    marginBottom: 0,
  },

  inputWrapper: {
    width: "100%",
    height: 50,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingVertical: 0,
    paddingHorizontal: 8,
    justifyContent: "center",
  },

  inputStyles: {
    width: "100%",
    height: 50,
    fontSize: 14,
    color: "#222",
    textAlign: "center",
    padding: 0,
    margin: 0,
  },
})


/* MAIN STYLES */

const styles = StyleSheet.create({

  container: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    gap: 4,
  },


  /* IMAGE */

  imageInput: {
    height: 150,
    backgroundColor: "#f3f3f3",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },

  imageIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  imageTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
  },

  imageSubtitle: {
    fontSize: 10,
    color: "#999",
    marginTop: 2,
  },


  /* SECTIONS */

  section: {
    marginTop: 14,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 7,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#555",
  },


  /* FISH */
  fishSection: {
    position: "relative",
    zIndex: 1000,
    elevation: 1000,
  },

  fishWrapper: {
    position: "relative",
    zIndex: 20,
    elevation: 20,
  },

  fishInputContainer: {
    minHeight: 50,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  fishResults: {
    position: "absolute",
    top: 55,
    left: 0,
    right: 0,

    backgroundColor: "#fff",
    borderRadius: 12,

    padding: 6,

    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 30,
    zIndex: 100,
  },

  resultsTitle: {
    fontSize: 10,
    color: "#999",
    fontWeight: "600",
    paddingHorizontal: 9,
    paddingVertical: 7,
  },

  resultsScroll: {
    maxHeight: 210,
  },

  fishResult: {
    minHeight: 48,
    paddingHorizontal: 8,
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedFishResult: {
    backgroundColor: "#f0f2ff",
  },

  fishResultLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  fishResultIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },

  fishResultText: {
    fontSize: 13,
    color: "#333",
  },

  selectedFishText: {
    color: "hsla(200, 75%, 52%, 0.96)",
    fontWeight: "600",
  },


  /* MEASUREMENTS */

  lengthRow: {
    flexDirection: "row",
    gap: 8,
  },

  measureInput: {
    flex: 1,
    minWidth: 0,
    minHeight: 74,
  },

  measureLabel: {
    fontSize: 10,
    color: "#888",
    marginBottom: 4,
    textAlign: "center",
    fontWeight: "600",
  },


  /* DESCRIPTION */

  descriptionWrapper: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    minHeight: 95,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },


  /* ERROR */

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#fff1f1",
    borderRadius: 9,
    padding: 10,
    marginTop: 5,
  },

  error: {
    flex: 1,
    color: "#d32f2f",
    fontSize: 12,
    fontWeight: "500",
  },


  /* SUBMIT */

  submitButton: {
    marginTop: 10,
    minHeight: 48,
    borderRadius: 13,
    backgroundColor: "hsla(200, 75%, 52%, 0.96)",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  submitButtonPressed: {
    opacity: 0.85,
  },

  submitButtonDisabled: {
    opacity: 0.65,
  },

  submitText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
})
