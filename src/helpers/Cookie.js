import Cookies from 'js-cookie';

export const setSessionCookie = (session) => {
    const expiration = session.Expires ? new Date(session.Expires) : null;
    const cookieValue = { ...session,  expires: expiration };
    Cookies.set('session', JSON.stringify(cookieValue), { expires: 7 });
}

export const getSessionCookie = () => {
    const cookie = Cookies.get('session')
    if (cookie) {
        let _cookie = JSON.parse(cookie);
        return {
            id: _cookie.id,
            email: _cookie.email,
            nome: _cookie.nome,
            perfil: _cookie.perfil,
            token: _cookie.token,
            expires: _cookie.expires
        };
    }
    return null;
}

export const deleteSessionCookie = () => {
    Cookies.remove('session');
}