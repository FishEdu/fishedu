import { useEffect, useState } from "react";
import { z } from "zod";
import { useDatePicker } from "../FormInputs/DatePicker";

const passwordLength = 10;
const specialBigNumberRegEx = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+]).+$/;

const User = z.object({
  login: z.string().min(1, "Login can't be empty"),
  
  email: z.email("Invalid email format"),
  
  password: z.string()
    .refine((value) => specialBigNumberRegEx.test(value),
      "Password must have at least one special character, one number and one big character"
    )
    .min(passwordLength, `Password should be at least ${passwordLength} characters long`),
  
  repeatedPassword: z.string(),
  
  birthday: z.iso.date("Invalid date format")
})
.refine((data) => data.password === data.repeatedPassword, {
  message: "Passwords do not match",
  path: ["repeatedPassword"]
})

interface FormData {
  login: string
  email: string
  password: string
  repeatedPassword: string
  birthday: string
}

export const useValidateRegisterData = () => {
  const [ errors, setErrors ] = useState<Record<string, string>>({})
  const [ formData, setFormData ] = useState<FormData>({
    login: "",
    email: "",
    password: "",
    repeatedPassword: "",
    birthday: ""
  })

  const { GetISODate } = useDatePicker()
  
  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  useEffect(() => {
    const date = GetISODate().toISOString().split("T")[0]
    updateField("birthday", date)
  }, [GetISODate])
  
  const validateForm = () => {
    const result = User.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        fieldErrors[field] = issue.message
      })

      setErrors(fieldErrors)
      
      return false
    }

    setErrors({})
    
    return true
  }

  const handleSubmit = () => {
    const isFormValid: boolean = validateForm();
    if (!isFormValid) {
      console.log("Form has errors:", errors)
      console.log("Form data:", formData)
      
      return
    }

    console.log("Form submitted successfully!")
    console.log("Form data:", formData)
  }

  return {
    validateForm,
    setFormData,
    updateField,
    handleSubmit,
    formData,
    errors,
  }
}
