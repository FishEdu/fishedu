import { Text, View, TouchableOpacity } from "react-native";
import InputGroup from "../FormInputs/InputGroup";
import { useDatePicker } from "../FormInputs/DatePicker";
import { registerFormStyles } from "./styles";
import { useValidateRegisterData } from "./useValidateRegisterData";

export default function RegisterForm() { 
  const { formData, errors, setFormData, handleSubmit } = useValidateRegisterData()
  const { DatePickerElement } = useDatePicker()

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const styles = registerFormStyles

  const inputs = [
    { name: "Login", field: "login", value: formData.login },
    { name: "Email", field: "email", value: formData.email },
    { name: "Password", field: "password", value: formData.password },
    { name: "Repeat password", field: "repeatedPassword", value: formData.repeatedPassword },
  ]

  return (
    <View>
      {
        inputs.map(input => (
          <View key={input.field}>
            <InputGroup
              name={input.name}
              styles={{
                containerStyles: styles.inputContainerStyles,
                titleStyles: styles.titleStyles,
                inputStyles: styles.inputStyles,
                inputWrapper: styles.inputWrapper,
              }}
              inputProps={{
                placeholder: input.name,
                value: input.value,
                onChangeText: (text: string) => updateField(input.field as keyof FormData, text)
              }}
            />
            {errors[input.field] && (
              <Text style={{ color: "red" }}>{errors[input.field]}</Text>
            )}
          </View>
        ))
      }

      <View style={styles.inputContainerStyles}>
        <Text style={styles.titleStyles}>Birthday</Text>
        { DatePickerElement }
        {errors.birthday && (
          <Text style={{ color: "red" }}>{errors.birthday}</Text>
        )}
      </View>

      <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
        <Text style={styles.submitText}>Register</Text>
      </TouchableOpacity>
    </View>
  )
}
