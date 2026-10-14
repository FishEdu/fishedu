import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  prominent?: boolean;
  onPress?: () => void;
};

export default function HomeActionCard({ label, icon, prominent = false, onPress }: Props) {
  const content = (
    <>
      <Ionicons name={icon} size={prominent ? 40 : 24} />
      <Text style={[styles.buttonText, prominent && styles.mainButtonText]}>{label}</Text>
    </>
  );
  const style = [styles.button, prominent && styles.mainButton];
  return onPress ? (
    <Pressable style={style} onPress={onPress}>{content}</Pressable>
  ) : (
    <View style={style}>{content}</View>
  );
}

const styles = StyleSheet.create({
  mainButton: {
    width: '100%'
  },
  button: {
    width: '48%',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBlock: 16
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center'
  },
  mainButtonText: {
    fontSize: 28
  }
});
