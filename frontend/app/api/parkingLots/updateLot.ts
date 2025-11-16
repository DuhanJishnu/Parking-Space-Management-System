import API from "../axiosInstance";

export const updateParkingLot = async (
  id: number,
  payload: Partial<{
    name: string;
    base_rate: number;
    location: string;
    capacity: number;
    geo_location: string;
  }>
) => {
  const res = await API.put(`/parking-lots/${id}`, payload);
  return res.data;
};