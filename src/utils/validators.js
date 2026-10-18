/**
 * Validações dos formulários, espelhando as regras do back-end
 * (src/services/eventService.js e src/services/volunteerService.js).
 * Cada função devolve { campo: mensagem }; objeto vazio significa formulário válido.
 */

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida o formulário de evento
 * @param {Object} form - Campos do formulário
 * @returns {Object<string, string>} Erros por campo
 */
export function validateEventForm(form) {
  const errors = {};
  const name = form.name.trim();
  const capacity = Number(form.capacity);

  if (!name) {
    errors.name = 'Campo obrigatório';
  } else if (name.length < 8) {
    errors.name = 'O nome deve ter no mínimo 8 caracteres';
  }

  if (!form.category.trim()) errors.category = 'Campo obrigatório';
  if (!form.location.trim()) errors.location = 'Campo obrigatório';

  if (!form.eventDate) {
    errors.eventDate = 'Campo obrigatório';
  } else if (!DATE_PATTERN.test(form.eventDate)) {
    errors.eventDate = 'Data inválida';
  }

  if (form.capacity === '') {
    errors.capacity = 'Campo obrigatório';
  } else if (!Number.isInteger(capacity) || capacity < 1) {
    errors.capacity = 'A capacidade deve ser no mínimo 1';
  }

  return errors;
}

/**
 * Valida o formulário de voluntário
 * @param {Object} form - Campos do formulário
 * @returns {Object<string, string>} Erros por campo
 */
export function validateVolunteerForm(form) {
  const errors = {};
  const name = form.name.trim();
  const digits = form.telephone.replace(/\D/g, '');

  if (!name) {
    errors.name = 'Campo obrigatório';
  } else if (name.length < 8) {
    errors.name = 'O nome deve ter no mínimo 8 caracteres';
  }

  if (!form.email) {
    errors.email = 'Campo obrigatório';
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = 'Informe um e-mail válido';
  }

  if (!digits) {
    errors.telephone = 'Campo obrigatório';
  } else if (digits.length < 11) {
    errors.telephone = 'O telefone deve ter no mínimo 11 dígitos (DDD + número)';
  }

  return errors;
}
