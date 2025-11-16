import API from "../axiosInstance";

export const deleteParkingLot = async (id: number) => {
  const res = await API.delete(`/parking-lots/${id}`);
  return res.data;
};
