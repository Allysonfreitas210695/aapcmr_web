import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './Routes/AppRoutes';
import { AuthProvider } from './Context/useAuth';

//CSS
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);
