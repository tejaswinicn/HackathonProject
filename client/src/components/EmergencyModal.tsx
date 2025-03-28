import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface EmergencyModalProps {
  onClose: () => void;
  onCancel: () => void;
  alertTime: string;
}

export function EmergencyModal({ onClose, onCancel, alertTime }: EmergencyModalProps) {
  const [isCalling, setIsCalling] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Fetching location...");
  const { toast } = useToast();

  // Fetch device settings
  const { data: deviceSettings } = useQuery({
    queryKey: ["/api/device-settings"],
  });

  // Fetch live location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const locationName = data.display_name || `Lat: ${latitude}, Lng: ${longitude}`;
            setCurrentLocation(locationName);
          } catch (error) {
            console.error("Error fetching location:", error);
            setCurrentLocation("Unable to fetch location.");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setCurrentLocation("Location access denied.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  const handleCallEmergencyServices = () => {
    setIsCalling(true);
    setTimeout(() => {
      setIsCalling(false);
      toast({
        title: "Badge Simulation",
        description: "In a real badge, this would trigger the badge's audio recording and high-intensity alarm.",
      });
    }, 2000);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-lg lg:max-w-xl p-0 max-h-[80vh] overflow-y-auto bg-white shadow-lg rounded-lg z-50">
        {/* Header with Close Button */}
        <div className="bg-primary px-6 py-4 rounded-t-lg flex justify-between items-center">
          <DialogTitle className="text-xl font-bold text-white">Safety Badge Alert Active</DialogTitle>
        </div>

        <div className="p-6">
          <DialogDescription className="text-center mb-4">
            <p className="text-neutral-800 font-medium">Badge alarm active - 95dB siren is sounding</p>
            <p className="text-neutral-600 text-sm">Location has been stored on badge</p>
          </DialogDescription>

          <div className="bg-neutral-100 rounded-lg p-4 mb-4">
            <div className="mb-2">
              <p className="text-sm text-neutral-500">Current Location</p>
              <p className="font-medium text-neutral-800">{currentLocation}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Alert Time</p>
              <p className="font-medium text-neutral-800">{alertTime}</p>
            </div>
            <div className="mt-2 pt-2 border-t border-neutral-200">
              <p className="text-sm text-neutral-500">Badge Status</p>
              <p className="text-sm text-neutral-800">
                <span className="inline-block w-2 h-2 bg-primary rounded-full mr-1"></span> Audio recording active
              </p>
              <p className="text-sm text-neutral-800">
                <span className="inline-block w-2 h-2 bg-primary rounded-full mr-1"></span> LED lights flashing
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <Button 
              className="w-full bg-secondary hover:bg-secondary/90 text-white py-5 h-auto"
              onClick={handleCallEmergencyServices}
              disabled={isCalling}
            >
              {isCalling ? "Activating..." : "Activate High-Intensity Alarm"}
            </Button>
            <Button 
              variant="outline"
              className="w-full bg-neutral-200 text-neutral-700 hover:bg-neutral-300 border-none py-5 h-auto"
              onClick={onCancel}
            >
              Cancel Badge Alert
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
