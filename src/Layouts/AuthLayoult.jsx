// AuthLayout.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const AuthLayout = ({ authRoutes }) => {
  return (
    <Routes>
      {/* Redireciona para "/auth/login" como página inicial */}
      <Route path="/" element={<Navigate to="/auth/login" />} />
      {authRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default AuthLayout;
