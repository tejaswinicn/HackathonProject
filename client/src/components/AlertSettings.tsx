import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AlertSettingsProps {
  className?: string;
}

export default function AlertSettings({ className }: AlertSettingsProps) {
  const { data: deviceSettings, isLoading } = useQuery({
    queryKey: ['/api/device-settings'],
  });

  const { toast } = useToast();

  const updateSettings = useMutation({
    mutationFn: async (settings: any) => {
      const response = await apiRequest('PUT', '/api/device-settings', settings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/device-settings'] });
      toast({
        title: "Settings updated",
        description: "Your badge alert settings have been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update settings",
        variant: "destructive"
      });
    }
  });

  const handleSmsAlertsToggle = (checked: boolean) => {
    updateSettings.mutate({ smsAlerts: checked });
  };

  const handleEmergencyServicesToggle = (checked: boolean) => {
    updateSettings.mutate({ emergencyServices: checked });
  };

  const handleSoundAlarmToggle = (checked: boolean) => {
    updateSettings.mutate({ soundAlarm: checked });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-5 mb-6 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-md"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-5 mb-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">Badge Alert Settings</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-neutral-700">Sound Alarm</p>
            <p className="text-sm text-neutral-500">Activate loud siren on badge</p>
          </div>
          <Switch 
            checked={deviceSettings?.soundAlarm || false} 
            onCheckedChange={handleSoundAlarmToggle}
            id="soundAlarmToggle"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-neutral-700">Audio Recording</p>
            <p className="text-sm text-neutral-500">Record audio during emergency</p>
          </div>
          <Switch 
            checked={deviceSettings?.smsAlerts || false} 
            onCheckedChange={handleSmsAlertsToggle}
            id="audioRecordingToggle"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-neutral-700">Vibration Feedback</p>
            <p className="text-sm text-neutral-500">Silent vibration during alert</p>
          </div>
          <Switch 
            checked={deviceSettings?.emergencyServices || false} 
            onCheckedChange={handleEmergencyServicesToggle}
            id="vibrationToggle"
          />
        </div>
      </div>
    </div>
  );
}
