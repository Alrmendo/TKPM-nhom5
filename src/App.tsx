import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthenticatedRoute from './components/authenticatedRoute';

// Định nghĩa interface cho route
interface RouteConfig {
  path: string;
  element: React.ReactNode;
}

// Lazy load các trang
const Home = lazy(() => import('./pages/Home/Home'));
// const PDP = lazy(() => import('./pages/PDP/PDP'));
// const PCP = lazy(() => import('./pages/PCP/PCP'));
// const Review = lazy(() => import('./pages/Payment/Review'));
// const Information = lazy(() => import('./pages/Payment/Information'));
// const Shipping = lazy(() => import('./pages/Payment/Shipping'));
// const Checkout = lazy(() => import('./pages/Payment/Checkout'));
// const Successful = lazy(() => import('./pages/Payment/Successful'));
const SearchOverlay = lazy(() => import('./pages/Search/SearchOverlay'));
const SignIn = lazy(() => import('./pages/Auth/SignIn'));
const SignUp = lazy(() => import('./pages/Auth/SignUp'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));


const isAuthenticated = false;  // // Thay bằng logic lấy từ context, Redux, hoặc state

// Cấu hình route trong một mảng
const routes: RouteConfig[] = [
  { path: '/', element: <Home /> },
  // { path: '/pdp', element: <PDP /> },
  // { path: '/pcp', element: <PCP /> },
  // { path: '/payment-review', element: <Review /> },
  // { path: '/payment-information', element: <Information /> },
  // { path: '/payment-shipping', element: <Shipping /> },
  // { path: '/payment-checkout', element: <Checkout /> },
  // { path: '/payment-successful', element: <Successful /> },
  { path: '/signin', element: <SignIn />},
  { path: '/signup', element: <SignUp />},
  { path: '/forgotpassw', element: <ForgotPassword />},
  { 
    path: '/search', 
    element: (
      <AuthenticatedRoute isAuthenticated={isAuthenticated}>
        <SearchOverlay />
      </AuthenticatedRoute>
    )
  },
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