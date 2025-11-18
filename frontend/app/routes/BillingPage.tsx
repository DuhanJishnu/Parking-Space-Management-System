import React, { useEffect, useState } from "react";
import { ArrowLeft, DollarSign, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { UserContext } from "../context/User";

const BillingPage = () => {
  const navigate = useNavigate();
  const userContext = React.useContext(UserContext) as any;
  const user = userContext?.user;
  const [bills, setBills] = useState<any[]>([]);
  const [occupancies, setOccupancies] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [processingBillId, setProcessingBillId] = useState<number | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  useEffect(() => {
    fetchBills();
  }, [user?.id]);

  const fetchBills = async () => {
    setLoading(true);
    try {
      // If user is not logged in or not a customer, don't fetch
      if (!user?.id) {
        console.warn("User not logged in, cannot fetch bills");
        setLoading(false);
        return;
      }

      // Fetch bills for this specific customer (owner_id)
      const response = await fetch(
        `http://192.168.3.51:5000/api/billing/?owner_id=${user.id}`
      );
      const data = await response.json();
      if (data.success) {
        setBills(data.data || []);
        // Fetch occupancy details for each bill
        const occData: any = {};
        for (const bill of data.data || []) {
          try {
            const occResponse = await fetch(
              `http://192.168.3.51:5000/api/occupancy/${bill.occupancy_id}`
            );
            const occJSON = await occResponse.json();
            if (occJSON.success) {
              occData[bill.occupancy_id] = occJSON.data;
            }
          } catch (error) {
            console.error(`Error fetching occupancy ${bill.occupancy_id}:`, error);
          }
        }
        setOccupancies(occData);
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
    setLoading(false);
  };

  const calculateDuration = (entryTime: string, exitTime?: string) => {
    const entry = new Date(entryTime);
    const exit = exitTime ? new Date(exitTime) : new Date();
    const diffMs = exit.getTime() - entry.getTime();
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const handlePayBill = async (billId: number) => {
    try {
      setProcessingBillId(billId);

      const response = await fetch(
        `http://192.168.3.51:5000/api/billing/${billId}/pay`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payment_time: new Date().toISOString(),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setPaymentSuccess(true);
        alert(
          `✅ Payment Successful!\n\n` +
            `Bill ID: #${billId}\n` +
            `Amount Paid: ₹${data.data.amount}\n` +
            `Payment Time: ${new Date(data.data.payment_time).toLocaleString()}`
        );

        // Refresh bills
        fetchBills();
        setPaymentSuccess(false);
      } else {
        alert(`❌ Payment Failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("❌ Error processing payment");
    } finally {
      setProcessingBillId(null);
    }
  };

  const pendingBills = bills.filter((b) => b.payment_status === "pending");
  const paidBills = bills.filter((b) => b.payment_status === "paid");

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0a0a0a] via-[#111827] to-[#1f2937] text-white font-[Baloo Bhai 2]">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-gray-700 p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-vsyellow">Your Bills</h1>
            <p className="text-gray-400 mt-1">View and pay your parking bills</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1f2937]/70 backdrop-blur-md rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Total Bills</p>
                <p className="text-3xl font-bold text-vsyellow">{bills.length}</p>
              </div>
              <DollarSign size={40} className="text-vsyellow opacity-50" />
            </div>
          </div>

          <div className="bg-[#1f2937]/70 backdrop-blur-md rounded-xl p-6 border border-orange-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Pending Payment</p>
                <p className="text-3xl font-bold text-orange-400">
                  {pendingBills.length}
                </p>
              </div>
              <AlertCircle size={40} className="text-orange-400 opacity-50" />
            </div>
          </div>

          <div className="bg-[#1f2937]/70 backdrop-blur-md rounded-xl p-6 border border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Paid</p>
                <p className="text-3xl font-bold text-green-400">
                  {paidBills.length}
                </p>
              </div>
              <CheckCircle2 size={40} className="text-green-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Pending Bills Section */}
        {pendingBills.length > 0 && (
          <div className="bg-[#1f2937]/70 backdrop-blur-md rounded-2xl p-6 border border-orange-700 mb-8">
            <h2 className="text-2xl font-bold text-orange-400 mb-6">
              ⚠️ Pending Payments ({pendingBills.length})
            </h2>

            <div className="space-y-4">
              {pendingBills.map((bill: any) => (
                <div
                  key={bill.id}
                  className="bg-[#111827] rounded-xl p-6 border border-orange-700/50 hover:border-orange-500 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-lg font-bold text-vsyellow">
                        Bill #{bill.id}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Occupancy: #{bill.occupancy_id}
                      </p>
                      {occupancies[bill.occupancy_id]?.vehicle && (
                        <p className="text-sm text-green-400 font-semibold mt-1">
                          🚗 {occupancies[bill.occupancy_id].vehicle.vehicle_id}
                        </p>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-orange-900/50 text-orange-300 rounded-full text-sm font-semibold">
                      PENDING
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-gray-400 text-sm">Amount</p>
                      <p className="text-2xl font-bold text-vsyellow">
                        ₹{bill.amount}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Created</p>
                      <p className="text-sm text-gray-300">
                        {new Date(bill.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {occupancies[bill.occupancy_id]?.owner && (
                      <>
                        <div>
                          <p className="text-gray-400 text-sm">Owner</p>
                          <p className="text-sm text-gray-300">
                            {occupancies[bill.occupancy_id].owner.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Contact</p>
                          <p className="text-sm text-gray-300">
                            {occupancies[bill.occupancy_id].owner.contact_no}
                          </p>
                        </div>
                      </>
                    )}
                    {occupancies[bill.occupancy_id] && (
                      <>
                        <div>
                          <p className="text-gray-400 text-sm">Entry Time</p>
                          <p className="text-xs text-gray-300">
                            {new Date(occupancies[bill.occupancy_id].entry_time).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Duration</p>
                          <p className="text-sm font-bold text-green-400">
                            {calculateDuration(
                              occupancies[bill.occupancy_id].entry_time,
                              occupancies[bill.occupancy_id].exit_time
                            )}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handlePayBill(bill.id)}
                    disabled={processingBillId === bill.id}
                    className="w-full bg-linear-to-r from-green-600 to-green-700 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {processingBillId === bill.id
                      ? "Processing Payment..."
                      : `Pay ₹${bill.amount}`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paid Bills Section */}
        {paidBills.length > 0 && (
          <div className="bg-[#1f2937]/70 backdrop-blur-md rounded-2xl p-6 border border-green-700">
            <h2 className="text-2xl font-bold text-green-400 mb-6">
              ✅ Paid Bills ({paidBills.length})
            </h2>

            <div className="space-y-3">
              {paidBills.map((bill: any) => (
                <div
                  key={bill.id}
                  className="bg-[#111827] rounded-xl p-4 border border-green-700/50 flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-bold text-vsyellow">
                      Bill #{bill.id}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {occupancies[bill.occupancy_id]?.vehicle && (
                        <>
                          🚗 {occupancies[bill.occupancy_id].vehicle.vehicle_id} •{" "}
                        </>
                      )}
                      {occupancies[bill.occupancy_id]?.owner && (
                        <>
                          {occupancies[bill.occupancy_id].owner.name} •{" "}
                        </>
                      )}
                      Paid {new Date(bill.payment_time).toLocaleDateString()} •{" "}
                      {occupancies[bill.occupancy_id] && calculateDuration(
                        occupancies[bill.occupancy_id].entry_time,
                        occupancies[bill.occupancy_id].exit_time
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">
                      ₹{bill.amount}
                    </p>
                    <span className="text-sm text-green-300 font-semibold">
                      PAID
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && !bills.length && (
          <div className="text-center text-gray-400 py-10">Loading bills...</div>
        )}

        {!loading && bills.length === 0 && (
          <div className="bg-[#1f2937]/70 backdrop-blur-md rounded-2xl p-12 border border-gray-700 text-center">
            <p className="text-gray-400">No bills found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingPage;
