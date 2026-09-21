import { View, Text, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { HomeStackParamList } from "../../App";

type DetailScreenRouteProp = RouteProp<HomeStackParamList, 'Detail'>;


export default function DetailScreen() {
    const route = useRoute<DetailScreenRouteProp>();
    const {entryId} = route.params;
    return(
        <View style ={styles.container}>
            <Text>Details Screen</Text>
            <Text>Entry ID: {entryId}</Text>
        </View>
    ) 
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});