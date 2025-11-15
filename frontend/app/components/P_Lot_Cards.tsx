import React from "react";
import { Car, Bike } from "lucide-react";

interface CardProps {
  area: string;
  vehicleType: "Car" | "Bike";
  available: number;
  total: number;
}

export default function Cards({ area, vehicleType, available, total }: CardProps) {
  const filledPercentage = (available / total) * 100;
  const occupancy = 100 - filledPercentage; // how much is filled

  // Determine progress bar color based on occupancy
  let progressColor = "bg-green-400"; // default (good availability)
  if (occupancy >= 50 && occupancy < 80) progressColor = "bg-yellow-400";
  else if (occupancy >= 80) progressColor = "bg-red-500";

  return (
    <div className="w-full max-w-sm mx-auto bg-gradient-to-br from-[#1f2937] to-[#111827] text-white rounded-3xl shadow-xl p-5 mb-5 flex flex-col items-center border border-gray-700">
      {/* Parking Area Title */}
      <h2 className="text-xl font-bold text-vsyellow mb-2">{area}</h2>

      {/* Vehicle Type */}
      <div className="flex items-center space-x-2 mb-3">
        {vehicleType === "Car" ? (
          <Car size={28} className="text-blue-400" />
        ) : (
          <Bike size={28} className="text-green-400" />
        )}
        <p className="text-lg font-semibold">{vehicleType}</p>
      </div>

      {/* Availability Info */}
      <div className="w-full flex justify-between items-center px-2 mb-3">
        <p className="text-sm text-gray-300">
          Available:{" "}
          <span className="text-green-400 font-semibold">{available}</span>
        </p>
        <p className="text-sm text-gray-300">
          Total: <span className="text-vsyellow font-semibold">{total}</span>
        </p>
      </div>

      {/* Dynamic Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className={`h-3 transition-all duration-700 ease-in-out ${progressColor}`}
          style={{ width: `${ 100 - filledPercentage}%` }}
        ></div>
      </div>

      {/* Percentage Label */}
      <p className="text-xs text-gray-400 mt-2">
        {Math.round(filledPercentage)}% free
      </p>
    </div>
  );
}
