import React, { createContext, useContext, useState, useEffect } from 'react';
import { logout as logoutApi, getRoleAPI } from '../api/auth';
import { getUserProfile } from '../api/user';

interface AuthContextType {
  isAuthenticated: boolean;
  role: 'user' | 'admin' | null;
  username: string | null;
  getRoleFromCookie: () => Promise<'user' | 'admin' | null>;
  clearCookie: () => void;
  isLoading: Boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
  username: null,
  getRoleFromCookie: async () => null,
  clearCookie: async () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [role, setRole] = useState<'user' | 'admin' | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('useEffect run');
    const checkLogin = async () => {
      try {
        const response = await getRoleAPI(); // Get role from /auth/me
        setRole(response.role);
        setIsAuthenticated(true);
        
        // If authenticated, get the user profile to get the username
        if (response.role) {
          try {
            const userProfile = await getUserProfile();
            setUsername(userProfile.username);
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError);
          }
        }
      } catch (error) {
        setRole(null);
        setUsername(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLogin();
  }, []);

  // Add window focus event to recheck login status
  useEffect(() => {
    const handleFocus = async () => {
      await getRoleFromCookie();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const getRoleFromCookie = async (): Promise<'user' | 'admin' | null> => {
    try {
      const res = await getRoleAPI();
      setRole(res.role);
      setIsAuthenticated(true);
      
      // If authenticated, get the user profile to get the username
      if (res.role) {
        try {
          const userProfile = await getUserProfile();
          setUsername(userProfile.username);
        } catch (profileError) {
          console.error('Error fetching user profile:', profileError);
        }
      }
      
      return res.role;
    } catch (error) {
      setRole(null);
      setUsername(null);
      setIsAuthenticated(false);
      return null;
    }
  };

  const clearCookie = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error('Logout failed', err);
    }
    setRole(null);
    setUsername(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        username,
        getRoleFromCookie,
        clearCookie,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
