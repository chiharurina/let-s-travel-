async function getWeather(req, res) {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({
            error: 'City parameter is required',
        });
    }

    if (!process.env.WEATHER_API_KEY) {
        return res.status(500).json({
            error: 'Weather API key not configured',
        });
    }

    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            city
        )}&appid=${process.env.WEATHER_API_KEY}&units=imperial`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return res.status(response.status).json({
                error: errorData.message || 'Failed to fetch weather data',
                details: errorData,
            });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Weather API error:', error);
        res.status(500).json({
            error: 'Internal server error while fetching weather',
        });
    }
}

module.exports = {
    getWeather,
};
