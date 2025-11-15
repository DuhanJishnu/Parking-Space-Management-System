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
  const lots: CardProps[] = [
    { area: "Lot A", vehicleType: "Car", available: 12, total: 20 },
    { area: "Lot B", vehicleType: "Bike", available: 5, total: 10 },
    { area: "Lot C", vehicleType: "Car", available: 8, total: 15 },
    { area: "Lot D", vehicleType: "Car", available: 2, total: 10 },
    { area: "Lot E", vehicleType: "Car", available: 18, total: 25 },
    { area: "Lot F", vehicleType: "Bike", available: 15, total: 30 },
    { area: "Lot G", vehicleType: "Car", available: 5, total: 25 },
    { area: "Lot H", vehicleType: "Bike", available: 20, total: 25 },
    { area: "Lot I", vehicleType: "Car", available: 10, total: 10 },
    { area: "Lot J", vehicleType: "Car", available: 1, total: 5 },
  ];

  const location = useLocation();
  const { coords, vehicleNumber } = location.state || {};
  useEffect(()=>console.log( "Coords in available : ", coords, " vehicle no : ", vehicleNumber ),[])
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
        {lots.map((lot, idx) => (
          <PLotCards key={idx} {...lot} />
        ))}
      </div>
    </div>
  );
}
