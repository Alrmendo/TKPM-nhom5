import React, { createContext, useContext, useState, useEffect } from 'react';
import { logout as logoutApi, getRoleAPI } from '../api/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  role: 'user' | 'admin' | null;
  getRoleFromCookie: () => Promise<'user' | 'admin' | null>; // Thay đổi kiểu trả về
  clearCookie: () => void;
  isLoading: Boolean,
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
  getRoleFromCookie: async () => null, // Thêm async để khớp kiểu
  clearCookie: async () => {},
  isLoading: true, 
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<'user' | 'admin' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Thêm trạng thái isLoading

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await getRoleAPI(); // Gọi /auth/me
        setRole(response.role);
        setIsAuthenticated(true);
      } catch (error) {
        setRole(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); // Kết thúc quá trình kiểm tra
      }
    };

    checkLogin();
  }, []);

  // Thêm sự kiện window focus để kiểm tra lại trạng thái đăng nhập
  useEffect(() => {
    const handleFocus = async () => {
      await getRoleFromCookie();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const getRoleFromCookie = async (): Promise<'user' | 'admin' | null> => {
    try {
      const res = await getRoleAPI(); // Gọi /auth/me
      setRole(res.role);
      setIsAuthenticated(true);
      return res.role; // Trả về role
    } catch (error) {
      setRole(null);
      setIsAuthenticated(false);
      return null;
    }
  };


  const clearCookie = async () => {
    try {
      await logoutApi(); // Gọi API logout để server xóa cookie
    } catch (err) {
      console.error('Logout failed', err);
    }
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, getRoleFromCookie, clearCookie, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}; 