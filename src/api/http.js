import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://localhost:3000',
});

// Interceptor de REQUEST: anexa o Bearer se houver token no localStorage
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor de RESPONSE: encerra a sessão quando o token expirou ou é inválido.
// Erros de login (credenciais) e de permissão (403 por papel) não derrubam a sessão.
http.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;
    const isLoginRequest = error?.config?.url?.startsWith('/auth/login');
    const hasSession = Boolean(localStorage.getItem('token'));
    const isSessionExpired = status === 401 || message === 'Token inválido ou expirado';

    if (hasSession && isSessionExpired && !isLoginRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  },
);
