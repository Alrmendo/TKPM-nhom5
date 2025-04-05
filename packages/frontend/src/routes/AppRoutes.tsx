import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { lazy, Suspense } from 'react';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';

// Lazy load pages
const Home = lazy(() => import('../pages/Home/Home'));
const Contact = lazy(() => import('../pages/Contact/contact_us'));
const NotFoundPage = lazy(() => import('../pages/404/404'));
const PDP = lazy(() => import('../pages/PDP/PDP'));
const PCP = lazy(() => import('../pages/PCP/PCP'));
const ProfilePage = lazy(() => import('../pages/Profile/ProfilePage'));
const OrderHistory = lazy(() => import('../pages/Profile/OrderHistory'));
const CurrentOrders = lazy(() => import('../pages/Profile/CurrentOrders'));
const TrackOrder = lazy(() => import('../pages/Profile/TrackOrder'));
const Address = lazy(() => import('../pages/Profile/Address'));
const OrderDetails = lazy(() => import('../pages/Profile/OrderDetails'));
const Review = lazy(() => import('../pages/Payment/Review'));
const Information = lazy(() => import('../pages/Payment/Information'));
const Shipping = lazy(() => import('../pages/Payment/Shipping'));
const Checkout = lazy(() => import('../pages/Payment/Checkout'));
const Successful = lazy(() => import('../pages/Payment/Successful'));
const SearchOverlay = lazy(() => import('../pages/Search/SearchOverlay'));
const Measurement = lazy(() => import('../pages/Admin/measurement'));
const Style = lazy(() => import('../pages/Admin/style'));
const Photography = lazy(() => import('../pages/Admin/photography'));
const Deliver = lazy(() => import('../pages/Admin/deliver'));
const ContactAdmin = lazy(() => import('../pages/Admin/contact_admin'));
const SignIn = lazy(() => import('../pages/Auth/SignIn'));
const SignUp = lazy(() => import('../pages/Auth/SignUp'));
const VerifyEmail = lazy(() => import('../pages/Auth/VerifyEmail'));
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/Auth/ResetPassword'));
const Cart = lazy(() => import('../pages/Cart/Cart'));
const AboutPage = lazy(() => import('../pages/About/About'));

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

// Protected Route component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return <LoadingOverlay message="Verifying your account..." fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace={true} />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/notfound" replace={true} />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {

  const routes = [
    { path: '/', element: <Home /> },
    { path: '/contact', element: <Contact /> },
    { path: '/pdp', element: <PDP /> },
    { path: '/pdp/:id', element: <PDP /> },
    { path: '/pcp', element: <PCP /> },
    {
      path: '/profile',
      element: (
        <ProtectedRoute requiredRole="user">
          <ProfilePage />
        </ProtectedRoute>
      ),
    },
    { path: '/order-history', element: <OrderHistory /> },
    { path: '/current-orders', element: <CurrentOrders /> },
    { path: '/track-order', element: <TrackOrder /> },
    { path: '/address', element: <Address /> },
    { path: '/order-details/:id', element: <OrderDetails /> },
    { path: '/payment-review', element: <Review /> },
    { path: '/payment-information', element: <Information /> },
    { path: '/payment-shipping', element: <Shipping /> },
    { path: '/payment-checkout', element: <Checkout /> },
    { path: '/payment-successful', element: <Successful /> },
    {
      path: '/admin/measurement',
      element: (
        <ProtectedRoute requiredRole="admin">
          <Measurement />
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/style',
      element: (
        <ProtectedRoute requiredRole="admin">
          <Style />
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/photography',
      element: (
        <ProtectedRoute requiredRole="admin">
          <Photography />
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/deliver',
      element: (
        <ProtectedRoute requiredRole="admin">
          <Deliver />
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/contact',
      element: (
        <ProtectedRoute requiredRole="admin">
          <ContactAdmin />
        </ProtectedRoute>
      ),
    },
    { path: '/signin', element: <SignIn /> },
    { path: '/signup', element: <SignUp /> },
    { path: '/verify-email', element: <VerifyEmail /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/reset-password', element: <ResetPassword /> },
    { path: '/cart', element: <Cart /> },
    { path: '/about', element: <AboutPage /> },
    { path: '/search', element: <SearchOverlay />},
    { path: '*', element: <NotFoundPage /> },
  ];

  return (
    <Suspense fallback={<LoadingOverlay message="Loading page..." fullScreen />}>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
