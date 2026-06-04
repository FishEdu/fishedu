import { View, StyleSheet } from "react-native"
import FishList from "../components/FishSearch/FishList"
import { fishListElementProps } from "../components/FishSearch/fishListElementProps"


export default function Index() {
  const data: fishListElementProps[] = [
    {
      imageUrl: '',
      name: 'Karp',
      environment: 'Freshwater',
      isEndangered: false,
    }
  ];
  
  return (
    <View
      style={styles.container}
    >
      <FishList
        data={data}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainerStyles: {
  },
  textInput: {
    fontSize: 20,
    paddingBlock: 8,
  },
  titleStyles: {
    
  },
  inputStyles: {
    color: "hsl(0, 0%, 35%)",
  },
  inputWrapper: {
    backgroundColor: 'white',
    paddingInline: 12,
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
})
