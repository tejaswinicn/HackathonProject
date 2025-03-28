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
  const [videoURL, setVideoURL] = useState<string | null>(null);  // To store the recorded video URL
  const [audioURL, setAudioURL] = useState<string | null>(null);  // To store the recorded audio URL
  const videoRef = useRef<HTMLVideoElement | null>(null);  // To handle video playback
  const audioRef = useRef<HTMLAudioElement | null>(null);  // To handle audio playback
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);  // To handle media recording
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const { toast } = useToast();

  // Start recording audio and video when the modal opens
  useEffect(() => {
    const startRecording = async () => {
      try {
        // Request permission to access both the microphone and camera
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMediaStream(stream);

        // Setup MediaRecorder to record both audio and video
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const videoChunks: Blob[] = [];
        const audioChunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.type.includes("audio")) {
            audioChunks.push(event.data);
          } else if (event.data.type.includes("video")) {
            videoChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          // Create blobs for video and audio
          const videoBlob = new Blob(videoChunks, { type: "video/webm" });
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

          // Create URLs for the video and audio
          const videoURL = URL.createObjectURL(videoBlob);
          const audioURL = URL.createObjectURL(audioBlob);

          setVideoURL(videoURL);  // Set video URL
          setAudioURL(audioURL);  // Set audio URL
        };

        mediaRecorder.start();
        setIsRecording(true);

      } catch (error) {
        console.error("Error starting video and audio recording:", error);
        setIsRecording(false);
      }
    };

    startRecording();

    return () => {
      // Stop recording on cleanup
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());  // Stop the media tracks
      }
    };
  }, []);

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

  // Play or pause video
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

  // Play or pause audio
  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-lg lg:max-w-xl p-0 max-h-[80vh] overflow-y-auto bg-white shadow-lg rounded-lg z-50">
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
            {/* Video Playback */}
            {videoURL && (
              <div className="flex flex-col space-y-2">
                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-5 h-auto mt-4"
                  onClick={handlePlayVideo}
                >
                  Play Recorded Video
                </Button>
                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-5 h-auto mt-4"
                  onClick={handlePauseVideo}
                >
                  Pause Video Recording
                </Button>
                <video ref={videoRef} src={videoURL} controls width="100%" />
              </div>
            )}

            {/* Audio Playback */}
            {audioURL && (
              <div className="flex flex-col space-y-2">
                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-5 h-auto mt-4"
                  onClick={handlePlayAudio}
                >
                  {audioRef.current?.paused ? "Play Recorded Audio" : "Pause Audio"}
                </Button>
                <audio ref={audioRef} src={audioURL} controls />
              </div>
            )}

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
