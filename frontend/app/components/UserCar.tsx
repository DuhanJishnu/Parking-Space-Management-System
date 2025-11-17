// UserCarCard.tsx
import car from "../assets/car.png";
import bike from "../assets/sportbike.png";

interface Props {
  vehicle_id: string;
  vehicle_type: "2W" | "4W";
}

export default function UserCarCard({ vehicle_id, vehicle_type }: Props) {
  return (
    <div className="w-full max-w-md bg-[#1f2937] rounded-xl p-4 flex items-center gap-4 shadow-md border border-gray-700">
      <img
        src={vehicle_type === "4W" ? car : bike}
        alt="vehicle"
        className="w-14 h-14"
      />

      <div>
        <p className="text-lg font-semibold text-vsyellow">{vehicle_id}</p>
        <p className="text-sm text-gray-300">
          {vehicle_type === "4W" ? "Four Wheeler" : "Two Wheeler"}
        </p>
      </div>
    </div>
  );
}
