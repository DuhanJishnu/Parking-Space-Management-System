import API from "../axiosInstance";

export const getParkingLots = async () => {
  const res = await API.get("/parking-lots/");
  return res.data;
};