import convertRemToPixels from "@/app/utils/convertRemToPixels";
import { useState } from "react";
import { TextInput, Text, StyleSheet, View } from "react-native";
import CustomDatePicker from "./MyDatePicker";
// import DatePicker from 'expo-datepicker';
// import { z } from "zod";

// const passwordLength = 10;
// const specialBigNumberRegEx = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+]).+$/;

// const User = z.object({
//   login: z.string()
//     .min(1, "Login can't be empty"),
  
//   email: z.email("Invalid email format"),
  
//   password: z.string()
//     .min(passwordLength, `Password should be at least ${passwordLength} characters long`)
//     .refine((value) => specialBigNumberRegEx.test(value), 
//       "Password must have at least 1 special character, one number and one big character"
//     ),
  
//   repeatedPassword: z.string()
//     .min(passwordLength, `Password should be at least ${passwordLength} characters long`),
  
//   //YYYY-MM-DD format
//   birthday: z.iso.date()
// })
// .refine((data) => 
//   data.password === data.repeatedPassword, {
//     message: "Passwords do not match",
//     path: ["repeatedPassword"]
// })

const inputNames = ["Login", "Email", "Password", "Repeat Password"]

function RegisterForm() {
  const [birthday, setBirthday] = useState("");
    
    return (
        <View>
          <View>
            {
              inputNames.map(name => (           
                <View key={name} style={styles.input}>
                  <Text style={styles.inputHeader}>{name}</Text>
                  <TextInput placeholder={name}/>
                </View>
            ))}
            <View style={styles.input}>
              <Text style={styles.inputHeader}>Birthday</Text>
              <CustomDatePicker
                value={birthday}
                onChange={setBirthday}
              />
              {/* <DatePicker
                // inputStyle={styles.dateInput}
                date={date}
                onChange={setDate}
              /> */}
            </View>
          </View>
          <Text>Already have an account?
            <Text> Login</Text>
          </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
      backgroundColor: "white",
      paddingBlock: convertRemToPixels(1),
      paddingInline: convertRemToPixels(1.5),
      borderRadius: convertRemToPixels(1),
      color: "hsl(0, 0%, 35%)",
      fontSize: convertRemToPixels(1.25)
    },

    dateInput: {
      color: "hsl(0, 0%, 35%)",
      backgroundColor: "white",
      fontSize: convertRemToPixels(1.25)
    },

    inputHeader: {
      fontSize: convertRemToPixels(2)
    }
})

export default RegisterForm;
