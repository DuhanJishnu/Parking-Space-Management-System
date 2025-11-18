import axiosInstance from '../axiosInstance';

export const createParkingSpace = async (payload: {
  lot_id: number;
  space_type: string;
  state: string;
  extra_charge: number;
}) => {
  try {
    const response = await axiosInstance.post('/parking-spaces/', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating parking space:', error);
    throw error;
  }
};
