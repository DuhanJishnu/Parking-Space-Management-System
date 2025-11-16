import API from "../axiosInstance";

export const getVehicles = async () => {
  const res = await API.get("/vehicles/");
  return res.data;
};