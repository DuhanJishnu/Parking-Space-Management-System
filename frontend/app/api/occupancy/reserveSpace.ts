import API from "../axiosInstance";

export const reserveSpace = async (payload: {
  space_id: number;
}) => {
  const res = await API.post("/occupancy/reserve", payload);
  return res.data;
};