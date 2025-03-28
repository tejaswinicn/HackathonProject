import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export default function LocationTracker() {
  const [location, setLocation] = useState<Location | null>(null);

  // Fetch location and reverse geocode
  const fetchLocation = async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Fetch address using OpenStreetMap (Nominatim API)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        const address = data.display_name || "Unknown Location";

        setLocation({ latitude, longitude, address });
      },
      (error) => console.error("Error getting location:", error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    fetchLocation();
    const interval = setInterval(fetchLocation, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (!location) {
    return <p className="text-white">Fetching location...</p>;
  }

  // Calculate progress based on some factor (e.g., time or location data)
  const progress = 0.7; // Example static progress value; you can update this dynamically

  // Gradient color from red to orange
  const gradientColor = `linear-gradient(to right, #ff0000 ${progress * 100}%, #ffa500 ${progress * 100}%)`;

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6" style={{ background: gradientColor }}>
      <h2 className="text-lg font-semibold text-white">Current Location</h2>
      <p className="text-sm text-white">{location.address}</p>

      {/* Map Display */}
      <MapContainer center={[location.latitude, location.longitude]} zoom={15} className="h-64 w-full mt-4 rounded-md">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[location.latitude, location.longitude]} icon={L.icon({ iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png", iconSize: [25, 41] })}>
          <Popup>{location.address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
