import API from "../axiosInstance";

export const createUser = async (payload: {
  name: string;
  contact_no: string;
}) => {
  const res = await API.post("/users/", payload);
  return res.data;
};