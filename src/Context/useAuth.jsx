import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { deleteSessionCookie, getSessionCookie, setSessionCookie } from '../helpers/Cookie.js';

import { api_POST_Unauthorize } from '../Service/api.js';

// Definindo os tipos de ação para o reducer
const actionTypes = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  LODING: "LODING",
  LODINGFINALIZE: "LODINGFINALIZE"
};

// Função reducer para manipular o estado de autenticação
const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return { ...state, session: action.payload }
    case actionTypes.LOGOUT:
      return { ...state, session: null };
    case actionTypes.LODING:
      return { ...state, loding: true };
    case actionTypes.LODINGFINALIZE:
      return { ...state, loding: false };
    default:
      return state;
  }
};

// Estado inicial
const initialState = {
  session: null,
  loding: false
};

// Criação do contexto de autenticação
const AuthContext = createContext({});

// Provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let session = getSessionCookie();
    if (session) {
      dispatch({ type: actionTypes.LOGIN, payload: session });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acessar o contexto de autenticação
export const useAuth = () => {
  const { state, dispatch } = useContext(AuthContext);
  const { session, loding } = state;

  const showLoading = (operacao = false) => {
    if (operacao)
      dispatch({ type: actionTypes.LODING });
    else
      dispatch({ type: actionTypes.LODINGFINALIZE });
  };

  const logIn = async ({ email, senha }) => {
    try {
      showLoading(true);
      let response = await api_POST_Unauthorize("Autenticante", { email, senha });
      showLoading(false);

      if (!response || !response.data)
        throw new Error("Email ou senha inválida.");

      const { data } = response;
      setSessionCookie(data);
      dispatch({ type: actionTypes.LOGIN, payload: data });
    } catch (error) {
      showLoading(false);
      throw new Error(error.message);
    }
  };


  const logout = () => {
    deleteSessionCookie();
    dispatch({ type: actionTypes.LOGOUT });
    window.location.href = "/auth/login"
  };

  return { session, logIn, logout, showLoading, loding };
};
