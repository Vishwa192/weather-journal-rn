import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { HomeStackParamList } from "../../App";
import { getAllEntries, Entry } from "@/db/databases";
import { useCallback, useState } from "react";

type DetailScreenRouteProp = RouteProp<HomeStackParamList, 'Detail'>;


export default function DetailScreen() {
    const route = useRoute<DetailScreenRouteProp>();
    const { entryId } = route.params;
    const [entry, setEntry] = useState<Entry | null>(null);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const all = await getAllEntries();
                const found = all.find((e) => e.id === entryId);
                setEntry(found ?? null);
            })();
        }, [entryId])
    )

    if (!entry) {
        return (
            <View style={styles.container}>
                <Text>Entry Not Found.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.meta}>
                {new Date(entry.createdAt).toLocaleString()}
            </Text>
            <Text style={styles.weather}>
                {entry.temperature}°C · Weather code {entry.weatherCode}
            </Text>
            <Text style={styles.note}>{entry.note}</Text>
            {entry.photoUri && (
                <Image source={{ uri: entry.photoUri }} style={styles.photo} />
            )}
            {/* <Text>Entry ID: {entryId}</Text> */}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    meta: { fontSize: 12, color: '#888', marginBottom: 4 },
    weather: { fontSize: 14, color: '#555', marginBottom: 16 },
    note: { fontSize: 16, lineHeight: 22, marginBottom: 16 },
    photo: { width: '100%', height: 250, borderRadius: 10 },
});