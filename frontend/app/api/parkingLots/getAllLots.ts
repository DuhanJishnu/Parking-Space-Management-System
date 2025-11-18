import axiosInstance from '../axiosInstance';

export const getAllLots = async () => {
  try {
    const response = await axiosInstance.get('/parking-lots/');
    return response.data;
  } catch (error) {
    console.error('Error fetching parking lots:', error);
    throw error;
  }
};
