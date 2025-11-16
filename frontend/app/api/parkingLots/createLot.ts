import API from "../axiosInstance";

export interface CreateParkingLotDTO {
  name: string;
  location: string;
  capacity: number;
  base_rate: number;
  geo_location: string;
}

export const createParkingLot = async (payload: CreateParkingLotDTO) => {
  const res = await API.post("/parking-lots/", payload);
  return res.data;
};