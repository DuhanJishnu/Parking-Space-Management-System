import API from "../axiosInstance";

export const registerVehicle = async (payload: {
  user_id: number;
  vehicle_id: string;
  vehicle_type: string;
}) => {
  const res = await API.post("/vehicles/", payload);
  return res.data;
};