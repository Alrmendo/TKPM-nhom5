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
  accessToken?: string;
  message: string;
  isVerified?: boolean;
  email?: string;
}

export interface VerifyEmailData {
  email: string;
  verificationCode: string;
}

export interface RequestPasswordResetData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  resetCode: string;
  newPassword: string;
  confirmPassword: string;
}

export const register = async (data: RegisterData): Promise<{ userId: string; email: string; message: string }> => {
  try {
    const response = await API.post('/auth/register', data);
    return response.data;
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
  const response = await API.get('/auth/me'); 
  return response.data;
};

export const verifyEmail = async (data: VerifyEmailData): Promise<{ message: string }> => {
  try {
    const response = await API.post('/auth/verify-email', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Email verification failed');
  }
};

export const resendVerificationCode = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await API.post('/auth/resend-verification', { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to resend verification code');
  }
};

export const requestPasswordReset = async (data: RequestPasswordResetData): Promise<{ message: string }> => {
  try {
    const response = await API.post('/auth/forgot-password', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to request password reset');
  }
};

export const resetPassword = async (data: ResetPasswordData): Promise<{ message: string }> => {
  try {
    const response = await API.post('/auth/reset-password', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
};