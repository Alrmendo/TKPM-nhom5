import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

export interface Size {
  _id: string;
  label: string;
}

export interface Color {
  _id: string;
  name: string;
  hexCode: string;
}

// Get all sizes
export const getAllSizes = async (): Promise<Size[]> => {
  try {
    const response = await API.get('/admin/sizes');
    
    if (response.data && response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch sizes');
  } catch (error) {
    console.error('Error fetching sizes:', error);
    throw error;
  }
};

// Get all colors
export const getAllColors = async (): Promise<Color[]> => {
  try {
    const response = await API.get('/admin/colors');
    
    if (response.data && response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch colors');
  } catch (error) {
    console.error('Error fetching colors:', error);
    throw error;
  }
}; 