import { useEffect, useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { DEFAULT_LOCATION, generateStreetGrid } from "@/lib/mapUtils";

interface LocationTrackerProps {
  className?: string;
}

export default function LocationTracker({ className }: LocationTrackerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { data: deviceSettings, isLoading } = useQuery({
    queryKey: ['/api/device-settings'],
  });

  const updateLocationSharing = useMutation({
    mutationFn: async (locationSharing: boolean) => {
      const response = await apiRequest('PUT', '/api/device-settings', { locationSharing });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/device-settings'] });
    }
  });

  const updateLocation = useMutation({
    mutationFn: async (location: { latitude: number, longitude: number, address: string }) => {
      const response = await apiRequest('PUT', '/api/device-settings/location', location);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/device-settings'] });
    }
  });

  useEffect(() => {
    if (mapRef.current) {
      // Initial map simulation
      generateStreetGrid(mapRef.current);

      // Simulate location updates
      const interval = setInterval(() => {
        if (deviceSettings?.isActive && deviceSettings?.locationSharing) {
          const randomOffset = () => (Math.random() - 0.5) * 0.01;
          const currentLocation = deviceSettings.lastLocation || DEFAULT_LOCATION;
          
          const newLocation = {
            latitude: currentLocation.latitude + randomOffset(),
            longitude: currentLocation.longitude + randomOffset(),
            address: "350 5th Ave, New York, NY 10118" // Empire State Building address
          };
          
          updateLocation.mutate(newLocation);
        }
      }, 30000); // Update every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [deviceSettings?.isActive, deviceSettings?.locationSharing]);

  const handleLocationSharingToggle = (checked: boolean) => {
    updateLocationSharing.mutate(checked);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-5 mb-6 animate-pulse">
        <div className="h-64 bg-gray-200 rounded-md"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-5 mb-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">Badge Location</h2>
        <div className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={`w-5 h-5 mr-1 ${deviceSettings?.locationSharing ? 'text-secondary' : 'text-neutral-500'}`}
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span 
            className={`text-sm font-medium ${deviceSettings?.locationSharing ? 'text-secondary' : 'text-neutral-500'}`}
            id="trackingStatus"
          >
            {deviceSettings?.locationSharing ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="bg-neutral-100 p-3 rounded-lg mb-4">
        <h3 className="text-sm font-semibold mb-2">Badge GPS Functionality</h3>
        <p className="text-xs text-neutral-600 mb-2">• Built-in GPS module with local storage of location history</p>
        <p className="text-xs text-neutral-600 mb-2">• Offline location tracking with data stored on badge</p>
        <p className="text-xs text-neutral-600 mb-2">• Location data synchronized during docking/charging</p>
        <p className="text-xs text-neutral-600">• Geofencing capability for defined safe zones</p>
      </div>
      
      <div 
        id="map" 
        ref={mapRef}
        className="mb-4 h-[240px] w-full bg-neutral-200 rounded-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-200" id="mapPlaceholder">
          <div className="text-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-12 h-12 mx-auto text-neutral-400"
            >
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
              <line x1="9" x2="9" y1="3" y2="18"/>
              <line x1="15" x2="15" y1="6" y2="21"/>
            </svg>
            <p className="text-neutral-500 mt-2">Map loading...</p>
          </div>
        </div>
      </div>
      
      <div>
        <p className="text-neutral-600 mb-1 text-sm">Current Location</p>
        <div className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-5 h-5 mr-2 text-neutral-500"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <p className="text-sm font-medium text-neutral-700" id="currentLocation">
            {deviceSettings?.lastLocation?.address || 'Unknown location'}
          </p>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-neutral-600 text-sm">Store Location History</p>
          <Switch 
            checked={deviceSettings?.locationSharing || false} 
            onCheckedChange={handleLocationSharingToggle}
            id="locationSharingToggle"
          />
        </div>
      </div>
    </div>
  );
}
