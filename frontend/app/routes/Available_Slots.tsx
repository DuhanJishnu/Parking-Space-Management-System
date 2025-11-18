import React, { useEffect, useState, useContext } from "react";
import PLotCards from "~/components/P_Lot_Cards";
import { useNavigate, useLocation } from "react-router";
import { ArrowLeft } from "lucide-react";

import { UserContext } from "../context/User";
import FindingScreen from "~/components/Find_Screen";

import { getParkingLots } from "~/api/parkingLots/getLots";
import { getSpacesByLot } from "~/api/parkingSpaces/getSpacesByLot";
import { reserveSpace } from "~/api/occupancy/reserveSpace";

export default function Available_Slots() {
  const userContext = useContext(UserContext) as any;
  const user = userContext?.user;

  const location = useLocation();
  const navigate = useNavigate();

  const { coords, vehicleNumber, vehicleType } = location.state || {};

  const [availableSpaces, setAvailableSpaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservedLotId, setReservedLotId] = useState<number | null>(null);

  const handleReserve = async (lot: any) => {
    try {
      setLoading(true);

      // Fetch all spaces for this lot
      const spacesResponse = await getSpacesByLot(lot.id);
      const allSpaces = spacesResponse.data || [];

      // Filter available spaces matching the vehicle type
      const availableMatchingSpaces = allSpaces.filter((space: any) => {
        const spaceTypeMatches =
          vehicleType === "4W"
            ? space.space_type === "4W"
            : space.space_type === "2W";
        const isUnoccupied = space.state === "unoccupied";

        return spaceTypeMatches && isUnoccupied;
      });

      if (availableMatchingSpaces.length === 0) {
        alert(
          `❌ No available ${vehicleType} spaces in ${lot.name}. Please try another lot.`
        );
        setLoading(false);
        return;
      }

      // Pick a random available space
      const randomSpace =
        availableMatchingSpaces[
          Math.floor(Math.random() * availableMatchingSpaces.length)
        ];

      console.log("🅿️ Reserved Space Details:");
      console.log("Parking Lot:", lot.name);
      console.log("Space ID:", randomSpace.id);
      console.log("Space Type:", randomSpace.space_type);
      console.log("Vehicle Number:", vehicleNumber);

      // Confirm with user
      const confirmed = window.confirm(
        `✅ Found available ${randomSpace.space_type} space!\n\n` +
          `Lot: ${lot.name}\n` +
          `Space ID: #${randomSpace.id}\n` +
          `Vehicle: ${vehicleNumber}\n\n` +
          `Proceed with reservation?`
      );

      if (!confirmed) {
        setLoading(false);
        return;
      }

      // Reserve the space
      const reservePayload = {
        space_id: randomSpace.id,
        user_id: user?.id,  // Add user_id to reserve
      };

      await reserveSpace(reservePayload);

      alert(
        `🎉 Space reserved successfully!\n\nLot: ${lot.name}\nSpace #${randomSpace.id}`
      );

      setReservedLotId(lot.id);
    } catch (error: any) {
      console.error("Error reserving space:", error);
      const errorMsg =
        error.response?.data?.error || error.message || "Failed to reserve space";
      alert(`❌ Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen flex flex-col bg-linear-to-b from-[#0a0a0a] via-[#111827] to-[#1f2937]  justify-center items-center p-4">
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
                      disabled={reservedLotId === lot.id}
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
