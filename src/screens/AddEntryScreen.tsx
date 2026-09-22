import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from "react";
import { Button, Image, StyleSheet, Text, TextInput, View, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import { getCurrentCoordinates } from '@/services/location';
import { fetchWeather, WeatherData } from '@/services/weatherApi';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { insertEntry } from '@/db/databases';
import { HomeStackParamList } from '../../App';

type AddEntryNavProp = NativeStackNavigationProp<HomeStackParamList, 'AddEntry'>

export default function AddEntryScreen() {
    const navigation = useNavigation<AddEntryNavProp>();
    const [note, setNote] = useState('');
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [coords, setCoords] = useState<{ latitude: number, longitude: number } | null>(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [weatherError, setWeatherError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const location = await getCurrentCoordinates();
                setCoords(location);
                const weatherdata = await fetchWeather(location.latitude, location.longitude);
                setWeather(weatherdata);
            } catch (err) {
                setWeatherError('Could  not fetch location/weather');
            } finally {
                setWeatherLoading(false);
            }
        })();
    }, []);

    async function pickImage() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status != 'granted') {
            alert('Permission  to access photos is required');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.7,
        })

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri)
        }
    }

    async function handleSave() {
        if (!note.trim()) {
            Alert.alert('Empty note', 'Please write something before saving.')
            return;
        }
        if (!coords || !weather) {
            Alert.alert('Still loading', 'Please wait for location/weather to finish loading.')
            return;
        }
        setSaving(true);
        try {
            await insertEntry({
                note: note.trim(),
                photoUri,
                latitude: coords.latitude,
                longitude: coords.longitude,
                temperature: weather.temperature,
                weatherCode: weather.weatherCode,
                createdAt: new Date().toISOString(),
            });
            navigation.goBack();
        } catch (err) {
            Alert.alert('Error', 'Could not save entry Please try again');
        } finally {
            setSaving(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <View style={styles.weatherBox}>
                        {weatherLoading && (
                            <>
                                <ActivityIndicator />
                                <Text style={styles.weatherText}>Fetching your location and weather...</Text>
                            </>
                        )}
                        {!weatherLoading && weather && (
                            <Text style={styles.weatherText}>
                                {weather.temperature}°C · Weather code {weather.weatherCode}
                            </Text>
                        )}
                    </View>
                    <Text style={styles.label}>Your Note</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Whats on your mind?"
                        value={note}
                        onChangeText={setNote}
                        multiline
                    />

                    <Button title="Add Photo" onPress={pickImage} />

                    {photoUri && (
                        <Image source={{ uri: photoUri }} style={styles.preview} />
                    )}
                    <View style={styles.saveButton}>
                        <Button
                            title={saving ? 'Saving…' : 'Save Entry'}
                            onPress={handleSave}
                            disabled={saving || weatherLoading}
                        />
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    weatherBox: {
        backgroundColor: '#f0f4f8',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        alignItems: 'center',
    },
    weatherText: { marginTop: 4, fontSize: 14 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        minHeight: 120,
        textAlignVertical: 'top',
        fontSize: 16,
        marginBottom: 16,
    },
    preview: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginTop: 16,
    },
    saveButton: { marginTop: 24 },
});