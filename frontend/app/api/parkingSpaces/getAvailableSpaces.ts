import API from "../axiosInstance";

export const getAvailableSpaces = async (params?: {
  lot_id?: number;
  space_type?: string;
}) => {
  const res = await API.get("/parking-spaces/available", { params });
  return res.data;
};