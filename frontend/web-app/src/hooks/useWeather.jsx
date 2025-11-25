import { useState, useEffect } from "react";
import { getWeatherByCity } from "../services/weatherService.js";

export function useWeather(city) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWeather = async () => {
        if (!city) return;

        setLoading(true);
        setError(null);

        try {
            const data = await getWeatherByCity(city);
            setWeather(data);
        } catch (err) {
            setError(err.message || "Failed to fetch weather");
            setWeather(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, [city]);

    return {
        weather,
        loading,
        error,
    };
}
