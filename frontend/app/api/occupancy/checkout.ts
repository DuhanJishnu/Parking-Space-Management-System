
import API from "../axiosInstance";

export const checkOut = async (occupancyId: number) => {
  const res = await API.post(`/occupancy/check-out/${occupancyId}`);
  return res.data;
};
