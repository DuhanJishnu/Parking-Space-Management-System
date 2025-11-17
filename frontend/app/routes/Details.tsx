import { getAvailableSpaces } from "../api/parkingSpaces/getAvailableSpaces";
import { useParams, useNavigate } from "react-router";
import { useState, useEffect, useContext } from "react";
import logo from "../assets/logo.jpeg";
import RequestLocation from "~/components/Req_Location";
import FindingScreen from "~/components/Find_Screen";
import { UserContext } from "../context/User";

export default function Details() {
  const { v_type } = useParams<{ v_type: string }>();
  const navigate = useNavigate();

  const [vehicleNumber, setVehicleNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [positionCoords, setPositionCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [startLocationRequest, setStartLocationRequest] = useState(false);

  useEffect(() => {
    if (positionCoords) {
      console.log("UPDATED positionCoords:", positionCoords);
    }
  }, [positionCoords]);

  const { user } = useContext(UserContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStartLocationRequest(true);
  };

  const handleCoordsReceived = (coords: { lat: number; lng: number }) => {
    setPositionCoords(coords);
    setLoading(true);

    console.log(
      "User : ",
      user,
      "\n vehicle number : ",
      vehicleNumber,
      "/n coords : ",
      coords
    );

   



  const handleCoordsReceived = async (coords: { lat: number; lng: number }) => {
    setPositionCoords(coords);
    setLoading(true);

    console.log(
      "User : ",
      user,
      "\n vehicle number : ",
      vehicleNumber,
      "/n coords : ",
      coords
    );

    try {
      const availableSpaces = await getAvailableSpaces(coords.lat, coords.lng, v_type as string);
      setLoading(false);
      navigate("/available", {
        state: {
          coords,
          vehicleNumber,
          availableSpaces,
        },
      });
    } catch (error) {
      console.error("Failed to get available spaces:", error);
      setLoading(false);
      // Handle error appropriately, e.g., show an error message
    }
  };




  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#111827] to-[#1f2937] text-white font-[Baloo Bhai 2] px-6 py-8">
      
    </div>  
  );
}
}
