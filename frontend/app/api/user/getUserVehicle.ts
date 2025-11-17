import API from "../axiosInstance";

export const getUserVehicles = async (userId: number, occupancyFilter?: 'active' | 'none') => {
  let url = `/users/${userId}/vehicles`;
  
  // Add occupancy filter if provided
  if (occupancyFilter) {
    url += `?occupancy=${occupancyFilter}`;
  }
  
  const res = await API.get(url);
  return res.data;
};