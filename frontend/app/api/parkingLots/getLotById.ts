import API from "../axiosInstance";

export const getParkingLotById = async (id: number) => {
  const res = await API.get(`/parking-lots/${id}`);
  return res.data;
};