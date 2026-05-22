import convertRemToPixels from "@/app/utils/convertRemToPixels";
import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput } from "react-native";

interface CustomDatePickerProps {
  value: string;                     
  onChange: (date: string) => void;
}

export default function CustomDatePicker({
  value,
  onChange,
}: CustomDatePickerProps) {
  const [open, setOpen] = useState(false);

  const date = value ? new Date(value) : new Date();
  const [day, setDay] = useState(String(date.getDate()));
  const [month, setMonth] = useState(String(date.getMonth() + 1));
  const [year, setYear] = useState(String(date.getFullYear()));

  const updateDate = () => {
    const dayNumber = Number(day);
    const monthNumber = Number(month) - 1;
    const yearNumber = Number(year);

    const newDate = new Date(yearNumber, monthNumber, dayNumber);

    if (!isNaN(newDate.getTime())) {
      onChange(newDate.toISOString().split("T")[0]);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setOpen(true)} style={styles.inputContainer}>
        <Text style={styles.input}>
          {`${date.getDate()}`}
        </Text>
         <Text style={styles.input}>
          {`${date.getMonth()}`}
        </Text>
         <Text style={styles.input}>
          {`${date.getFullYear()}`}
        </Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.title}>Input date</Text>

            <View style={styles.row}>
              <View style={styles.dayMonthColumn}>
                <Text>Day</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={day}
                  onChangeText={setDay}
                  onBlur={updateDate}
                  placeholder="DD"
                />
              </View>
              
              <View style={styles.column}>
                <Text>Month</Text>
                  <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={month}
                  onChangeText={setMonth}
                  onBlur={updateDate}
                  placeholder="MM"
                />
              </View>
              
              <View style={styles.column}>
                <Text>Year</Text>
                 <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={year}
                  onChangeText={setYear}
                  onBlur={updateDate}
                  placeholder="YYYY"
                />
              </View>
            </View>
            <TouchableOpacity onPress={() => setOpen(false)} style={styles.closeBtn}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    gap: convertRemToPixels(1)
  },
  input: {
    padding: convertRemToPixels(.75),
    borderWidth: 1,
    borderRadius: convertRemToPixels(.5),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  modalBox: {
    backgroundColor: "white",
    margin: convertRemToPixels(1.5),
    padding: convertRemToPixels(1.5),
    borderRadius: convertRemToPixels(.5)
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: convertRemToPixels(.5),
    maxWidth: convertRemToPixels(6),
    minWidth: convertRemToPixels(4)
  },
  dayMonthColumn: {
    maxWidth: convertRemToPixels(2.5),
    minWidth: convertRemToPixels(2)
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    textAlign: "center",
    flexGrow: 1
  },
  monthName: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16
  },
  closeBtn: {
    marginTop: 20,
    alignSelf: "center"
  }
});
