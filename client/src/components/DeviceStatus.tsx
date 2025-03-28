import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { simulateBatteryDrain } from "@/lib/mapUtils";

interface DeviceStatusProps {
  className?: string;
}

export default function DeviceStatus({ className }: DeviceStatusProps) {
  const { data: deviceSettings, isLoading } = useQuery({
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
    if (deviceSettings?.isActive && deviceSettings?.batteryLevel > 0) {
      const cleanup = simulateBatteryDrain(deviceSettings.batteryLevel, (newLevel) => {
        updateBattery.mutate(newLevel);
      });
      
      return cleanup;
    }
  }, [deviceSettings?.isActive, deviceSettings?.batteryLevel]);

  const handleDeviceToggle = (checked: boolean) => {
    updateSettings.mutate({ isActive: checked });
  };

  if (isLoading) {
    return (
      <div className="badge-device bg-white rounded-lg shadow-md p-5 mb-6 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-md"></div>
      </div>
    );
  }

  const batteryColor = deviceSettings?.batteryLevel < 20 
    ? "bg-danger" 
    : deviceSettings?.batteryLevel < 50 
      ? "bg-warning" 
      : "bg-success";

  return (
    <div className={`badge-device bg-white rounded-lg shadow-md p-5 mb-6 ${className}`}>
      <div className={`badge-status-light ${deviceSettings?.isActive ? 'bg-success' : 'bg-neutral-400'}`}></div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">Badge Status</h2>
        <div className="flex items-center">
          <span className={`material-icons mr-1 ${deviceSettings?.isActive ? 'text-success' : 'text-neutral-500'}`}>
            {deviceSettings?.isActive ? 'power' : 'power_off'}
          </span>
          <span className={`text-sm font-medium ${deviceSettings?.isActive ? 'text-success' : 'text-neutral-500'}`}>
            {deviceSettings?.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-neutral-600 mb-1 text-sm">Battery Level</p>
          <div className="w-full bg-neutral-200 rounded-full h-2.5 mb-4">
            <div className={`${batteryColor} h-2.5 rounded-full`} style={{ width: `${deviceSettings?.batteryLevel || 0}%` }}></div>
          </div>
          <p className="text-sm font-medium text-neutral-700">{deviceSettings?.batteryLevel || 0}%</p>
        </div>
        
        <div>
          <p className="text-neutral-600 mb-1 text-sm">Badge Mode</p>
          <div className="flex items-center">
            <span className="text-sm font-medium text-neutral-700 mr-2">Active</span>
            <Switch 
              checked={deviceSettings?.isActive || false} 
              onCheckedChange={handleDeviceToggle}
              id="deviceToggle"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
