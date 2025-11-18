import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Clock, DollarSign, AlertCircle, CheckCheck } from "lucide-react";

const StaffDashboard = () => {
  const [activeOccupancies, setActiveOccupancies] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOccupancy, setSelectedOccupancy] = useState<any | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showVerificationChecklist, setShowVerificationChecklist] = useState(false);
  const [exitConfirmed, setExitConfirmed] = useState(false);
  const [generatedBill, setGeneratedBill] = useState<any | null>(null);
  
  // Verification checklist state
  const [verificationChecks, setVerificationChecks] = useState({
    parkingSpotCorrect: false,
    vehicleConditionChecked: false,
    noCarDamage: false,
    billAmountConfirmed: false,
  });

  // Fetch active occupancies and bills
  useEffect(() => {
    fetchActiveOccupancies();
    fetchBills();
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchActiveOccupancies();
      fetchBills();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchActiveOccupancies = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://192.168.3.51:5000/api/occupancy/active");
      const data = await response.json();
      if (data.success) {
        setActiveOccupancies(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching occupancies:", error);
    }
    setLoading(false);
  };

  const fetchBills = async () => {
    try {
      const response = await fetch("http://192.168.3.51:5000/api/billing/");
      const data = await response.json();
      if (data.success) {
        setBills(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  const getPendingBillsCount = () => {
    return bills.filter((b) => b.payment_status === "pending").length;
  };

  const calculateDuration = (entryTime: string) => {
    const entry = new Date(entryTime);
    const now = new Date();
    const diffMs = now.getTime() - entry.getTime();
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleSelectOccupancy = (occupancy: any) => {
    setSelectedOccupancy(occupancy);
    setVerificationChecks({
      parkingSpotCorrect: false,
      vehicleConditionChecked: false,
      noCarDamage: false,
      billAmountConfirmed: false,
    });
    setGeneratedBill(null);
    setShowVerificationChecklist(true);
  };

  const handleVerificationCheckChange = (key: keyof typeof verificationChecks) => {
    setVerificationChecks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const allVerificationsComplete = Object.values(verificationChecks).every((val) => val === true);

  const handleProceedToExit = async () => {
    if (!selectedOccupancy || !allVerificationsComplete) return;

    // Show exit modal after verification
    setShowVerificationChecklist(false);
    setShowExitModal(true);
  };

  const handleConfirmExit = async () => {
    if (!selectedOccupancy) return;

    try {
      setExitConfirmed(true);

      // Call checkout endpoint to mark vehicle as exited and generate bill
      const response = await fetch(
        `http://192.168.3.51:5000/api/occupancy/${selectedOccupancy.id}/check-out`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exit_time: new Date().toISOString(),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Store the generated bill
        setGeneratedBill(data.data);
        
        // Show success and refresh
        alert(
          `✅ Vehicle checked out successfully!\n\n` +
            `Bill Amount: ₹${data.data.amount}\n` +
            `Billing ID: #${data.data.billing.id}\n` +
            `Status: Pending Payment`
        );

        // Close modal and refresh list
        setShowExitModal(false);
        setSelectedOccupancy(null);
        setExitConfirmed(false);
        setGeneratedBill(null);
        fetchActiveOccupancies();
        fetchBills();
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error checking out vehicle:", error);
      alert("❌ Error processing vehicle exit");
    } finally {
      setExitConfirmed(false);
    }
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
    setShowVerificationChecklist(false);
    setSelectedOccupancy(null);
    setExitConfirmed(false);
    setVerificationChecks({
      parkingSpotCorrect: false,
      vehicleConditionChecked: false,
      noCarDamage: false,
      billAmountConfirmed: false,
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0a0a0a] via-[#111827] to-[#1f2937] text-white font-[Baloo Bhai 2]">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-gray-700 p-6">
        <h1 className="text-4xl font-bold text-vsyellow">Staff Dashboard</h1>
        <p className="text-gray-400 mt-2">
          Verify vehicle exits and manage parking operations
        </p>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1f2937]/70 backdrop-blur-md rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Active Vehicles</p>
                <p className="text-3xl font-bold text-vsyellow">
                  {activeOccupancies.length}
                </p>
              </div>
              <Clock size={40} className="text-vsyellow opacity-50" />
            </div>
          </div>

          <div className="bg-[#1f2937]/70 backdrop-blur-md rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Ready for Exit</p>
                <p className="text-3xl font-bold text-green-400">
                  {activeOccupancies.length}
                </p>
              </div>
              <CheckCircle2 size={40} className="text-green-400 opacity-50" />
            </div>
          </div>

          <div className="bg-[#1f2937]/70 backdrop-blur-md rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Pending Payments</p>
                <p className="text-3xl font-bold text-orange-400">
                  {getPendingBillsCount()}
                </p>
              </div>
              <DollarSign size={40} className="text-orange-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Active Occupancies Section */}
        <div className="bg-[#1f2937]/70 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-vsyellow">
              Active Parking Sessions
            </h2>
            <button
              onClick={fetchActiveOccupancies}
              className="px-4 py-2 bg-yellow-300 text-black rounded-lg font-semibold hover:bg-yellow-500 transition-all"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : activeOccupancies.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              No active parking sessions
            </div>
          ) : (
            <div className="space-y-3">
              {activeOccupancies.map((occupancy: any) => (
                <div
                  key={occupancy.id}
                  className="bg-[#111827] rounded-xl p-4 border border-gray-700 hover:border-vsyellow transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-lg font-bold text-vsyellow">
                        Space #{occupancy.space_id}
                      </p>
                      {occupancy.vehicle ? (
                        <>
                          <p className="text-sm text-green-400 font-semibold">
                            🚗 {occupancy.vehicle.vehicle_id} ({occupancy.vehicle.vehicle_type})
                          </p>
                          {occupancy.owner && (
                            <p className="text-xs text-gray-400">
                              Owner: {occupancy.owner.name} • {occupancy.owner.contact_no}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-gray-400 italic">No vehicle (Reserved)</p>
                      )}
                      <p className="text-gray-400 text-xs mt-1">
                        Entry: {new Date(occupancy.entry_time).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Occupancy</p>
                      <p className="text-lg font-bold text-vsyellow">
                        #{occupancy.id}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <p className="text-gray-400 text-xs">Status</p>
                      <p className="text-green-400 font-semibold text-sm">
                        {occupancy.status.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Duration</p>
                      <p className="text-vsyellow font-semibold text-sm">
                        {calculateDuration(occupancy.entry_time)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Type</p>
                      <p className="text-orange-400 font-semibold text-sm">
                        {occupancy.vehicle?.vehicle_type || "N/A"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectOccupancy(occupancy)}
                    className="w-full bg-linear-to-r from-green-600 to-green-700 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    Mark Vehicle Exit
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && selectedOccupancy && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f2937] rounded-2xl p-8 max-w-md w-full border border-gray-700">
            <h3 className="text-2xl font-bold text-vsyellow mb-4">
              Confirm Vehicle Exit
            </h3>

            <div className="bg-[#111827] rounded-lg p-4 mb-6 space-y-3">
              <div className="border-b border-gray-600 pb-3">
                <p className="text-gray-400 text-xs">VEHICLE & OWNER</p>
                {selectedOccupancy.vehicle ? (
                  <>
                    <p className="text-lg font-bold text-green-400 mt-1">
                      🚗 {selectedOccupancy.vehicle.vehicle_id}
                    </p>
                    <p className="text-sm text-gray-300">
                      Type: {selectedOccupancy.vehicle.vehicle_type}
                    </p>
                    {selectedOccupancy.owner && (
                      <div className="mt-2 bg-[#0f1419] rounded p-2">
                        <p className="text-sm font-semibold text-vsyellow">
                          👤 {selectedOccupancy.owner.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          📞 {selectedOccupancy.owner.contact_no}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-400 italic mt-1">No vehicle (Reserved only)</p>
                )}
              </div>

              <div>
                <p className="text-gray-400 text-xs">SPACE ID</p>
                <p className="text-lg font-bold text-vsyellow">
                  #{selectedOccupancy.space_id}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Entry Time</p>
                <p className="text-sm text-gray-300">
                  {new Date(selectedOccupancy.entry_time).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Exit Time</p>
                <p className="text-sm text-gray-300">
                  {new Date().toLocaleString()}
                </p>
              </div>
              <div className="border-t border-gray-600 pt-3">
                <p className="text-gray-400 text-xs">PARKING DURATION</p>
                <p className="text-lg font-bold text-green-400">
                  {calculateDuration(selectedOccupancy.entry_time)}
                </p>
              </div>
            </div>

            <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-4 mb-6">
              <p className="text-orange-300 text-sm font-semibold flex items-center gap-2">
                <AlertCircle size={18} />
                This action will:
              </p>
              <ul className="text-gray-300 text-sm mt-2 space-y-1 ml-6">
                <li>• Mark space as unoccupied</li>
                <li>• Generate bill for customer</li>
                <li>• Create pending payment entry</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelExit}
                disabled={exitConfirmed}
                className="flex-1 bg-gray-600 text-white font-semibold py-2 rounded-lg hover:bg-gray-700 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmExit}
                disabled={exitConfirmed}
                className="flex-1 bg-linear-to-r from-green-600 to-green-700 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {exitConfirmed ? "Processing..." : "Confirm Exit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pre-Exit Verification Checklist Modal */}
      {showVerificationChecklist && selectedOccupancy && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f2937] rounded-2xl p-8 max-w-md w-full border border-yellow-600 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-6">
              <CheckCheck size={28} className="text-vsyellow" />
              <h3 className="text-2xl font-bold text-vsyellow">
                Pre-Exit Verification
              </h3>
            </div>

            <div className="bg-[#111827] rounded-lg p-4 mb-6">
              <p className="text-gray-400 text-sm">Occupancy #</p>
              <p className="text-lg font-bold text-vsyellow">
                #{selectedOccupancy.id}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Space #{selectedOccupancy.space_id}
              </p>
            </div>

            <p className="text-gray-300 text-sm mb-6 flex items-start gap-2">
              <AlertCircle size={18} className="text-orange-400 mt-0.5 shrink-0" />
              <span>
                Verify all conditions before proceeding with vehicle exit and bill generation.
              </span>
            </p>

            {/* Verification Checklist */}
            <div className="space-y-3 mb-8">
              <label className="flex items-center gap-3 p-3 rounded-lg bg-[#111827] hover:bg-[#1a2332] cursor-pointer transition-all border border-gray-700">
                <input
                  type="checkbox"
                  checked={verificationChecks.parkingSpotCorrect}
                  onChange={() => handleVerificationCheckChange("parkingSpotCorrect")}
                  className="w-5 h-5 accent-vsyellow cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-white font-semibold">Parking Spot Verified</p>
                  <p className="text-gray-400 text-xs">
                    Confirmed vehicle is in correct parking space
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-[#111827] hover:bg-[#1a2332] cursor-pointer transition-all border border-gray-700">
                <input
                  type="checkbox"
                  checked={verificationChecks.vehicleConditionChecked}
                  onChange={() => handleVerificationCheckChange("vehicleConditionChecked")}
                  className="w-5 h-5 accent-vsyellow cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-white font-semibold">Vehicle Condition Checked</p>
                  <p className="text-gray-400 text-xs">
                    Vehicle inspected for any issues
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-[#111827] hover:bg-[#1a2332] cursor-pointer transition-all border border-gray-700">
                <input
                  type="checkbox"
                  checked={verificationChecks.noCarDamage}
                  onChange={() => handleVerificationCheckChange("noCarDamage")}
                  className="w-5 h-5 accent-vsyellow cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-white font-semibold">No Vehicle Damage</p>
                  <p className="text-gray-400 text-xs">
                    Vehicle has no damage or wear
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-[#111827] hover:bg-[#1a2332] cursor-pointer transition-all border border-gray-700">
                <input
                  type="checkbox"
                  checked={verificationChecks.billAmountConfirmed}
                  onChange={() => handleVerificationCheckChange("billAmountConfirmed")}
                  className="w-5 h-5 accent-vsyellow cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-white font-semibold">Proceed with Bill</p>
                  <p className="text-gray-400 text-xs">
                    Ready to generate and process payment bill
                  </p>
                </div>
              </label>
            </div>

            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-400 text-xs font-semibold">VERIFICATION PROGRESS</p>
                <p className="text-vsyellow text-sm font-bold">
                  {Object.values(verificationChecks).filter(Boolean).length}/4
                </p>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-vsyellow h-2 rounded-full transition-all"
                  style={{
                    width: `${(Object.values(verificationChecks).filter(Boolean).length / 4) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowVerificationChecklist(false);
                  setSelectedOccupancy(null);
                  setVerificationChecks({
                    parkingSpotCorrect: false,
                    vehicleConditionChecked: false,
                    noCarDamage: false,
                    billAmountConfirmed: false,
                  });
                }}
                className="flex-1 bg-gray-600 text-white font-semibold py-2 rounded-lg hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleProceedToExit}
                disabled={!allVerificationsComplete}
                className="flex-1 bg-linear-to-r from-green-600 to-green-700 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {allVerificationsComplete
                  ? "Proceed to Exit"
                  : `Complete ${4 - Object.values(verificationChecks).filter(Boolean).length} more`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
