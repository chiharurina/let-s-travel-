import { useState } from "react";
import { useWeather } from "../hooks/useWeather.jsx";
import { getWeatherIconUrl } from "../services/weatherService.js";

export default function WeatherDemo() {
    const [city, setCity] = useState("Pomona");
    const [inputValue, setInputValue] = useState("");
    const { weather, loading, error } = useWeather(city);

    const handleSearch = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            setCity(inputValue.trim());
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-blue-300 rounded-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                OpenWeather API Demo
            </h2>

            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter city name..."
                        className="px-4 py-2 border-none rounded-lg bg-white"
                    />
                    <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                        Search
                    </button>
                </div>
            </form>

            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white border-t-blue-500"></div>
                    <p className="mt-2 text-gray-600">Loading weather...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            {weather && !loading && (
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <h3 className="text-3xl font-bold text-gray-800">
                            {weather.city}
                        </h3>
                        <span className="text-2xl text-gray-500">
                            {weather.country}
                        </span>
                    </div>

                    <img
                        src={getWeatherIconUrl(weather.icon)}
                        alt={weather.description}
                        className="mx-auto w-24 h-24"
                    />

                    <p className="text-5xl font-bold text-gray-800 mb-2">
                        {weather.temperature}°F
                    </p>

                    <p className="text-gray-600 mb-4 capitalize">
                        {weather.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-gray-500">Feels Like</p>
                            <p className="text-lg font-semibold">
                                {weather.feelsLike}°C
                            </p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-gray-500">Humidity</p>
                            <p className="text-lg font-semibold">
                                {weather.humidity}%
                            </p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                            <p className="text-gray-500">Wind Speed</p>
                            <p className="text-lg font-semibold">
                                {weather.windSpeed} mph
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
