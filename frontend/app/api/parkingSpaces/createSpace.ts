import API from "../axiosInstance";

export const createParkingSpace = async (payload: {
  lot_id: number;
  space_type: string;
  state: string;
  extra_charge: number;
}) => {
  const res = await API.post("/parking-spaces/", payload);
  return res.data;
};