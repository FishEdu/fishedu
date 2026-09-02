import { debounce } from "@/app/utils/debounce";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";
import InputGroup from "../FormInputs/InputGroup";

type FetchResult<T> = {
  result: T[]
}

type LocalProps<T> = {
  lastQuery: string,
  placeholder: string,
  setLastQuery: React.Dispatch<
    React.SetStateAction<string>>,
  setItems: React.Dispatch<
    React.SetStateAction<T[]>
  >,
  fetchFn: ((query: string) => Promise<FetchResult<T>>) | undefined
}

export default function Search<T>({
  lastQuery,
  placeholder,
  setLastQuery,
  setItems,
  fetchFn,
}: LocalProps<T>) {  
  return (
    <InputGroup
       styles={{
        containerStyles: styles.container,
        titleStyles: {},
        inputStyles: styles.input,
        inputWrapper: styles.inputWrapper,
      }}

      inputProps={{
        placeholder: placeholder,
        onChangeText: debounce((query: string) => {
          query = query.trim().toLowerCase()

          if(query === lastQuery)
            return

          //TODO: Remove type of undefined after implementing backend
          if(fetchFn === undefined)
            return
          
          fetchFn(query)
            .then(({ result }) => { 
              setItems(result)
              setLastQuery(query)
            })
        }, 500)
      }}

      icon={<Ionicons name='search' size={24} />}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    fontSize: 20,
    width: '100%',
    overflow: 'hidden'
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 24,
    marginBottom: 24,
    overflow: 'hidden'
  },
  inputWrapper: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBlock: 12,
    paddingInline: 8,
    borderRadius: 24,
  }
})