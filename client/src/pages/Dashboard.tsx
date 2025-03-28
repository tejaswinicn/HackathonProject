import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import DeviceStatus from "@/components/DeviceStatus";
import EmergencyButton from "@/components/EmergencyButton";
import LocationTracker from "@/components/LocationTracker";
import EmergencyContacts from "@/components/EmergencyContacts";
import AlertSettings from "@/components/AlertSettings";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: deviceSettings, isLoading } = useQuery({
    queryKey: ['/api/device-settings'],
  });

  return (
    <>
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6">
        {isLoading ? (
          <>
            <Skeleton className="h-40 w-full mb-6" />
            <Skeleton className="h-40 w-full mb-6" />
            <Skeleton className="h-60 w-full mb-6" />
            <Skeleton className="h-40 w-full mb-6" />
            <Skeleton className="h-40 w-full mb-6" />
          </>
        ) : (
          <>
            <DeviceStatus />
            
            <EmergencyButton deviceActive={deviceSettings?.isActive || false} />
            
            <LocationTracker />
            
            <EmergencyContacts />
            
            <AlertSettings />
          </>
        )}
      </main>
      
      <AppFooter />
    </>
  );
}
