import { ReactNode } from "react"
import { View, Text, TextInput, StyleProp, ViewStyle, TextInputProps, TextStyle } from "react-native"

type inputStyles = {
  containerStyles?: StyleProp<ViewStyle>,
  titleStyles?: StyleProp<TextStyle>,
  inputStyles?: StyleProp<TextStyle>,
  inputWrapper?: StyleProp<ViewStyle>
}

type localProps = {
  name?: string,
  styles?: inputStyles,
  inputProps?: TextInputProps,
  icon?: ReactNode
}

export default function InputGroup({
   name = '',
   styles = {}, 
   inputProps = {},
   icon = null
  }: localProps) {
    return (
      <View style={styles?.containerStyles ?? {}}>
        {name && (
          <Text style={styles?.titleStyles ?? {}}>
            {name}
          </Text>
        )}
        
        <View style={styles?.inputWrapper}>
          { icon ? icon : undefined }
          
          <TextInput 
            {...inputProps} 
            style={[styles?.inputStyles, inputProps?.style]} 
          />
        </View>
      </View>
    )
}
