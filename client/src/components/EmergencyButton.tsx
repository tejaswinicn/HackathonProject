import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { EmergencyModal } from "./EmergencyModal";
import { getCurrentDateTime } from "@/lib/mapUtils";

// 🔊 Function to play beep sound
const playBeep = () => {
  const beepSound = new Audio("/siren.mp3"); // Ensure "beep.mp3" is inside the "public" folder
  beepSound.play().catch((error) => console.error("Beep sound failed:", error));

  // Fallback: Web Audio API (if file doesn't exist)
  const ctx = new (window.AudioContext || window.AudioContext)();
  const oscillator = ctx.createOscillator();
  oscillator.type = "sine"; // Sound type
  oscillator.frequency.setValueAtTime(1000, ctx.currentTime); // 1000 Hz beep
  oscillator.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.2); // Beep for 0.2 seconds
};

interface EmergencyButtonProps {
  className?: string;
  deviceActive: boolean;
}

export default function EmergencyButton({ className, deviceActive }: EmergencyButtonProps) {
  const [holdTimer, setHoldTimer] = useState<number | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alertTime, setAlertTime] = useState("");
  const [alertId, setAlertId] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const createAlert = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/alerts", {});
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      setAlertId(data.id);
      setAlertTime(getCurrentDateTime());
      setShowModal(true);

      // 🔊 Play beep when alert is activated
      playBeep();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to activate emergency alert",
        variant: "destructive",
      });
    },
  });

  const cancelAlert = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PUT", `/api/alerts/${id}/deactivate`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      setShowModal(false);
      setAlertId(null);
      toast({
        title: "Alert Canceled",
        description: "The emergency alert has been canceled.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to cancel alert",
        variant: "destructive",
      });
    },
  });

  const startHold = () => {
    if (!deviceActive) {
      toast({
        title: "Badge Inactive",
        description:
          "The safety is currently inactive. Please activate it to use the emergency feature.",
        variant: "destructive",
      });
      return;
    }

    setIsHolding(true);
    const startTime = Date.now();

    // 🔊 Play beep on button press
    playBeep();

    timerRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      setHoldTimer(elapsedTime);

      if (elapsedTime >= 3000) {
        if (timerRef.current) clearInterval(timerRef.current);
        createAlert.mutate();
        setIsHolding(false);
        setHoldTimer(null);
      }
    }, 100);
  };

  const endHold = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsHolding(false);
    setHoldTimer(null);
  };

  const handleCancelAlert = () => {
    if (alertId !== null) {
      cancelAlert.mutate(alertId);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const holdProgress = holdTimer ? Math.min(holdTimer / 3000, 1) : 0;

  // Dynamically set the background color based on holdProgress
  const backgroundColor = `linear-gradient(to top, rgba(255, 0, 0, ${1 - holdProgress}) 0%, rgba(255, 165, 0, ${holdProgress}) 100%)`;

  return (
    <>
      <div className={`text-center mb-8 ${className}`}>
        <p className="text-neutral-600 mb-2">
          Press and hold for 3 seconds to activate emergency alert
        </p>
        <button
          id="emergencyButton"
          className={`emergency-button text-white rounded-full w-40 h-40 flex items-center justify-center shadow-lg mx-auto focus:outline-none relative overflow-hidden ${
            isHolding ? "pulse" : ""
          }`}
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          style={{ background: backgroundColor }}
        >
          {holdTimer && (
            <div
              className="absolute bottom-0 left-0 opacity-50 h-full"
              style={{ width: `${holdProgress * 100}%`, background: 'rgba(255, 165, 0, 0.6)' }}
            />
          )}
          <div className="text-center relative z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 mx-auto"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 19V10c0-4.2 3.5-7.5 7.5-7.5S21 5.8 21 10v9M6 19h15M12 19v4"></path>
              <path d="M12 13V3"></path>
            </svg>
            <p className="font-bold mt-2">EMERGENCY</p>
          </div>
        </button>
      </div>

      {showModal && (
        <EmergencyModal
          onClose={handleCloseModal}
          onCancel={handleCancelAlert}
          alertTime={alertTime}
        />
      )}
    </>
  );
}
