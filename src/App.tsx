import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Định nghĩa interface cho route
interface RouteConfig {
  path: string;
  element: React.ReactNode;
}

// Lazy load các trang
const Home = lazy(() => import('./pages/Home/Home'));
const NotFoundPage = lazy(() => import('./pages/404/404'));
// const PDP = lazy(() => import('./pages/PDP/PDP'));
// const PCP = lazy(() => import('./pages/PCP/PCP'));
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
  // { path: '/pdp', element: <PDP /> },
  // { path: '/pcp', element: <PCP /> },
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