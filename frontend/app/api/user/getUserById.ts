import API from "../axiosInstance";

export const getUserById = async (id: number) => {
  const res = await API.get(`/users/${id}`);
  return res.data;
};
