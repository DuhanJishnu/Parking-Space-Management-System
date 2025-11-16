import API from "../axiosInstance";

export const registerVehicle = async (payload: {
  user_id: number;
  vehicle_number: string;
  vehicle_type: string;
}) => {
  const res = await API.post("/vehicles/", payload);
  return res.data;
};