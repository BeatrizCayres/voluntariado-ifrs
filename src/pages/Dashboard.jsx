import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../api/http';

/**
 * Painel do usuário autenticado, carregado de GET /dashboard
 * @returns {JSX.Element}
 */
export default function Dashboard() {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    http
      .get('/dashboard')
      .then(({ data }) => setInfo(data))
      .catch((err) => setError(err.response?.data?.message || 'Erro ao carregar painel'));
  }, []);

  return (
    <section className="card">
      <h1>Dashboard</h1>

      {error && <p className="alert">{error}</p>}
      {!info && !error && <p>Carregando...</p>}

      {info && (
        <>
          <p>
            {info.message}, {info.user} ({info.role}).
          </p>
          <div className="actions">
            <Link to="/events" className="btn">
              Ver eventos
            </Link>
            <Link to="/volunteers" className="btn">
              Gerenciar voluntários
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
