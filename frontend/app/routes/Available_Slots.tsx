import React, { useEffect } from "react";
import PLotCards from "~/components/P_Lot_Cards";
import { useNavigate, useLocation } from "react-router";
import { ArrowLeft } from "lucide-react";

interface CardProps {
  area: string;
  vehicleType: "Car" | "Bike";
  available: number;
  total: number;
}

export default function Available_Slots() {

    const location = useLocation();
    const { coords, vehicleNumber, availableSpaces } = location.state || {};

  useEffect(() => {
    console.log(
      "Coords in available : ",
      coords,
      " vehicle no : ",
      vehicleNumber,
      " available spaces : ",
      availableSpaces
    );
  }, [coords, vehicleNumber, availableSpaces]);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111827] to-[#1f2937] flex flex-col items-center justify-start p-4">
      {/* Go Back Button */}
      
      <div className="w-full flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 transition-colors"
        >
          <ArrowLeft size={30} />
        </button>
      </div>

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        Available Parking Lots
      </h1>

      {/* Cards */}
      <div className="flex flex-col gap-3 w-full max-w-md">
        {availableSpaces && availableSpaces.length > 0 ? (
          availableSpaces.map((lot: any, idx: number) => (
            <PLotCards
              key={idx}
              area={lot.name}
              vehicleType={lot.vehicle_type}
              available={lot.available_spaces}
              total={lot.total_spaces}
            />
          ))
        ) : (
          <p className="text-white text-center">No available spaces found.</p>
        )}
      </div>
    </div>
  );
}
