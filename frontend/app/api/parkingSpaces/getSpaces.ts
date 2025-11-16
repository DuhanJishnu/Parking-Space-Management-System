import API from "../axiosInstance";

export const getParkingSpaces = async (params?: {
  lot_id?: number;
  space_type?: string;
  state?: string;
}) => {
  const res = await API.get("/parking-spaces/", { params });
  return res.data;
};