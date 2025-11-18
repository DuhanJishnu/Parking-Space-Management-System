import axiosInstance from '../axiosInstance';

export const getSpacesByLot = async (lotId: number) => {
  try {
    const response = await axiosInstance.get(`/parking-lots/${lotId}/spaces`);
    return response.data;
  } catch (error) {
    console.error('Error fetching parking spaces:', error);
    throw error;
  }
};
