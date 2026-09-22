export interface WeatherData{
    temperature: number;
    weatherCode:number;
}

export async function fetchWeather(latitude: number, longitude: number): Promise<WeatherData> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;
    const response = await fetch(url);
    const data = await response.json();

    return {
        temperature: data.current.temperature_2m,
        weatherCode: data.current.weather_code,
    };
}