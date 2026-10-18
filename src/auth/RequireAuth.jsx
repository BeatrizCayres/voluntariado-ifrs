import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
export default function RequireAuth({ children }) {
  const { token, loading } = useAuth();
  const location = useLocation();
  // Enquanto restaura a sessão
  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <p>Carregando sessão...</p>
      </div>
    );
  }
  // Sem token manda para /login e guarda onde o usuário queria ir
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // Com token válido permite acesso
  return children;
}
