import { ReactNode } from "react"
import { View, Text, TextInput, StyleProp, ViewStyle, TextInputProps, TextStyle } from "react-native"
import { useTheme } from "@/app/hooks/useTheme/useTheme"

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
    const { colors } = useTheme()
    return (
      <View style={styles?.containerStyles ?? {}}>
        {name && (
          <Text style={[{ color: colors.text.main }, styles?.titleStyles]}>
            {name}
          </Text>
        )}
        
        <View style={styles?.inputWrapper}>
          { icon ? icon : undefined }
          
          <TextInput 
            placeholderTextColor={colors.text.muted}
            selectionColor={colors.primary}
            {...inputProps} 
            style={[{ color: colors.text.main }, styles?.inputStyles, inputProps?.style]}
          />
        </View>
      </View>
    )
}
