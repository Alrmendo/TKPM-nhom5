import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  role: string;
  isVerified: boolean;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateUsernameData {
  newUsername: string;
  password: string;
}

// Get user profile
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await API.get('/user/profile');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

// Update user profile
export const updateProfile = async (data: UpdateProfileData): Promise<UserProfile> => {
  try {
    const response = await API.put('/user/profile', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

// Update password
export const updatePassword = async (data: UpdatePasswordData): Promise<{ message: string }> => {
  try {
    const response = await API.put('/user/password', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update password');
  }
};

// Update username
export const updateUsername = async (data: UpdateUsernameData): Promise<UserProfile> => {
  try {
    const response = await API.put('/user/username', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update username');
  }
};

// Upload profile image
export const uploadProfileImage = async (formData: FormData): Promise<{ imageUrl: string }> => {
  try {
    const response = await API.post('/user/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to upload image');
  }
}; 