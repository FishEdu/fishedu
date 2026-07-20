import { useState } from "react"
import { ScrollView } from "react-native"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { router } from "expo-router"
import InputGroup from "../FormInputs/InputGroup"
import { createRecord } from "@/app/utils/fetch/records/fetchRecords"
import FishingSpotPicker from "../FormInputs/FishingSpotPicker"
import { useFetchFish } from "@/app/hooks/useFetchFish/useFetchFish"

type FormData = {
    fish_id: number
    fish_name: string
    fishing_spot: string
    total_length: string
    fork_length: string
    description: string
}


export default function AddRecordForm() {
  const [formData, setFormData] = useState<FormData>({
    fish_id: 0,
    fish_name: "",
    fishing_spot: "",
    total_length: "",
    fork_length: "",
    description: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showFishList, setShowFishList] = useState(false)

  const { data: fishes } = useFetchFish(formData.fish_name)

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {


    if(!formData.fish_name.trim() || !formData.fishing_spot.trim()) {
      setError("Uzupelnij rybe i lowisko")
      return
    }

    setLoading(true)
    setError("")

    const record = await createRecord({
      fish_id: formData.fish_id,
      fish_name: formData.fish_name.trim(),
      fishing_spot: formData.fishing_spot.trim(),
      total_length: Number(formData.total_length) || undefined,
      fork_length: Number(formData.fork_length) || undefined,
      description: formData.description.trim() || undefined,
    })

    setLoading(false)

    if(!record) {
      setError("Nie udalo sie dodac rekordu")
      return
    }

    router.back()
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageInput}>
        <Text style={styles.imageIcon}>+</Text>
      </View>

    <View style={{ position: "relative" }}>
  <InputGroup
    styles={inputStyles}
    inputProps={{
      placeholder: "Wyszukaj rybe",
      value: formData.fish_name,

      onFocus: () => setShowFishList(true),

      onChangeText: value => {
        updateField("fish_name", value)
        setShowFishList(true)
      },
    }}
  />

  {showFishList &&
    Array.isArray(fishes) &&
    fishes.length > 0 && (
      <ScrollView
        style={{
          position: "absolute",
          top: 45,
          left: 0,
          right: 0,
          maxHeight: 200,
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 6,
          zIndex: 100,
        }}
      >
        {fishes.map(fish => (
          <Pressable
            key={fish.id}
            style={{ padding: 12 }}
            onPress={() => {
              setFormData(prev => ({
                ...prev,
                fish_id: fish.id,
                fish_name: fish.name,
              }))

              setShowFishList(false)
            }}
          >
            <Text>{fish.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
  )}
</View>


      <FishingSpotPicker
        value={formData.fishing_spot}
        onChange={(value) => updateField("fishing_spot", value)}
      />

      <View style={styles.lengthRow}>
        <InputGroup
          styles={{ ...inputStyles, containerStyles: styles.lengthInput }}
          inputProps={{
            placeholder: "TL cm",
            keyboardType: "numeric",
            value: formData.total_length,
            onChangeText: value => updateField("total_length", value),
          }}
        />

        <InputGroup
          styles={{ ...inputStyles, containerStyles: styles.lengthInput }}
          inputProps={{
            placeholder: "FL cm",
            keyboardType: "numeric",
            value: formData.fork_length,
            onChangeText: value => updateField("fork_length", value),
          }}
        />
      </View>

      <InputGroup
        styles={{
          ...inputStyles,
          inputWrapper: styles.descriptionWrapper,
        }}
        inputProps={{
          placeholder: "Opis",
          multiline: true,
          value: formData.description,
          onChangeText: value => updateField("description", value),
        }}
      />

      {error ? <Text style={styles.error}>{error}</Text> : undefined}

      <Pressable
        onPress={handleSubmit}
        style={({ pressed }) => [
  
          styles.submitButton,
          pressed && styles.submitButtonPressed,
          loading && styles.submitButtonDisabled,
        ]}
        disabled={loading}
      >
        <Text style={styles.submitText}>
          {loading ? "DODAWANIE..." : "DODAJ"}
        </Text>
      </Pressable>
    </View>
  )
}

const inputStyles = StyleSheet.create({
  containerStyles: {
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: "hsl(0, 0%, 96%)",
    borderRadius: 6,
    paddingBlock: 10,
    paddingInline: 12,
  },
  inputStyles: {
    fontSize: 13,
  },
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
  },
  imageInput: {
    alignItems: "center",
    aspectRatio: 1.55,
    backgroundColor: "hsl(0, 0%, 92%)",
    borderRadius: 8,
    justifyContent: "center",
    marginBottom: 12,
  },
  imageIcon: {
    color: "hsl(0, 0%, 20%)",
    fontSize: 44,
    lineHeight: 48,
  },
  lengthRow: {
    flexDirection: "row",
    gap: 8,
  },
  lengthInput: {
    flex: 1,
    marginBottom: 8,
  },
  descriptionWrapper: {
    backgroundColor: "hsl(0, 0%, 96%)",
    borderRadius: 6,
    minHeight: 82,
    paddingBlock: 10,
    paddingInline: 12,
  },
  error: {
    color: "hsl(0, 70%, 45%)",
    fontSize: 13,
    marginBottom: 8,
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: "hsl(226, 75%, 59%)",
    borderRadius: 16,
    paddingBlock: 12,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonPressed: {
    opacity: 0.85,
  },
  submitText: {
    color: "white",
    fontSize: 13,
    fontWeight: "700",
  },
})
