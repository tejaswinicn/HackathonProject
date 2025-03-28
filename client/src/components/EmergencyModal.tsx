import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface EmergencyModalProps {
  onClose: () => void;
  onCancel: () => void;
  alertTime: string;
}

export function EmergencyModal({ onClose, onCancel, alertTime }: EmergencyModalProps) {
  const [isCalling, setIsCalling] = useState(false);
  const { toast } = useToast();
  
  const { data: deviceSettings } = useQuery({
    queryKey: ['/api/device-settings'],
  });

  const handleCallEmergencyServices = () => {
    setIsCalling(true);
    // Simulate a call to emergency services
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
      <DialogContent className="max-w-md p-0">
        <div className="bg-primary px-6 py-4 rounded-t-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex justify-between items-center">
              <span>Safety Badge Alert Active</span>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-5 h-5"
                >
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
                <span className="sr-only">Close</span>
              </Button>
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="p-6">
          <div className="text-center mb-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-10 h-10 text-primary pulse"
              >
                <path d="M6 19V10c0-4.2 3.5-7.5 7.5-7.5S21 5.8 21 10v9"/>
                <path d="M6 19h15"/>
                <path d="M12 19v4"/>
                <path d="M12 13V3"/>
              </svg>
            </div>
            <DialogDescription className="text-center">
              <p className="text-neutral-800 font-medium mb-2">Badge alarm active - 95dB siren is sounding</p>
              <p className="text-neutral-600 text-sm mb-4">Location has been stored on badge</p>
            </DialogDescription>
          </div>
          
          <div className="bg-neutral-100 rounded-lg p-4 mb-4">
            <div className="mb-2">
              <p className="text-sm text-neutral-500">Current Location</p>
              <p className="font-medium text-neutral-800" id="emergencyLocation">
                {deviceSettings?.lastLocation?.address || 'Unknown location'}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Alert Time</p>
              <p className="font-medium text-neutral-800" id="emergencyTime">
                {alertTime}
              </p>
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
              id="callEmergencyServices"
            >
              {isCalling ? (
                <>
                  <svg 
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Activating...
                </>
              ) : (
                <>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-5 h-5 mr-2"
                  >
                    <path d="M10.827 16.379a6.547 6.547 0 0 1-1.452 1.413l-2.39 1.795c-.63.473-1.45.626-2.214.408l-2.075-.593C1.695 19.122 1 18.171 1 17.093V14.5c0-2.484.828-4.906 2.352-6.879L5 5.5" />
                    <path d="M15.031 16.864c-.616.03-1.206-.28-1.591-.76l-2.5-3.112C10.38 12.28 10 11.38 10 10.432V2.5A1.5 1.5 0 0 1 11.5 1h1C13.328 1 14 1.672 14 2.5V3l2.405.8a4 4 0 0 1 2.478 2.917l1.166 4.838a2 2 0 0 1-1.75 2.418" />
                  </svg>
                  Activate High-Intensity Alarm
                </>
              )}
            </Button>
            <Button 
              variant="outline"
              className="w-full bg-neutral-200 text-neutral-700 hover:bg-neutral-300 border-none py-5 h-auto"
              onClick={onCancel}
              id="cancelEmergencyAlert"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5 mr-2"
              >
                <circle cx="12" cy="12" r="10"/>
                <path d="m15 9-6 6"/>
                <path d="m9 9 6 6"/>
              </svg>
              Cancel Badge Alert
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
