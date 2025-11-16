import API from "../axiosInstance";

export const getVehicleHistory = async (vehicleId: number) => {
  const res = await API.get(`/vehicles/${vehicleId}/history`);
  return res.data;
};