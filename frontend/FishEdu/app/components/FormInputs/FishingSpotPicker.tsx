import { StyleSheet, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const fishingSpots = [
  { label: "Jezioro", value: "jezioro" },
  { label: "Staw", value: "staw" },
  { label: "Rzeka", value: "rzeka" },
  { label: "Morze", value: "morze" },
];

export default function FishingSpotPicker({
  value,
  onChange,
  disabled = false,
}: Props) {
  return (
    <View style={styles.container}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => onChange(itemValue)}
          enabled={!disabled}
        >
        <Picker.Item label="Wybierz łowisko" value="" />

        {fishingSpots.map((spot) => (
          <Picker.Item
            key={spot.value}
            label={spot.label}
            value={spot.value}
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "hsl(0,0%,96%)",
    borderRadius: 6,
    marginBottom: 8,
    overflow: "hidden",
  },
});