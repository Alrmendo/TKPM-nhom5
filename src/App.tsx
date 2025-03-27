import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Định nghĩa interface cho route
interface RouteConfig {
  path: string;
  element: React.ReactNode;
}

// Lazy load các trang
const Home = lazy(() => import('./pages/Home/Home'));
const Contact = lazy(() => import('./pages/Contact/contact_us'));
const NotFoundPage = lazy(() => import('./pages/404/404'));
// const PDP = lazy(() => import('./pages/PDP/PDP'));
// const PCP = lazy(() => import('./pages/PCP/PCP'));

const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'));
const OrderHistory = lazy(() => import('./pages/Profile/OrderHistory'));
const CurrentOrders = lazy(() => import('./pages/Profile/CurrentOrders'));
const TrackOrder = lazy(() => import('./pages/Profile/TrackOrder'));
const Address = lazy(() => import('./pages/Profile/Address'));
const OrderDetails = lazy(() => import('./pages/Profile/OrderDetails'));

const Review = lazy(() => import('./pages/Payment/Review'));
const Information = lazy(() => import('./pages/Payment/Information'));
const Shipping = lazy(() => import('./pages/Payment/Shipping'));
const Checkout = lazy(() => import('./pages/Payment/Checkout'));
const Successful = lazy(() => import('./pages/Payment/Successful'));

const SearchOverlay = lazy(() => import('./pages/Search/SearchOverlay'));
const Measurement = lazy(() => import('./pages/Admin/measurement'));
const Style = lazy(() => import('./pages/Admin/style'));
const Photography = lazy(() => import('./pages/Admin/photography'));
const Deliver = lazy(() => import('./pages/Admin/deliver'));
const ContactAdmin = lazy(() => import('./pages/Admin/contact_admin'));

// Cấu hình route trong một mảng
const routes: RouteConfig[] = [
  { path: '/', element: <Home /> },
  { path: '/contact', element: <Contact /> },
  // { path: '/pdp', element: <PDP /> },
  // { path: '/pcp', element: <PCP /> },
  { path: '/profile', element: <ProfilePage /> },
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
  { path: '/search', element: <SearchOverlay /> },
  { path: '*', element: <NotFoundPage /> }, // Route cho trang 404
  { path: '/admin/measurement', element: <Measurement /> },
  { path: '/admin/style', element: <Style /> },
  { path: '/admin/photography', element: <Photography /> },
  { path: '/admin/deliver', element: <Deliver /> },
  { path: '/admin/contact', element: <ContactAdmin /> },
];

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {routes.map(({ path, element }, index) => (
            <Route key={index} path={path} element={element} />
          ))}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
