import React, { createContext, useContext, useState, useEffect } from 'react';
import { logout as logoutApi, getRoleAPI } from '../api/auth';
import { getUserProfile } from '../api/user';

interface AuthContextType {
  isAuthenticated: boolean;
  role: 'user' | 'admin' | null;
  username: string | null;
  getRoleFromCookie: () => Promise<'user' | 'admin' | null>;
  clearCookie: () => void;
  isLoading: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  authMessage: string | null;
  setAuthLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;
  setAuthMessage: (message: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
  username: null,
  getRoleFromCookie: async () => null,
  clearCookie: () => {},
  isLoading: true,
  isAuthLoading: false,
  authError: null,
  authMessage: null,
  setAuthLoading: () => {},
  setAuthError: () => {},
  setAuthMessage: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [role, setRole] = useState<'user' | 'admin' | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

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

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (authError || authMessage) {
      const timer = setTimeout(() => {
        if (authError) setAuthError(null);
        if (authMessage) setAuthMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [authError, authMessage]);

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
    setIsAuthLoading(true);
    try {
      await logoutApi();
      setAuthMessage("Logged out successfully");
    } catch (err) {
      console.error('Logout failed', err);
      setAuthError("Logout failed, please try again");
    } finally {
      setRole(null);
      setUsername(null);
      setIsAuthenticated(false);
      setIsAuthLoading(false);
    }
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
        isAuthLoading,
        authError,
        authMessage,
        setAuthLoading: setIsAuthLoading,
        setAuthError,
        setAuthMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
