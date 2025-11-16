import API from "../axiosInstance";

export const getBilling = async (occupancyId: number) => {
  const res = await API.get(`/billing/${occupancyId}`);
  return res.data;
};