import type { Route } from "./+types/home";
import { useNavigate } from "react-router";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Parking Space Mgmt." },
    { name: "description", content: "Welcome to Parking Management System!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  const handleVehicleSelect = (v_type: string) => {
    navigate(`/details/${v_type}`);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Select Vehicle Type</h1>
      <div className="flex space-x-8">
        <button
          onClick={() => handleVehicleSelect("Bike")}
          className="px-8 py-4 bg-green-500 text-white text-2xl font-semibold rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
        >
          Bike
        </button>
        <button
          onClick={() => handleVehicleSelect("Car")}
          className="px-8 py-4 bg-blue-500 text-white text-2xl font-semibold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
        >
          Car
        </button>
      </div>
    </div>
  )
}

