import API from "../axiosInstance";

export const getActiveOccupancy = async (vehicleId: number) => {
  const res = await API.get(`/occupancy/active/`);
  return res.data;
};