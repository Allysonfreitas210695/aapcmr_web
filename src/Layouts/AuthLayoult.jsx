// AuthLayout.js
import React from 'react';
import {Routes, Route } from 'react-router-dom';

const AuthLayout = ({ authRoutes }) => {
    return (
        <Routes>
            {authRoutes.map((route, index) => (
                <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                />
            ))}
        </Routes>
    );
};

export default AuthLayout;
