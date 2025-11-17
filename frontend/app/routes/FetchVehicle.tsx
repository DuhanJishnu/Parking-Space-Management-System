import type { Route } from "./+types/home";
import { useNavigate } from "react-router";
import logo from "../assets/logo.jpeg";
import car from "../assets/car.png";
import bike from "../assets/sportbike.png";
import { getUserVehicles } from "~/api/user/getUserVehicle";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Parking Space Mgmt." },
    { name: "description", content: "Welcome to Parking Management System!" },
  ];
}

export default function FetchVehicle() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<
    { id: number; vehicle_id: string; vehicle_type: string }[]
  >([]);

  const [loading, setLoading] = useState(true); // 🔥 loading state

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const userVehicles = await getUserVehicles(15);
        setVehicles(userVehicles?.data || []);
      } catch (error) {
        console.error("Failed to fetch vehicles", error);
      } finally {
        setLoading(false); // 🔥 stop loading
      }
    }
    fetchVehicles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-[#0a0a0a] via-[#111827] to-[#1f2937] text-white font-[Baloo Bhai 2] px-6 py-8">
      
      
      <div className="flex flex-col items-center mt-6">
        <img
          src={logo}
          alt="NIT Logo"
          className="w-24 h-24 rounded-full shadow-md border-2 border-vsyellow"
        />
        <h1 className="text-2xl mt-3 font-semibold text-vsyellow tracking-wide">
          Your Vehicles
        </h1>
      </div>

      {/* Content Section */}
      <div className="mt-8 w-full flex flex-col items-center gap-4">

        {/* 🔥 Loading Screen */}
        {loading && (
          <div className="text-vsyellow text-xl animate-pulse">
            Loading your vehicles...
          </div>
        )}

        {/* 🔥 No Vehicles Found */}
        {!loading && vehicles.length === 0 && (
          <p className="text-amber-200 text-xl">No Vehicles Found</p>
        )}

        {/* 🔥 Vehicles List */}
        {!loading &&
          vehicles.length > 0 &&
          vehicles.map((v) => (
            <div
              key={v.id}
              className="w-full max-w-md bg-[#1f2937] rounded-xl p-4 flex items-center gap-4 shadow-md border border-gray-700"
            >
              <img
                src={v.vehicle_type === "4W" ? car : bike}
                alt="vehicle"
                className="w-14 h-14"
              />

              <div>
                <p className="text-lg font-semibold text-vsyellow">
                  {v.vehicle_id}
                </p>
                <p className="text-sm text-gray-300">
                  {v.vehicle_type === "4W" ? "Four Wheeler" : "Two Wheeler"}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Footer */}
      <p className="text-gray-400 text-sm mt-12 mb-4">
        © 2025 NIT Meghalaya — All Rights Reserved
      </p>
    </div>
  );
}
