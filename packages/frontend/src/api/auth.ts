import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000', // Cập nhật URL backend của bạn
  withCredentials: true, // Cấu hình gửi cookie kèm theo request
});


export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

export const register = async (data: RegisterData): Promise<void> => {
  try {
    await API.post('/auth/register', data);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {

    const response = await API.post('/auth/login', data);
    console.log("login in auth.ts");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}; 

export const logout = async (): Promise<void> => {
  try {
    await API.post('/auth/logout');

  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
}

export const getRoleAPI = async () => {
  const response = await API.get('/auth/me'); // API đã có withCredentials: true
  return response.data;
};