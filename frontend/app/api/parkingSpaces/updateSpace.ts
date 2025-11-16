import API from "../axiosInstance";

export const updateParkingSpace = async (
  id: number,
  payload: Partial<{ state: string; extra_charge: number }>
) => {
  const res = await API.put(`/parking-spaces/${id}`, payload);
  return res.data;
};