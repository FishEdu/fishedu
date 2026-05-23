import { View, Text, TextInput, StyleProp, ViewStyle, TextInputProps, TextStyle } from "react-native"

type inputStyles = {
  containerStyles: StyleProp<ViewStyle>,
  titleStyles: StyleProp<TextStyle>,
  inputStyles: StyleProp<TextStyle>,
  inputWrapper: StyleProp<ViewStyle>
}

type localProps = {
  name: string | null,
  styles: inputStyles,
  inputProps: TextInputProps
}

function InputGroup({ inputProps, name, styles }: localProps) {
  return (
    <View style={styles?.containerStyles ?? {}}>
      {name && (
        <Text style={styles?.titleStyles ?? {}}>
          {name}
        </Text>
      )}
      
      <View style={styles.inputWrapper}>
        <TextInput {...inputProps} style={[styles?.inputStyles , inputProps?.style]} />
      </View>
    </View>
  )
}


export default InputGroup
