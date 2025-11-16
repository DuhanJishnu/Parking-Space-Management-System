import API from "../axiosInstance";

export const getLotSpaces = async (lotId: number) => {
  const res = await API.get(`/parking-lots/${lotId}/spaces`);
  return res.data;
};