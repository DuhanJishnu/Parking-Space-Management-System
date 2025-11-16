import API from "../axiosInstance";

export const payBill = async (payload: {
  occupancy_id: number;
  amount: number;
  method: string;
}) => {
  const res = await API.post("/billing/pay", payload);
  return res.data;
};