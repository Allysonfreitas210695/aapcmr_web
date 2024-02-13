import Cookies from 'js-cookie';

export const setSessionCookie = (session) => {
  const expiration = session.expires != null ? new Date(session.expires) : null;
  const cookieValue = { ...session, expires: expiration };
  Cookies.set('session', JSON.stringify(cookieValue), { expires: 2 });
};

export const getSessionCookie = () => {
  const cookie = Cookies.get('session');
  if (cookie) {
    let _cookie = JSON.parse(cookie);
    return {
      id: _cookie.id,
      nome: _cookie.nome,
      token: _cookie.token,
      expires: _cookie.expires
    };
  }
  return null;
};

export const deleteSessionCookie = () => {
  Cookies.remove('session');
};
