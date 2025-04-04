import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SignIn from '../pages/Auth/SignIn';
import SignUp from '../pages/Auth/SignUp';
import Home from '../pages/Home/Home';
import Search from '../pages/Search/SearchOverlay';
import Profile from '../pages/Profile/ProfilePage';
import NotFoundPage from '../pages/404/404';
import Style from '../pages/Admin/style';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

// Protected Route component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole  }) => {
  const { isAuthenticated, isLoading, role } = useAuth();
  console.log(isAuthenticated); 

  if (isLoading) {
    return <div>Đang tải...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin"  replace={false} />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/notfound" replace={false} />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/search" element = {<Search/>} />
      <Route path="/cart" element = { <NotFoundPage/>} />
      <Route path="/notfound" element = { <NotFoundPage/>} />
      <Route
        path="/admin/style"
        element={
          <ProtectedRoute >
            <Style />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute requiredRole="user">
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Route Home không cần ProtectedRoute nữa */}
      <Route path="/" element={<Home />} />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes; 