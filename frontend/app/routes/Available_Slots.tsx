import React, { useEffect, useState, useContext } from "react";
import PLotCards from "~/components/P_Lot_Cards";
import { useNavigate, useLocation } from "react-router";
import { ArrowLeft } from "lucide-react";

import { UserContext } from "../context/User";
import FindingScreen from "~/components/Find_Screen";

import { getParkingLots } from "~/api/parkingLots/getLots";
import { checkIn } from "~/api/occupancy/checkin";

export default function Available_Slots() {
  const { user } = useContext(UserContext);

  const location = useLocation();
  const navigate = useNavigate();

  const { coords, vehicleNumber, vehicleType } = location.state || {};

  const [availableSpaces, setAvailableSpaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservedLotId, setReservedLotId] = useState<number | null>(null);

  const handleReserve = async (lot: any) => {
    const payload={user_id:user.id, vehicle_id:vehicleNumber, }
    const res = await checkIn({})
    console.log("Reservation Details:");
    console.log("Parking Lot ID:", lot.id);
    console.log("User:", user);
    console.log("Vehicle Number:", vehicleNumber);

    setReservedLotId(lot.id);
  };

  useEffect(() => {
    if (!coords || !vehicleNumber) return;

    async function fetchSlots() {
      try {
        const response = await getParkingLots();
        setAvailableSpaces(response.data || []);
      } catch (err) {
        console.error("Failed to fetch available slots", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSlots();
  }, [coords, vehicleNumber]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0a0a0a] via-[#111827] to-[#1f2937]  justify-center items-center p-4">
      {/* Go Back */}
      <div className="w-full flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 transition-colors"
        >
          <ArrowLeft size={30} />
        </button>
      </div>

      {loading && <FindingScreen />}

      {!loading && (
        <>
          <h1 className="text-3xl font-bold text-yellow-400 mb-6">
            Available Parking Lots
          </h1>

          <div className="flex flex-col gap-3 w-full max-w-md">
            {!loading && availableSpaces.length > 0
              ? availableSpaces.map((lot: any, idx: number) => {
                  const available =
                    vehicleType === "4W"
                      ? lot.available_4w_spaces
                      : lot.available_2w_spaces;

                  return (
                    <PLotCards
                      key={idx}
                      lotId={lot.id}
                      area={lot.name}
                      vehicleType={vehicleType}
                      available={available}
                      total={lot.capacity}
                      disabled={reservedLotId !== null}
                      onReserve={() => handleReserve(lot)}
                    />
                  );
                })
              : !loading && (
                  <p className="text-white text-center">
                    No available spaces found.
                  </p>
                )}
          </div>
        </>
      )}
    </div>
  );
}
