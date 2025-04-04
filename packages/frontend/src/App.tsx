import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <AppRoutes />
        </Suspense>
      </AuthProvider>
    </Router>
  );
};

export default App;
