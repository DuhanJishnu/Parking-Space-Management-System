import { ArrowLeft, Clock, MapPin, Banknote } from "lucide-react";
import { useNavigate } from "react-router";

const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl shadow-lg p-5 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-4 py-3 rounded-lg font-semibold transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Helpers
const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const calculateDuration = (start: Date, end: Date) => {
  const diffMs = end.getTime() - start.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

export default function BillingPage() {
  const navigate = useNavigate();

  // Sample parking data
  const startTime = new Date(2025, 10, 17, 9, 30);
  const endTime = new Date(2025, 10, 17, 14, 45);
  const vehicleNumber = "JH01AB1111";
  const vehicleType = "Four Wheeler";
  const parkingCost = 250;
  const duration = calculateDuration(startTime, endTime);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white p-4">
      {/* Logo Section */}
      <div className="flex flex-col items-center py-6">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-yellow-400 text-xl font-bold">
            🅿
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">Parking Billing</h1>
        <p className="text-slate-400 text-sm">
          NIT Meghalaya Parking Space Management System
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto space-y-4">
        {/* Vehicle Details */}
        <Card className="bg-slate-800 border border-slate-700">
          <h2 className="text-lg font-semibold mb-4 text-slate-100">
            Vehicle Details
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <span className="text-slate-400">Vehicle Number</span>
              <span className="font-semibold text-white">{vehicleNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Vehicle Type</span>
              <span className="font-semibold text-white">{vehicleType}</span>
            </div>
          </div>
        </Card>

        {/* Parking Session */}
        <Card className="bg-slate-800 border border-slate-700">
          <h2 className="text-lg font-semibold mb-4 text-slate-100">
            Parking Session
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-700">
              <MapPin className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-slate-400 text-sm">Date</p>
                <p className="font-semibold">{formatDate(startTime)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-700">
              <Clock className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-slate-400 text-sm">Start Time</p>
                <p className="font-semibold">{formatTime(startTime)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-700">
              <Clock className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-slate-400 text-sm">End Time</p>
                <p className="font-semibold">{formatTime(endTime)}</p>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
              <span className="text-slate-300">Duration</span>
              <span className="font-bold text-blue-300">{duration}</span>
            </div>
          </div>
        </Card>

        {/* Cost Summary */}
        <Card className="bg-slate-800 border border-slate-700">
          <h2 className="text-lg font-semibold mb-4 text-slate-100">
            Cost Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <span className="text-slate-400">Base Rate</span>
              <span className="font-semibold">₹50/hour</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <span className="text-slate-400">Parking Duration</span>
              <span className="font-semibold">{duration}</span>
            </div>

            <div className="flex justify-between items-center pt-2 text-xl">
              <span className="font-bold">Total Amount</span>
              <span className="font-bold text-yellow-400">₹{parkingCost}</span>
            </div>
          </div>
        </Card>

        {/* Pay Now */}
        <Button
          onClick={() => alert("Proceeding to payment...")}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 py-6 text-lg"
        >
          Pay Now
        </Button>

        {/* Go Back */}
        <Button
          onClick={() => navigate(-1)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-slate-500 text-xs">
        © 2025 NIT Meghalaya — Parking Space Management System
      </div>
    </div>
  );
}
