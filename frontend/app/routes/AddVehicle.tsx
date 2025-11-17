import { useState } from "react";
import { useNavigate } from "react-router";
import { registerVehicle } from "~/api/vehicles/registerVehicle";
import logo from "../assets/logo.jpeg";

export default function AddVehicle() {
  const navigate = useNavigate();

  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("2W");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const payload = {user_id : 15, vehicle_number : vehicleNumber, vehicle_type : vehicleType};
      await registerVehicle(payload);
      navigate(-1); // Go back to previous page
    } catch (error) {
      console.error("Failed to add vehicle:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center bg-gradient-to-b from-[#0a0a0a] via-[#111827] to-[#1f2937] text-white font-[Baloo Bhai 2] px-6 py-10">

      {/* Header */}
      <div className="flex flex-col items-center mt-4">
        <img
          src={logo}
          alt="NIT Logo"
          className="w-20 h-20 rounded-full shadow-lg border-2 border-vsyellow"
        />
        <h1 className="text-3xl mt-3 font-bold text-vsyellow drop-shadow-md">
          Add Vehicle
        </h1>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md mt-10 bg-[#1f2937]/80 backdrop-blur-md border border-gray-700 rounded-3xl shadow-2xl p-6 space-y-6">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">

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

          {/* Vehicle Type */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Vehicle Type
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-vsyellow outline-none"
            >
              <option value="2W">2 Wheeler</option>
              <option value="4W">4 Wheeler</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-gradient-to-r from-[#facc15] to-[#f59e0b] text-black font-semibold text-lg py-3 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-transform duration-200 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Vehicle"}
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
    </div>
  );
}
