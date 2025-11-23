// src/demo/MapDemo.jsx
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '../lib/leafletConfig';  // Fix marker icons
import 'leaflet/dist/leaflet.css';
import MapUpdater from '../lib/MapUpdater';


const demoLocations = [
    { name: 'Paris', lat: 48.8566, lon: 2.3522, description: 'City of Light' },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503, description: 'Capital of Japan' },
    { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, description: 'City of Angels' },
];

export default function MapDemo() {
    const [selectedCity, setSelectedCity] = useState(0);
    const currentLocation = demoLocations[selectedCity];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1>Map Integration Demo</h1>

            <div className="flex gap-4 mb-4">
                {demoLocations.map((city, index) => (
                    <button
                        key={city.name}
                        onClick={() => setSelectedCity(index)}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                        {city.name}
                    </button>
                ))}
            </div>

            <MapContainer
                center={[currentLocation.lat, currentLocation.lon]}
                zoom={13}
                style={{ height: '400px', width: '100%' }}
                className="rounded-lg shadow-lg"
            >
                <MapUpdater center={[currentLocation.lat, currentLocation.lon]} zoom={13} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={[currentLocation.lat, currentLocation.lon]}>
                    <Popup>
                        <div>
                            <h3>{currentLocation.name}</h3>
                            <p>{currentLocation.description}</p>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
