import { get } from "./api.js";

export async function getWeatherByCity(city) {
    const data = await get(`/api/weather?city=${encodeURIComponent(city)}`);

	// Return data in easier format
    return {
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
    };
}

export function getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
