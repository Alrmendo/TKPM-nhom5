import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy load các trang
const Home = lazy(() => import('./pages/Home/Home'));
const PDP = lazy(() => import('./pages/PDP/PDP'));
const PCP = lazy(() => import('./pages/PCP/PCP'));
const Review = lazy(() => import('./pages/Payment/Review'));
const Information = lazy(() => import('./pages/Payment/Information'));
const Shipping = lazy(() => import('./pages/Payment/Shipping'));
const Checkout = lazy(() => import('./pages/Payment/Checkout'));
const Successful = lazy(() => import('./pages/Payment/Successful'));

// Cấu hình route trong một mảng
const routes = [
  { path: '/', element: <Home /> },
  { path: '/pdp', element: <PDP /> },
  { path: '/pcp', element: <PCP /> },
  { path: '/payment-review', element: <Review /> },
  { path: '/payment-information', element: <Information /> },
  { path: '/payment-shipping', element: <Shipping /> },
  { path: '/payment-checkout', element: <Checkout /> },
  { path: '/payment-successful', element: <Successful /> },
];

function App() {
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
}

export default App;
