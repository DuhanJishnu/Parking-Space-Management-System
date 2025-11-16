import API from "../axiosInstance";

export const getRevenue = async () => {
  const res = await API.get("/billing/revenue");
  return res.data;
};