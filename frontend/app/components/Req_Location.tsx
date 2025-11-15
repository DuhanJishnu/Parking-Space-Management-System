import { useEffect } from "react";

interface RequestLocationProps {
  setCoords: (coords: { lat: number; lng: number }) => void;
}
function RequestLocation({ setCoords }: RequestLocationProps) {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("📍 Coords:", coords);
          setCoords(coords);
        },
        (error) => {
          console.error("Error getting location:", error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert("Permission denied. Please allow location access.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information unavailable.");
              break;
            case error.TIMEOUT:
              alert("Location request timed out.");
              break;
            default:
              alert("An unknown error occurred.");
          }
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, [setCoords]);

  return null;
}

export default RequestLocation;
