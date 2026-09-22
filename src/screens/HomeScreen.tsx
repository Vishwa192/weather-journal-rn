import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Alert } from "react-native";
import Swipeable  from "react-native-gesture-handler/ReanimatedSwipeable";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { HomeStackParamList } from "../../App";
import { getAllEntries, Entry, deleteEntry } from "@/db/databases";
import { useCallback, useState } from "react";

type HomeScreenNavProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavProp>();
    const [entries, setEntries] = useState<Entry[]>([]);

    const loadEntries = useCallback(async () => {
        const all = await getAllEntries();
        setEntries(all);
    }, [])

    useFocusEffect(
        useCallback(() => {
            loadEntries();
        }, [loadEntries])
    );

    function confirmDelete(id: number) {
        Alert.alert('Delete Entry', 'This cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await deleteEntry(id);
                    loadEntries();
                }
            }
        ])
    }

    return (
        <View style={styles.container}>
            <View style={styles.addButton}>
                <Button title="+ Add Entry" onPress={() => navigation.navigate('AddEntry')} />
            </View>
            {/* <Text>Home Screen</Text>
            <Button title="Add Entry" onPress={() => navigation.navigate('AddEntry')} /> */}
            {/* <Button title="View Sample Detail" onPress={() => navigation.navigate('Detail', {entryId: 1})} /> */}
            <FlatList
                data={entries}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.empty}>No entries yet. Add your first one!</Text>}
                renderItem={({ item }) => (
                    <Swipeable
                        renderRightActions={() => (
                            <TouchableOpacity
                                style={styles.deleteAction}
                                onPress={() => confirmDelete(item.id)}
                            >
                                <Text style={styles.deleteText}>Delete</Text>
                            </TouchableOpacity>
                        )}
                    >
                        <TouchableOpacity style={styles.card}
                            onPress={() => navigation.navigate('Detail', { entryId: item.id })}
                        >
                            <Text style={styles.note}>{item.note}</Text>
                            <Text style={styles.meta}>
                                {item.temperature}°C · {new Date(item.createdAt).toLocaleDateString()}
                            </Text>
                        </TouchableOpacity>
                    </Swipeable>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    addButton: { marginBottom: 12 },
    list: { paddingBottom: 24 },
    empty: { textAlign: 'center', marginTop: 40, color: '#888' },
    card: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
    },
    note: { fontSize: 16, marginBottom: 6 },
    meta: { fontSize: 12, color: '#666' },
    deleteAction: {
        backgroundColor: '#e74c3c',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        marginBottom: 12,
        borderRadius: 10,
    },
    deleteText: { color: '#fff', fontWeight: '600' },
});