import API from "../axiosInstance";

export const getVehicleById = async (id: number) => {
  const res = await API.get(`/vehicles/${id}`);
  return res.data;
};
