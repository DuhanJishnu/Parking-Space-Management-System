import API from "../axiosInstance";

export const getUserVehicles = async (userId: number) => {
  const res = await API.get(`/users/${userId}/vehicles`);
  return res.data;
};