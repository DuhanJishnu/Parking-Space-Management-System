import API from "../axiosInstance";

export const getOccupancyHistory = async (vehicleId: number) => {
  const res = await API.get(`/occupancy/history/${vehicleId}`);
  return res.data;
};