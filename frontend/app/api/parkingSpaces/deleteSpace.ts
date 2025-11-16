import API from "../axiosInstance";

export const deleteParkingSpace = async (id: number) => {
  const res = await API.delete(`/parking-spaces/${id}`);
  return res.data;
}