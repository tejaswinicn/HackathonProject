import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface DeviceSettings {
  soundAlarm: boolean;
  smsAlerts: boolean;
  emergencyServices: boolean;
}

interface AlertSettingsProps {
  className?: string;
}

export default function AlertSettings({ className }: AlertSettingsProps) {
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState<DeviceSettings | null>(null);

  const { data: deviceSettings, isLoading } = useQuery<DeviceSettings>({
    queryKey: ["/api/device-settings"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/device-settings");
      return response.json();
    },
  });

  // Sync fetched settings to local state
  useEffect(() => {
    if (deviceSettings) {
      setLocalSettings(deviceSettings);
    }
  }, [deviceSettings]);

  const updateSettings = useMutation({
    mutationFn: async (settings: Partial<DeviceSettings>) => {
      const response = await apiRequest("PUT", "/api/device-settings", settings);
      if (response.status === 204) return settings;
      return response.json();
    },

    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: ["/api/device-settings"] });

      const previousSettings = queryClient.getQueryData<DeviceSettings>([
        "/api/device-settings",
      ]);

      // Optimistically update query cache
      queryClient.setQueryData<DeviceSettings>(["/api/device-settings"], (old = {
        soundAlarm: false,
        smsAlerts: false,
        emergencyServices: false,
      }) => ({
        ...old,
        ...newSettings,
      }));

      return { previousSettings };
    },

    onError: (_err, _newSettings, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(
          ["/api/device-settings"],
          context.previousSettings
        );
        setLocalSettings(context.previousSettings); // rollback local UI
      }

      toast({
        title: "Error",
        description: "Failed to update settings.",
        variant: "destructive",
      });
    },

    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Your alert settings have been updated.",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/device-settings"] });
    },
  });

  const handleToggle = (field: keyof DeviceSettings, value: boolean) => {
    if (!localSettings) return;

    const updatedSettings = { ...localSettings, [field]: value };
    setLocalSettings(updatedSettings);
    updateSettings.mutate({ [field]: value });
  };

  if (isLoading || !localSettings) {
    return (
      <div className="bg-dark rounded-lg shadow-md p-5 mb-6 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-md" />
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-r from-red-600 via-red-500 to-orange-400 text-white rounded-lg shadow-md p-5 mb-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Alert Settings
        </h2>
      </div>

      <div className="space-y-4">
        {/* Sound Alarm */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Sound Alarm</p>
            <p className="text-sm">Activate loud siren </p>
          </div>
          <Switch
            checked={localSettings.soundAlarm}
            onCheckedChange={(checked) => handleToggle("soundAlarm", checked)}
            id="soundAlarmToggle"
          />
        </div>

        {/* SMS Alerts */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">SMS Alerts</p>
            <p className="text-sm">Send emergency SMS notifications</p>
          </div>
          <Switch
            checked={localSettings.smsAlerts}
            onCheckedChange={(checked) => handleToggle("smsAlerts", checked)}
            id="smsAlertsToggle"
          />
        </div>

        {/* Emergency Services */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Emergency Services</p>
            <p className="text-sm">Notify emergency contacts automatically</p>
          </div>
          <Switch
            checked={localSettings.emergencyServices}
            onCheckedChange={(checked) =>
              handleToggle("emergencyServices", checked)
            }
            id="emergencyServicesToggle"
          />
        </div>
      </div>
    </div>
  );
}
