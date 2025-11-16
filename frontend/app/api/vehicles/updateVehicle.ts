import API from "../axiosInstance";

export const updateVehicle = async (
  id: number,
  payload: Partial<{
    vehicle_number: string;
    vehicle_type: string;
  }>
) => {
  const res = await API.put(`/vehicles/${id}`, payload);
  return res.data;
};