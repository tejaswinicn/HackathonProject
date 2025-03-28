import type { Location } from "@shared/schema";

// Default location (New York)
export const DEFAULT_LOCATION: Location = {
  latitude: 40.7128,
  longitude: -74.0060,
  address: "New York, NY, USA"
};

// Generate a simulated street grid for the map placeholder
export function generateStreetGrid(mapElement: HTMLDivElement): void {
  // Remove any existing content
  mapElement.innerHTML = '';
  mapElement.style.backgroundColor = '#cfd8dc';

  // Function to place the user marker
  function placeUserMarker(latitude: number, longitude: number) {
    const userMarker = document.createElement('div');
    userMarker.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="36" height="36" class="text-primary">
        <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75 0 5.385 4.365 9.75 9.75 9.75s9.75-4.365 9.75-9.75c0-5.385-4.365-9.75-9.75-9.75zM9 10.5a3 3 0 106 0 3 3 0 00-6 0zm8.25-3a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75z" clip-rule="evenodd" />
      </svg>
    `;
    userMarker.style.position = 'absolute';
    userMarker.style.top = '50%';
    userMarker.style.left = '50%';
    userMarker.style.transform = 'translate(-50%, -50%)';
    mapElement.appendChild(userMarker);

    console.log(`User location set: ${latitude}, ${longitude}`);
  }

  // Get current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        placeUserMarker(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error:", error);
        placeUserMarker(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude); // Fallback if location fails
      }
    );
  } else {
    console.error("Geolocation is not supported.");
    placeUserMarker(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
  }

  // Create horizontal streets
  for (let i = 0; i < 5; i++) {
    const street = document.createElement('div');
    street.style.position = 'absolute';
    street.style.height = '2px';
    street.style.width = '60%';
    street.style.backgroundColor = '#ffffff';
    street.style.top = `${20 + i * 15}%`;
    street.style.left = '20%';
    mapElement.appendChild(street);
  }

  // Create vertical streets
  for (let i = 0; i < 3; i++) {
    const street = document.createElement('div');
    street.style.position = 'absolute';
    street.style.width = '2px';
    street.style.height = '60%';
    street.style.backgroundColor = '#ffffff';
    street.style.left = `${30 + i * 20}%`;
    street.style.top = '20%';
    mapElement.appendChild(street);
  }
}


// Simulate decreasing battery level
export function simulateBatteryDrain(
  initialLevel: number,
  callback: (newLevel: number) => void
): () => void {
  const interval = setInterval(() => {
    const newLevel = Math.max(0, initialLevel - 1);
    callback(newLevel);
  }, 60000); // Every minute
  
  return () => clearInterval(interval);
}

// Get formatted current date and time
export function getCurrentDateTime(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  return now.toLocaleDateString('en-US', options);
}
