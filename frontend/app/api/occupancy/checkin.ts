import API from "../axiosInstance";

export const checkIn = async (payload: {
  user_id: number;
  vehicle_id: number;
  space_id: number;
  vehicle_type: string;
}) => {
  console.log("payload in checkin : ", payload);
  const vehicleDetails = await API.post("/vehicle/", {vehicle_id: payload.vehicle_id, vehicle_type:payload.vehicle_type});
  console.log("vehicle details in checkin.ts", vehicleDetails.data);
  
  const res = await API.post("/occupancy/check-in", payload: newPayload);
  console.log("Check-in log : , res.data");
  return res.data;
};
