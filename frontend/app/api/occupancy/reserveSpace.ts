import API from "../axiosInstance";

export const reserveSpace = async (payload: {
  user_id: number;
  vehicle_id: number;
  space_id: number;
}) => {
  const res = await API.post("/occupancy/reserve", payload);
  return res.data;
};