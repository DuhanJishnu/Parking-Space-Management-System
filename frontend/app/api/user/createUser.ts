import API from "../axiosInstance";

export const createUser = async (payload: {
  name: string;
  phone_number: string;
}) => {
  const res = await API.post("/users/", payload);
  return res.data;
};