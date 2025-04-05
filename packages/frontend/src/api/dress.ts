import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000', // Cập nhật URL backend của bạn
  withCredentials: true, // Cấu hình gửi cookie kèm theo request
});

// Define dress type
export interface DressVariant {
  size: {
    _id: string;
    name: string;
    description?: string;
  };
  color: {
    _id: string;
    name: string;
    hexCode: string;
  };
  stock: number;
}

export interface DressRating {
  username: string;
  rate: number;
}

export interface DressReview {
  username: string;
  reviewText: string;
  icon?: string;
  date: Date;
}

export interface DressDescription {
  productDetail: string;
  sizeAndFit: string;
  description: string;
}

export interface Dress {
  _id: string;
  name: string;
  dailyRentalPrice: number;
  purchasePrice: number;
  ratings: DressRating[];
  reviews: DressReview[];
  variants: DressVariant[];
  rentalStartDate?: Date;
  rentalEndDate?: Date;
  description: DressDescription;
  images: string[];
  style?: string;
  material?: string;
  avgRating?: number;
  reviewCount?: number;
}

// Get all dresses
export const getAllDresses = async (): Promise<Dress[]> => {
  try {
    //const response = await axios.get(`${API_URL}/dress`);
    const response = await API.get('/dress');
    
    if (response.data && response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch dresses');
  } catch (error) {
    console.error('Error fetching dresses:', error);
    throw error;
  }
};

// Get most popular dresses
export const getMostPopularDresses = async (limit: number = 5): Promise<Dress[]> => {
  try {
    const response = await API.get(`/dress/popular`, {
      params: { limit }
    });
    
    if (response.data && response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch popular dresses');
  } catch (error) {
    console.error('Error fetching popular dresses:', error);
    throw error;
  }
};

// Get dress by ID
export const getDressById = async (id: string): Promise<Dress> => {
  try {
    const response = await API.get(`/dress/${id}`);
    
    if (response.data && response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch dress');
  } catch (error) {
    console.error(`Error fetching dress with ID ${id}:`, error);
    throw error;
  }
};

// Get similar dresses
export const getSimilarDresses = async (id: string, limit: number = 4): Promise<Dress[]> => {
  try {
    const response = await API.get(`/dress/${id}/similar`, {
      params: { limit }
    });
    
    if (response.data && response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to fetch similar dresses');
  } catch (error) {
    console.error(`Error fetching similar dresses for ID ${id}:`, error);
    throw error;
  }
}; 