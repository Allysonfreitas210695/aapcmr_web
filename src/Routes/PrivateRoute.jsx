// PrivateRoute.js
import React, { useEffect } from 'react';
import { useAuth } from '../Context/useAuth';

//Layouts
import AdminLayout from '../Layouts/AdminLayoult';
import AuthLayout from '../Layouts/AuthLayoult';

//Routes
import { AdminRoutes } from '../Routes/AdminRoutes';
import { AuthRoutes } from '../Routes/AuthRoutes';
import { useNavigate } from 'react-router-dom';

export default function PrivateRoute() {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/admin/home');
    }
  }, [session]);

  return (
    <>
      {session ? (
        <AdminLayout adminRoutes={AdminRoutes} />
      ) : (
        <AuthLayout authRoutes={AuthRoutes} />
      )}
    </>
  );
}
