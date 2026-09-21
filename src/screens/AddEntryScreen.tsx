import { View, Text, StyleSheet } from "react-native";

export default function AddEntryScreen() {
    return(
        <View style ={styles.container}>
            <Text>Add Entry Screen</Text>
        </View>
    ) 
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});