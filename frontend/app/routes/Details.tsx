import { useNavigate } from "react-router";
import { useState, useContext } from "react";
import logo from "../assets/logo.jpeg";
import RequestLocation from "~/components/Req_Location";
import FindingScreen from "~/components/Find_Screen";
import { UserContext } from "../context/User";


export default function Details() {
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  // VEHICLE SELECTION
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState<"4W" | "2W">("4W");

  const [positionCoords, setPositionCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [startLocationRequest, setStartLocationRequest] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStartLocationRequest(true);
  };

  const handleCoordsReceived = async (coords: { lat: number; lng: number }) => {
    setPositionCoords(coords);
    setLoading(true);

    console.log(
      "User: ",
      user,
      "\n Selected Vehicle No. and Type : ",
      vehicleNumber, ", ",vehicleType,
      "\n Coords: ",
      coords
    );
    navigate("/available-slots", {
      state: {
        coords,
        vehicleNumber,
        vehicleType: vehicleType,
      },
    });
    setLoading(false);
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#111827] to-[#1f2937] text-white font-[Baloo Bhai 2] px-6 py-8">
      {/* LOCATION PROMPT */}
      {startLocationRequest && (
        <RequestLocation
          setCoords={(coords) => {
            handleCoordsReceived(coords);
            setStartLocationRequest(false);
          }}
        />
      )}

      {!loading && (
        <div>
          {/* HEADER */}
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
              Selected Vehicle Type:{vehicleType=="4W" ? "Car" : "Bike"}
            </p>
          </div>

          {/* FORM */}
          <div className="w-full max-w-md mt-10 bg-[#1f2937]/80 backdrop-blur-md border border-gray-700 rounded-3xl shadow-2xl p-6 space-y-6">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
              {/* VEHICLE NUMBER */}
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

              {/* VEHICLE TYPE */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Vehicle Type
                </label>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setVehicleType("4W")}
                    className={`flex-1 px-4 py-2 rounded-xl border ${
                      vehicleType === "4W"
                        ? "bg-yellow-400 text-black font-bold"
                        : "bg-gray-800 text-gray-300 border-gray-600"
                    }`}
                  >
                    Car (4W)
                  </button>

                  <button
                    type="button"
                    onClick={() => setVehicleType("2W")}
                    className={`flex-1 px-4 py-2 rounded-xl border ${
                      vehicleType === "2W"
                        ? "bg-yellow-400 text-black font-bold"
                        : "bg-gray-800 text-gray-300 border-gray-600"
                    }`}
                  >
                    Bike (2W)
                  </button>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="mt-4 bg-gradient-to-r from-[#facc15] to-[#f59e0b] text-black font-semibold text-lg py-3 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-transform duration-200"
              >
                Look
              </button>
            </form>
          </div>

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className="mt-8 px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white rounded-xl shadow-md hover:scale-105 active:scale-95 transition-transform duration-150"
          >
            Go Back
          </button>

          {/* FOOTER */}
          <p className="text-gray-500 text-xs mt-10 mb-2">
            © 2025 NIT Meghalaya — Parking Space Management System
          </p>
        </div>
      )}
    </div>
  );
}
