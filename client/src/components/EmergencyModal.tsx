import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface EmergencyModalProps {
  onClose: () => void;
  onCancel: () => void;
  alertTime: string;
}

export function EmergencyModal({ onClose, onCancel, alertTime }: EmergencyModalProps) {
  const [isCalling, setIsCalling] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Fetching location...");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingURL, setRecordingURL] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const { toast } = useToast();

  // Start recording video & audio when modal opens
  useEffect(() => {
    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMediaStream(stream);

        const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp9,opus" });
        mediaRecorderRef.current = mediaRecorder;

        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const recordedBlob = new Blob(chunks, { type: "video/webm" });
          const recordedURL = URL.createObjectURL(recordedBlob);
          setRecordingURL(recordedURL);
          setIsRecording(false);
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error starting recording:", error);
        setIsRecording(false);
      }
    };

    startRecording();

    return () => {
      stopRecording(); // Ensure cleanup on unmount
    };
  }, []);

  // Stop recording manually
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
  };

  // Fetch current location
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
            setCurrentLocation(data.display_name || `Lat: ${latitude}, Lng: ${longitude}`);
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

  // Play video recording
  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handlePauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Download video recording
  const handleDownloadVideo = () => {
    if (recordingURL) {
      const a = document.createElement("a");
      a.href = recordingURL;
      a.download = "emergency_recording.webm"; // File name for saving
      a.click();
    }
  };

  // Background gradient from red to orange
  const backgroundStyle = {
    background: 'linear-gradient(to right, #ff0000, #ffa500)',  // Red to Orange gradient
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-lg lg:max-w-xl p-0 max-h-[80vh] overflow-y-auto shadow-lg rounded-lg z-50" style={backgroundStyle}>
        <div className="bg-primary px-6 py-4 rounded-t-lg flex justify-between items-center">
          <DialogTitle className="text-xl font-bold text-white">Safety Badge Alert Active</DialogTitle>
        </div>

        <div className="p-6 text-white">
          <DialogDescription className="text-center mb-4">
            <p className="font-medium">Badge alarm active - 95dB siren is sounding</p>
            <p className="text-sm">Location has been stored on badge</p>
          </DialogDescription>

          <div className="bg-neutral-100 rounded-lg p-4 mb-4">
            <div className="mb-2">
              <p className="text-sm">Current Location</p>
              <p className="font-medium">{currentLocation}</p>
            </div>
            <div>
              <p className="text-sm">Alert Time</p>
              <p className="font-medium">{alertTime}</p>
            </div>
            <div className="mt-2 pt-2 border-t border-neutral-200">
              <p className="text-sm">Badge Status</p>
              <p className="text-sm">
                <span className="inline-block w-2 h-2 bg-primary rounded-full mr-1"></span> Audio recording active
              </p>
              <p className="text-sm">
                <span className="inline-block w-2 h-2 bg-primary rounded-full mr-1"></span> LED lights flashing
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            {/* Video Playback */}
            {recordingURL && (
              <div className="flex flex-col space-y-2">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-5 h-auto mt-4" onClick={handlePlayVideo}>
                  Play Recorded Video
                </Button>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-5 h-auto mt-4" onClick={handlePauseVideo}>
                  Pause Video Recording
                </Button>
                <video ref={videoRef} src={recordingURL} controls width="100%" />

                {/* 📥 Download Video Button */}
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-5 h-auto mt-4" onClick={handleDownloadVideo}>
                  Download Video Recording
                </Button>
              </div>
            )}

            {/* ⏹️ Stop Recording Button */}
            {isRecording && (
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white py-5 h-auto" onClick={stopRecording}>
                Stop Recording
              </Button>
            )}

            <Button className="w-full bg-secondary hover:bg-secondary/90 text-white py-5 h-auto" onClick={handleCallEmergencyServices} disabled={isCalling}>
              {isCalling ? "Activating..." : "Activate High-Intensity Alarm"}
            </Button>
            <Button variant="outline" className="w-full bg-neutral-200 text-neutral-700 hover:bg-neutral-300 border-none py-5 h-auto" onClick={onCancel}>
              Cancel Badge Alert
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

