import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { simulateBatteryDrain } from "@/lib/mapUtils";

interface DeviceStatusProps {
  className?: string;
}

interface DeviceSettings {
  isActive?: boolean;
  batteryLevel?: number;
}

export default function DeviceStatus({ className }: DeviceStatusProps) {
  const { data: deviceSettings, isLoading } = useQuery<{ data: DeviceSettings }>({
    queryKey: ['/api/device-settings'],
  });

  const updateSettings = useMutation({
    mutationFn: async (settings: any) => {
      const response = await apiRequest('PUT', '/api/device-settings', settings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/device-settings'] });
    }
  });

  const updateBattery = useMutation({
    mutationFn: async (batteryLevel: number) => {
      const response = await apiRequest('PUT', '/api/device-settings/battery', { batteryLevel });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/device-settings'] });
    }
  });

  useEffect(() => {
    if (deviceSettings?.data?.isActive && deviceSettings?.data?.batteryLevel !== undefined && deviceSettings?.data?.batteryLevel > 0) {
      const cleanup = simulateBatteryDrain(deviceSettings.data.batteryLevel, (newLevel) => {
        updateBattery.mutate(newLevel);
      });

      return cleanup;
    }
  }, [deviceSettings?.data?.isActive, deviceSettings?.data?.batteryLevel]);

  const handleDeviceToggle = (checked: boolean) => {
    updateSettings.mutate({ isActive: checked });
  };

  const handleBatteryLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBatteryLevel = parseInt(event.target.value, 10);
    updateBattery.mutate(newBatteryLevel);
  };

  if (isLoading) {
    return (
      <div className="badge-device bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-lg shadow-md p-5 mb-6 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-md"></div>
      </div>
    );
  }

  const batteryLevel = deviceSettings?.data?.batteryLevel || 0; // Default to 0 if undefined

  const batteryColor = batteryLevel < 20
    ? "bg-danger"
    : batteryLevel < 50
      ? "bg-warning"
      : "bg-success";

  return (
    <div className={`badge-device bg-gradient-to-r from-red-500 via-red-600 to-orange-500 rounded-lg shadow-md p-5 mb-6 ${className}`}>
      <div className={`badge-status-light ${deviceSettings?.data?.isActive ? 'bg-success' : 'bg-neutral-400'}`}></div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Battery Status</h2> {/* Applied text-white */}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="range"
            min="0"
            max="100"
            value={deviceSettings?.batteryLevel || 0}
            onChange={handleBatteryLevelChange}
            className="w-full"
          />
          <p className="text-sm font-medium text-white">{deviceSettings?.batteryLevel || 0}%</p> {/* Applied text-white */}
        </div>
      </div>
    </div>
  );
}
