// PrivateRoute.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/useAuth';


//Layouts
import AdminLayout from '../Layouts/AdminLayoult';
import AuthLayout from '../Layouts/AuthLayoult';

//Routes
import { AdminRoutes } from "../Routes/AdminRoutes"
import { AuthRoutes } from "../Routes/AuthRoutes"

export default function PrivateRoute() {
    const { session } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (session)
            navigate("/admin/home");
        else
            navigate("/auth/login");
    }, [session]);

    return (
        <>
            {session ? <AdminLayout adminRoutes={AdminRoutes} /> : <AuthLayout authRoutes={AuthRoutes} />}
        </>
    );
}