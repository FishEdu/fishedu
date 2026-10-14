import { useState } from "react";
import { View, Text, Modal, StyleSheet, Pressable } from "react-native";
import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import InputGroup from "./InputGroup";

interface CustomDatePickerProps {
  value: string   
  onChange: (date: string) => void
}

export const useDatePicker = () => {
const [date, setDate] = useState<string>("")

  const GetISODate = () => {
    return date ? new Date(date) : new Date()
  }

  const DatePickerElement = (
    <DatePicker
      value={date}
      onChange={setDate}
    />
  )

  return {
    DatePickerElement,
    date,
    setDate,
    GetISODate,
  }
}

export default function DatePicker({
  value,
  onChange,
}: CustomDatePickerProps) {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const [open, setOpen] = useState(false);

  const date = value ? new Date(value) : new Date()
  const [day, setDay] = useState<string>(String(date.getDate()))
  const [month, setMonth] = useState<string>(String(date.getMonth() + 1))
  const [year, setYear] = useState<string>(String(date.getFullYear()))

  const updateDate = () => {
    const dayNumber = Number(day) + 1
    const monthNumber = Number(month) - 1
    const yearNumber = Number(year)

    const newDate = new Date(yearNumber, monthNumber, dayNumber)

    if (!isNaN(newDate.getTime())) {
      onChange(newDate.toISOString().split("T")[0])
    }
  }

  const handleOnPress: () => void = () => {
    updateDate()
    setOpen(false)
  }

  return (
    <View>
      <Pressable onPress={() => setOpen(true)} style={styles.inputContainer}>
        <Text style={styles.input}>
          {`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`}
        </Text>
      </Pressable>

      <Modal visible={open} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.title}>Input date</Text>
            <View style={styles.inputs}>
              <InputGroup
                name="Day"
                
                styles={{
                  containerStyles: {},
                  titleStyles: styles.inputLabel,
                  inputStyles: styles.textInput,
                  inputWrapper: {},
                }}
                
                inputProps={{
                  style: styles.textInput,
                  placeholder: "Day",
                  keyboardType: "numeric",
                  value: day,
                  onChangeText: setDay,
                  onBlur: updateDate
                }}
              >
              </InputGroup>

              <InputGroup
                name="Month"
                styles={{
                  containerStyles: {},
                  titleStyles: styles.inputLabel,
                  inputStyles: styles.textInput,
                  inputWrapper: {},
                }}
                
                inputProps={{
                  style: styles.textInput,
                  placeholder: "Month",
                  keyboardType: "numeric",
                  value: month,
                  onChangeText: setMonth,
                  onBlur: updateDate
                }}
              >
              </InputGroup>

              <InputGroup
                name="Year"
                styles={{
                  containerStyles: {},
                  titleStyles: styles.inputLabel,
                  inputStyles: styles.textInput,
                  inputWrapper: {},
                }}
                
                inputProps={{
                  style: styles.textInput,
                  placeholder: "Yeat",
                  keyboardType: "numeric",
                  value: year,
                  onChangeText: setYear,
                  onBlur: updateDate
                }}
              >
              </InputGroup>
            </View>
            <Pressable onPress={handleOnPress} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 16
  },
  input: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.background.card
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.background.overlay
  },
  modalBox: {
    backgroundColor: colors.background.card,
    margin: 24,
    padding: 24,
    borderRadius: 8
  },
  title: {
    color: colors.text.main,
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center"
  },
  textInput: {
    borderColor: colors.border.subtle,
    color: colors.text.main,
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    textAlign: "center",
    flexGrow: 1
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center"
  },
  closeButtonText: {
    color: colors.primary,
    fontWeight: 600
  },
  inputLabel: { color: colors.text.main },
  inputs: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginBottom: 16
  }
});
