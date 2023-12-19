import React from 'react';

//Pages
import Login from '../Pages/Auth/Login';
import CadastroAdm from '../Pages/Auth/CadastroAdm';
import EsqueceuSenha from '../Pages/Auth/EsqueceuSenha';

export const AuthRoutes = [
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/cadastroADM",
    element: <CadastroAdm />,
  },
  {
    path: "/auth/esqueceuSenha",
    element: <EsqueceuSenha />,
  }
];
