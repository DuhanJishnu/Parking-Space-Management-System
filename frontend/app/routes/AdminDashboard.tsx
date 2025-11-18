import React, { useState, useEffect } from "react";
import { getAllLots } from "~/api/parkingLots/getAllLots";
import { createParkingLot } from "~/api/parkingLots/createLot";
import { updateParkingLot } from "~/api/parkingLots/updateLot";
import { deleteParkingLot } from "~/api/parkingLots/deleteLot";
import { createParkingSpace } from "~/api/parkingSpaces/createParkingSpace";
import { getSpacesByLot } from "~/api/parkingSpaces/getSpacesByLot";
import { deleteParkingSpace } from "~/api/parkingSpaces/deleteSpace";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"lots" | "spaces">("lots");
  const [parkingLots, setParkingLots] = useState([]);
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [selectedLot, setSelectedLot] = useState<number | null>(null);
  const [selectedLotName, setSelectedLotName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states for parking lot
  const [lotForm, setLotForm] = useState({
    name: "",
    location: "",
    capacity: "",
    base_rate: "",
    geo_location: "",
  });

  // Form states for parking space
  const [spaceForm, setSpaceForm] = useState({
    space_type: "4W",
    state: "unoccupied",
    extra_charge: "",
  });

  // Edit states
  const [editingLot, setEditingLot] = useState<any>(null);

  // Fetch parking lots
  const fetchLots = async () => {
    setLoading(true);
    try {
      const res = await getAllLots();
      setParkingLots(res.data || []);
    } catch (error) {
      console.error("Error fetching lots:", error);
    }
    setLoading(false);
  };

  // Fetch spaces for selected lot
  const fetchSpaces = async (lotId: number, lotName: string) => {
    setLoading(true);
    try {
      const res = await getSpacesByLot(lotId);
      setParkingSpaces(res.data || []);
      setSelectedLot(lotId);
      setSelectedLotName(lotName);
    } catch (error) {
      console.error("Error fetching spaces:", error);
      setParkingSpaces([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLots();
  }, []);

  // Handle add/update lot
  const handleAddLot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lotForm.name || !lotForm.location || !lotForm.capacity || !lotForm.base_rate) {
      alert("Please fill all fields");
      return;
    }

    try {
      const payload = {
        name: lotForm.name,
        location: lotForm.location,
        capacity: parseInt(lotForm.capacity),
        base_rate: parseFloat(lotForm.base_rate),
        geo_location: lotForm.geo_location,
      };

      if (editingLot) {
        await updateParkingLot(editingLot.id, payload);
        alert("Parking lot updated successfully");
        setEditingLot(null);
      } else {
        await createParkingLot(payload);
        alert("Parking lot created successfully");
      }

      setLotForm({
        name: "",
        location: "",
        capacity: "",
        base_rate: "",
        geo_location: "",
      });
      fetchLots();
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving parking lot");
    }
  };

  // Handle add space
  const handleAddSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLot || !spaceForm.extra_charge) {
      alert("Please fill all fields");
      return;
    }

    try {
      const payload = {
        lot_id: selectedLot,
        space_type: spaceForm.space_type,
        state: spaceForm.state,
        extra_charge: parseFloat(spaceForm.extra_charge),
      };

      await createParkingSpace(payload);
      alert("Parking space created successfully");
      setSpaceForm({ space_type: "4W", state: "unoccupied", extra_charge: "" });
      if (selectedLot && selectedLotName) {
        fetchSpaces(selectedLot, selectedLotName);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating parking space");
    }
  };

  // Handle delete lot
  const handleDeleteLot = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this parking lot?")) {
      try {
        await deleteParkingLot(id);
        alert("Parking lot deleted successfully");
        fetchLots();
      } catch (error: any) {
        console.error("Error:", error);
        const errorMsg = error.response?.data?.error || error.message || "Error deleting parking lot";
        alert(`Failed to delete parking lot: ${errorMsg}`);
      }
    }
  };

  // Handle delete space
  const handleDeleteSpace = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this parking space?")) {
      try {
        await deleteParkingSpace(id);
        alert("Parking space deleted successfully");
        if (selectedLot && selectedLotName) {
          fetchSpaces(selectedLot, selectedLotName);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error deleting parking space");
      }
    }
  };

  // Handle edit lot
  const handleEditLot = (lot: any) => {
    setEditingLot(lot);
    setLotForm({
      name: lot.name,
      location: lot.location,
      capacity: lot.capacity.toString(),
      base_rate: lot.base_rate.toString(),
      geo_location: lot.geo_location,
    });
    setActiveTab("lots");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111827] to-[#1f2937] text-white font-[Baloo Bhai 2]">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-gray-700 p-6">
        <h1 className="text-4xl font-bold text-vsyellow">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">Manage parking lots and spaces</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 bg-black/30">
        <button
          onClick={() => setActiveTab("lots")}
          className={`flex-1 py-4 px-6 font-semibold text-lg transition-all ${
            activeTab === "lots"
              ? "border-b-2 border-vsyellow text-vsyellow"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          Parking Lots
        </button>
        <button
          onClick={() => setActiveTab("spaces")}
          className={`flex-1 py-4 px-6 font-semibold text-lg transition-all ${
            activeTab === "spaces"
              ? "border-b-2 border-vsyellow text-vsyellow"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          Parking Spaces
        </button>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Parking Lots Tab */}
        {activeTab === "lots" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-1">
              <div className="bg-[#1f2937]/70 backdrop-blur-md rounded-2xl p-6 border border-gray-700 sticky top-6">
                <h2 className="text-2xl font-bold text-vsyellow mb-6">
                  {editingLot ? "Edit Parking Lot" : "Add Parking Lot"}
                </h2>
                <form onSubmit={handleAddLot} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Name</label>
                    <input
                      type="text"
                      value={lotForm.name}
                      onChange={(e) =>
                        setLotForm({ ...lotForm, name: e.target.value })
                      }
                      className="w-full bg-[#111827] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-vsyellow"
                      placeholder="e.g., Downtown Parking"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={lotForm.location}
                      onChange={(e) =>
                        setLotForm({ ...lotForm, location: e.target.value })
                      }
                      className="w-full bg-[#111827] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-vsyellow"
                      placeholder="e.g., 123 Main St"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Capacity</label>
                    <input
                      type="number"
                      value={lotForm.capacity}
                      onChange={(e) =>
                        setLotForm({ ...lotForm, capacity: e.target.value })
                      }
                      className="w-full bg-[#111827] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-vsyellow"
                      placeholder="e.g., 50"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Base Rate (₹/hour)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={lotForm.base_rate}
                      onChange={(e) =>
                        setLotForm({ ...lotForm, base_rate: e.target.value })
                      }
                      className="w-full bg-[#111827] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-vsyellow"
                      placeholder="e.g., 5.0"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Geo Location (lat,long)
                    </label>
                    <input
                      type="text"
                      value={lotForm.geo_location}
                      onChange={(e) =>
                        setLotForm({
                          ...lotForm,
                          geo_location: e.target.value,
                        })
                      }
                      className="w-full bg-[#111827] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-vsyellow"
                      placeholder="e.g., 40.7128,-74.0060"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-[#facc15] to-[#f59e0b] text-black font-semibold py-2 rounded-lg hover:shadow-lg transition-all"
                    >
                      {editingLot ? "Update" : "Add"} Lot
                    </button>
                    {editingLot && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingLot(null);
                          setLotForm({
                            name: "",
                            location: "",
                            capacity: "",
                            base_rate: "",
                            geo_location: "",
                          });
                        }}
                        className="flex-1 bg-gray-600 text-white font-semibold py-2 rounded-lg hover:bg-gray-700 transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Lots List */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-vsyellow mb-6">
                All Parking Lots ({parkingLots.length})
              </h2>
              {loading ? (
                <div className="text-center text-gray-400">Loading...</div>
              ) : parkingLots.length === 0 ? (
                <div className="text-center text-gray-400">
                  No parking lots found
                </div>
              ) : (
                <div className="space-y-4">
                  {parkingLots.map((lot: any) => (
                    <div
                      key={lot.id}
                      className="bg-[#1f2937]/70 backdrop-blur-md rounded-xl p-5 border border-gray-700 hover:border-vsyellow transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-vsyellow">
                            {lot.name}
                          </h3>
                          <p className="text-gray-400">{lot.location}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditLot(lot)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteLot(lot.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-400">Capacity</p>
                          <p className="text-vsyellow font-bold">{lot.capacity}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Base Rate</p>
                          <p className="text-vsyellow font-bold">
                            ₹{lot.base_rate}/hr
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Available Spaces</p>
                          <p className="text-vsyellow font-bold">
                            {lot.total_available_spaces !== undefined && lot.total_available_spaces !== null
                              ? lot.total_available_spaces
                              : "Loading..."}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          fetchSpaces(lot.id, lot.name);
                          setActiveTab("spaces");
                        }}
                        className="w-full mt-4 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-all"
                      >
                        View Spaces
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Parking Spaces Tab */}
        {activeTab === "spaces" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-1">
              <div className="bg-[#1f2937]/70 backdrop-blur-md rounded-2xl p-6 border border-gray-700 sticky top-6">
                <h2 className="text-2xl font-bold text-vsyellow mb-6">
                  Add Parking Space
                </h2>

                {selectedLot ? (
                  <>
                    <div className="mb-4 p-3 bg-blue-900/50 rounded-lg border border-blue-700">
                      <p className="text-sm text-gray-300">
                        Selected Lot ID: <span className="font-bold text-vsyellow">{selectedLot}</span>
                      </p>
                    </div>
                    <form onSubmit={handleAddSpace} className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">
                          Space Type
                        </label>
                        <select
                          value={spaceForm.space_type}
                          onChange={(e) =>
                            setSpaceForm({
                              ...spaceForm,
                              space_type: e.target.value,
                            })
                          }
                          className="w-full bg-[#111827] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-vsyellow"
                        >
                          <option value="2W">2 Wheeler</option>
                          <option value="4W">4 Wheeler</option>
                          <option value="EV">EV</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-2">
                          State
                        </label>
                        <select
                          value={spaceForm.state}
                          onChange={(e) =>
                            setSpaceForm({ ...spaceForm, state: e.target.value })
                          }
                          className="w-full bg-[#111827] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-vsyellow"
                        >
                          <option value="unoccupied">Unoccupied</option>
                          <option value="occupied">Occupied</option>
                          <option value="reserved">Reserved</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-2">
                          Extra Charge (₹)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={spaceForm.extra_charge}
                          onChange={(e) =>
                            setSpaceForm({
                              ...spaceForm,
                              extra_charge: e.target.value,
                            })
                          }
                          className="w-full bg-[#111827] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-vsyellow"
                          placeholder="e.g., 0.0"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#facc15] to-[#f59e0b] text-black font-semibold py-2 rounded-lg hover:shadow-lg transition-all"
                      >
                        Add Space
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center text-gray-400">
                    Select a parking lot to add spaces
                  </div>
                )}
              </div>
            </div>

            {/* Spaces List */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-vsyellow mb-6">
                Parking Spaces {selectedLotName && `(${selectedLotName})`}
              </h2>
              {loading ? (
                <div className="text-center text-gray-400">Loading...</div>
              ) : selectedLot && parkingSpaces.length === 0 ? (
                <div className="text-center text-gray-400">
                  No parking spaces found for this lot
                </div>
              ) : !selectedLot ? (
                <div className="text-center text-gray-400">
                  Select a lot from the "Parking Lots" tab to view spaces
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {parkingSpaces.map((space: any) => (
                    <div
                      key={space.id}
                      className="bg-[#1f2937]/70 backdrop-blur-md rounded-xl p-4 border border-gray-700 hover:border-vsyellow transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-vsyellow">
                            Space #{space.id}
                          </h3>
                          <p className="text-gray-400">Type: {space.space_type}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteSpace(space.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm"
                          >
                            Delete
                          </button>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              space.state === "unoccupied"
                                ? "bg-green-900/50 text-green-300"
                                : space.state === "occupied"
                                ? "bg-red-900/50 text-red-300"
                                : space.state === "reserved"
                                ? "bg-yellow-900/50 text-yellow-300"
                                : "bg-gray-900/50 text-gray-300"
                            }`}
                          >
                            {space.state}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-400">
                          Extra Charge: <span className="text-vsyellow">₹{space.extra_charge}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
