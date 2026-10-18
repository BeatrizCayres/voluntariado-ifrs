import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../api/http';

/**
 * Área administrativa - GET /dashboard/admin
 * @returns {JSX.Element}
 */
export default function Admin() {
  const [mensagem, setMensagem] = useState('Carregando...');

  useEffect(() => {
    http
      .get('/dashboard/admin')
      .then(({ data }) => setMensagem(data.message))
      .catch((err) => setMensagem(err.response?.data?.message || 'Acesso negado'));
  }, []);

  return (
    <section className="card">
      <h1>Área Administrativa</h1>
      <p>{mensagem}</p>
      <div className="actions">
        <Link to="/events/new" className="btn">
          Cadastrar novo evento
        </Link>
      </div>
    </section>
  );
}
