import { useEffect, useState } from 'react';
import { http } from '../api/http';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { validateVolunteerForm } from '../utils/validators';

const EMPTY_FORM = { name: '', email: '', telephone: '' };

/**
 * Gerencia os voluntários
 * Os erros aparecem abaixo de cada campo e a API só é chamada com o formulário válido.
 * @returns {JSX.Element}
 */
export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  /**
   * Carrega a lista de voluntários da API
   * @returns {Promise<void>}
   */
  async function loadVolunteers() {
    try {
      const { data } = await http.get('/volunteers');
      setVolunteers(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar voluntários');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVolunteers();
  }, []);

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
   * Limpa o formulário, os erros e sai do modo de edição
   * @returns {void}
   */
  function resetForm() {
    setForm(EMPTY_FORM);
    setFieldErrors({});
    setEditingId(null);
  }

  /**
   * Preenche o formulário com os dados de um voluntário para edição
   * @param {Object} volunteer - Voluntário selecionado
   * @returns {void}
   */
  function startEditing(volunteer) {
    setForm({
      name: volunteer.name,
      email: volunteer.email,
      telephone: volunteer.telephone,
    });
    setFieldErrors({});
    setEditingId(volunteer.id);
  }

  /**
   * Valida e cria ou atualiza o voluntário conforme o modo do formulário
   * @param {React.FormEvent<HTMLFormElement>} e - Evento de envio
   * @returns {Promise<void>}
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const errors = validateVolunteerForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (editingId) {
        await http.put(`/volunteers/${editingId}`, form);
      } else {
        await http.post('/volunteers', form);
      }

      resetForm();
      await loadVolunteers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar voluntário');
    }
  }

  /**
   * Exclui um voluntário após confirmação
   * @param {number} id - ID do voluntário
   * @returns {Promise<void>}
   */
  async function handleDelete(id) {
    if (!window.confirm('Excluir este voluntário?')) return;

    try {
      await http.delete(`/volunteers/${id}`);
      setVolunteers((list) => list.filter((volunteer) => volunteer.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao excluir voluntário');
    }
  }

  return (
    <section className="card">
      <h1>Voluntários</h1>

      {error && <p className="alert">{error}</p>}

      <form onSubmit={handleSubmit} className="form" noValidate>
        <h2>{editingId ? 'Editar voluntário' : 'Novo voluntário'}</h2>
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
          label="E-mail"
          type="email"
          name="email"
          value={form.email}
          onChange={updateField}
          error={fieldErrors.email}
          required
        />
        <FormInput
          label="Telefone"
          name="telephone"
          value={form.telephone}
          placeholder="DDD + número (ex.: 54999998888)"
          onChange={updateField}
          error={fieldErrors.telephone}
          required
        />

        <div className="actions">
          <Button type="submit">{editingId ? 'Salvar alterações' : 'Cadastrar'}</Button>
          {editingId && <Button onClick={resetForm}>Cancelar</Button>}
        </div>
      </form>

      <h2>Lista</h2>
      {loading && <p>Carregando...</p>}
      {!loading && volunteers.length === 0 && <p>Nenhum voluntário cadastrado.</p>}

      {volunteers.length > 0 && (
        <ul className="list">
          {volunteers.map((volunteer) => (
            <li key={volunteer.id}>
              <span>
                {volunteer.name} · {volunteer.email} · {volunteer.telephone}
              </span>
              <div className="actions">
                <Button onClick={() => startEditing(volunteer)}>Editar</Button>
                <Button onClick={() => handleDelete(volunteer.id)}>Excluir</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
