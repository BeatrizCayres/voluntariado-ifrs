import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { http } from '../api/http';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { validateEventForm } from '../utils/validators';

const EMPTY_FORM = {
  name: '',
  category: '',
  location: '',
  eventDate: '',
  capacity: '',
};

/**
 * Formulário para criar ou editar um evento (admin).
 * Os erros aparecem abaixo de cada campo; a API só é chamada com o formulário válido.
 * @returns {JSX.Element}
 */
export default function EventForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    http
      .get(`/events/${id}`)
      .then(({ data }) =>
        setForm({
          name: data.name,
          category: data.category,
          location: data.location,
          eventDate: data.eventDate.slice(0, 10),
          capacity: String(data.capacity),
        }),
      )
      .catch((err) => setError(err.response?.data?.message || 'Erro ao carregar evento'));
  }, [id, isEdit]);

  /**
   * Atualiza um campo e limpa o erro desse campo
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de alteração
   * @returns {void}
   */
  function updateField(e) {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  /**
   * Valida e envia o formulário para criar ou atualizar o evento
   * @param {React.FormEvent<HTMLFormElement>} e - Evento de envio
   * @returns {Promise<void>}
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const errors = validateEventForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    const payload = { ...form, capacity: Number(form.capacity) };

    try {
      if (isEdit) {
        await http.put(`/events/${id}`, payload);
      } else {
        await http.post('/events', payload);
      }

      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar evento');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card">
      <h1>{isEdit ? 'Editar evento' : 'Novo evento'}</h1>

      {error && <p className="alert">{error}</p>}

      <form onSubmit={handleSubmit} className="form" noValidate>
        <FormInput
          label="Nome"
          name="name"
          value={form.name}
          placeholder="mínimo 8 caracteres"
          onChange={updateField}
          error={fieldErrors.name}
          required
        />
        <FormInput
          label="Categoria"
          name="category"
          value={form.category}
          placeholder="ex.: Doação"
          onChange={updateField}
          error={fieldErrors.category}
          required
        />
        <FormInput
          label="Local"
          name="location"
          value={form.location}
          onChange={updateField}
          error={fieldErrors.location}
          required
        />
        <FormInput
          label="Data"
          type="date"
          name="eventDate"
          value={form.eventDate}
          onChange={updateField}
          error={fieldErrors.eventDate}
          required
        />
        <FormInput
          label="Capacidade (máximo de voluntários)"
          type="number"
          name="capacity"
          value={form.capacity}
          min="1"
          onChange={updateField}
          error={fieldErrors.capacity}
          required
        />

        <div className="actions">
          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </section>
  );
}
