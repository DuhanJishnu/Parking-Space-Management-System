import type { Route } from "./+types/home";
import { useNavigate } from "react-router";
import logo from "../assets/logo.jpeg";
import car from "../assets/car.png";
import bike from "../assets/sportbike.png";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Parking Space Mgmt." },
    { name: "description", content: "Welcome to Parking Management System!" },
  ];
}

export default function SelectVehicle() {
  const navigate = useNavigate();

  const handleVehicleSelect = (v_type: string) => {
    navigate(`/details/${v_type}`);
  };

  return (
    <div className="min-h-screen h-fit flex flex-col items-center justify-between bg-gradient-to-b from-[#0a0a0a] via-[#111827] to-[#1f2937] text-white font-[Baloo Bhai 2] px-6 py-8">
      {/* Logo */}
      <div className="flex flex-col items-center mt-6">
        <img
          src={logo}
          alt="NIT Logo"
          className="w-24 h-24 rounded-full shadow-md border-2 border-vsyellow"
        />
        <h1 className="text-2xl mt-3 font-semibold text-vsyellow tracking-wide">
          Parking Space
        </h1>
      </div>

      {/* Title */}
      <div className="text-center mt-8">
        <h2 className="text-3xl font-bold text-vsyellow drop-shadow-md">
          Select Vehicle Type
        </h2>
        <p className="text-gray-300 text-base mt-2">
          Choose your mode of parking below
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col w-full items-center mt-10 space-y-6">
        <button
          onClick={() => handleVehicleSelect("bike")}
          className="w-64 flex items-center justify-between bg-gradient-to-r from-[#facc15] to-[#f59e0b] rounded-2xl px-6 py-3 shadow-lg active:scale-95 transition-transform duration-150"
        >
          <span className="text-xl font-semibold tracking-wide">Bike</span>
          <img
            src={bike}
            alt="Bike"
            className="w-16 object-contain"
          />
        </button>
      <p className="font-bold text-2xl">OR</p>
        <button
          onClick={() => handleVehicleSelect("car")}
          className="w-64 flex items-center justify-between bg-gradient-to-r from-[#facc15] to-[#f59e0b] rounded-2xl px-6 py-3 shadow-lg active:scale-95 transition-transform duration-150"
        >
          <span className="text-xl font-semibold tracking-wide">Car</span>
          <img
            src={car}
            alt="Car"
            className="w-16  object-contain"
          />
        </button>
      </div>

      {/* Footer */}
      <p className="text-gray-400 text-sm mt-12 mb-4">
        © 2025 NIT Meghalaya — All Rights Reserved
      </p>
    </div>
  );
}
