import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../api/http';
import { useAuth } from '../auth/AuthContext';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { formatDate } from '../utils/formatDate';

/**
 * Lista os eventos. Qualquer visitante vê a lista; administradores
 * criam, editam e excluem eventos.
 * @returns {JSX.Element}
 */
export default function Events() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    http
      .get('/events', { params: category ? { category } : {} })
      .then(({ data }) => {
        setEvents(data);
        setError('');
      })
      .catch((err) => setError(err.response?.data?.message || 'Erro ao carregar eventos'))
      .finally(() => setLoading(false));
  }, [category]);

  /**
   * Exclui um evento após confirmação do administrador
   * @param {number} id - ID do evento
   * @returns {Promise<void>}
   */
  async function handleDelete(id) {
    if (!window.confirm('Excluir este evento?')) return;

    try {
      await http.delete(`/events/${id}`);
      setEvents((list) => list.filter((event) => event.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao excluir evento');
    }
  }

  return (
    <section className="card">
      <h1>Eventos</h1>

      {isAdmin && (
        <div className="actions">
          <Link to="/events/new" className="btn btn--lg">
            Novo evento
          </Link>
        </div>
      )}

      <div className="actions">
        <FormInput
          label="Filtrar por categoria"
          name="category"
          value={category}
          placeholder="ex.: Doação"
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      {error && <p className="alert">{error}</p>}

      {loading && <p>Carregando...</p>}

      {!loading && events.length === 0 && <p>Nenhum evento encontrado.</p>}

      {!loading && events.length > 0 && (
        <ul className="list">
          {events.map((event) => (
            <li key={event.id}>
              <span>
                <Link to={`/events/${event.id}`}>
                  <strong>{event.name}</strong>
                </Link>{' '}
                — {event.category} · {event.location} · {formatDate(event.eventDate)} · capacidade{' '}
                {event.capacity}
              </span>
              {isAdmin && (
                <div className="actions">
                  <Link to={`/events/${event.id}/edit`} className="btn">
                    Editar
                  </Link>
                  <Button onClick={() => handleDelete(event.id)}>Excluir</Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
