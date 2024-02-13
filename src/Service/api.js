import { deleteSessionCookie, getSessionCookie } from '../helpers/Cookie.js';
import { api } from './baseURL.js';

const createHeaders = (session, contentType, validate_auth) => {
  const headers = {
    'Content-Type': contentType,
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0'
  };

  if (validate_auth && session) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  return { headers };
};

const handleErrorResponse = (error) => {
  if (error.response) {
    if (error.response.status === 401 || error.response.status === 403) {
      return {
        status: error.response.status,
        message: 'Sua sessão expirou. Realize o acesso novamente'
      };
    } else {
      try {
        return {
          status: error.response.data.status,
          message: error.response.data
            ? error.response.data.message
            : error.response.message
        };
      } catch {
        return { status: 500, message: 'Erro ao conectar com API' };
      }
    }
  } else {
    return { status: 500, message: 'Erro ao conectar com API' };
  }
};

const handleSessionExpiration = (session) => {
  const now = new Date();
  const expiration = new Date(session.expires);
  if (expiration < now) {
    deleteSessionCookie();
    return true;
  }
  return false;
};

const makeRequest = async (
  method,
  endpoint,
  obj = null,
  contentType = 'application/json',
  validate_auth = true
) => {
  //pegando as informaçoes do cookie
  let session = getSessionCookie();

  if (validate_auth && handleSessionExpiration(session)) {
    window.location.href = '/auth/login';
  }

  //Configuração de header de envior
  const config = createHeaders(session, contentType, validate_auth);

  try {
    const response = await api.request({
      method,
      url: endpoint,
      data: JSON.stringify(obj),
      ...config
    });
    return {
      status: response.status,
      message: response.data.message,
      data: response.data
    };
  } catch (error) {
    return Promise.reject(handleErrorResponse(error));
  }
};

const api_POST = async (endpoint, obj, contentType) =>
  makeRequest('POST', endpoint, obj, contentType);

const api_PUT = async (endpoint, obj) => makeRequest('PUT', endpoint, obj);

const api_DELETE = async (endpoint, obj) =>
  makeRequest('DELETE', endpoint, obj);

const api_GET = async (endpoint) => makeRequest('GET', endpoint);

const api_GET_Unauthorize = async (endpoint) =>
  makeRequest('GET', endpoint, null, 'application/json', false);

const api_POST_Unauthorize = async (endpoint, obj) =>
  makeRequest('POST', endpoint, obj, 'application/json', false);

export {
  api_POST,
  api_POST_Unauthorize,
  api_PUT,
  api_DELETE,
  api_GET,
  api_GET_Unauthorize
};
