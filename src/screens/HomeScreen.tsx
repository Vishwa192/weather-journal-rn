import { View, Text, StyleSheet, Button } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../../App";

type HomeScreenNavProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavProp>();
    return(
        <View style ={styles.container}>
            <Text>Home Screen</Text>
            <Button title="Add Entry" onPress={() => navigation.navigate('AddEntry')} />
            <Button title="View Sample Detail" onPress={() => navigation.navigate('Detail', {entryId: 1})} />
        </View>
    ) 
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap:12 },
});