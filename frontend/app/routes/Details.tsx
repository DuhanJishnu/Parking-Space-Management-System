import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import logo from "../assets/logo.jpeg";
import RequestLocation from "~/components/Req_Location";
import FindingScreen from "~/components/Find_Screen";

export default function Details() {
  const { v_type } = useParams<{ v_type: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [positionCoords, setPositionCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [startRequest, setStartRequest] = useState(false);

  const handleReset = () => {
    setName("");
    setContact("");
    setName("");
    setPositionCoords(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStartRequest(true);
  };

  const handleCoordsReceived = (coords: { lat: number; lng: number }) => {
    setPositionCoords(coords);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/available");
    }, 5000);

  };


  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#111827] to-[#1f2937] text-white font-[Baloo Bhai 2] px-6 py-8">

      {/* ✅ Render only when user clicks Look */}
      
      {startRequest && (
        <RequestLocation
          setCoords={(coords) => {
            handleCoordsReceived(coords);
            setStartRequest(false); 
          }}
        />
      )}


      {loading && <FindingScreen />}

      { !loading && <div>
        {/* Header Section */}

        <div className="flex flex-col items-center mt-4">
          <img
            src={logo}
            alt="NIT Logo"
            className="w-20 h-20 rounded-full shadow-lg border-2 border-vsyellow"
          />
          <h1 className="text-3xl mt-3 font-bold text-vsyellow drop-shadow-md">
            Parking Details
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            Selected Vehicle:{" "}
            <span className="capitalize text-vsyellow font-semibold">
              {v_type || "N/A"}
            </span>
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-md mt-10 bg-[#1f2937]/80 backdrop-blur-md border border-gray-700 rounded-3xl shadow-2xl p-6 space-y-6">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-vsyellow outline-none placeholder-gray-500"
              />
            </div>

            {/* Vehicle Number */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Vehicle Number
              </label>
              <input
                type="text"
                placeholder="e.g. ML05C1234"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-vsyellow outline-none placeholder-gray-500"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                placeholder="Enter contact number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-vsyellow outline-none placeholder-gray-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-4 bg-gradient-to-r from-[#facc15] to-[#f59e0b] text-black font-semibold text-lg py-3 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-transform duration-200"
            >
              Look
            </button>
          </form>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mt-8 px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white rounded-xl shadow-md hover:scale-105 active:scale-95 transition-transform duration-150"
        >
          Go Back
        </button>

        {/* Footer */}
        <p className="text-gray-500 self-end justify-self-end text-xs mt-10 mb-2">
          © 2025 NIT Meghalaya — Parking Space Management System
        </p>
      </div>}
    </div>
  );
}
