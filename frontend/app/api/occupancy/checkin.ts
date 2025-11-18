import API from "../axiosInstance";

export const checkIn = async (payload: {
  user_id: number;
  vehicle_id: number;
  space_id: number;
}) => {
  const res = await API.post("/occupancy/check-in", {...payload ,vehicle_registration: payload.vehicle_id});
  console.log("Check-in log : , res.data");
  return res.data;
};