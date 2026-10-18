/**
 * @module services/VolunteerService
 * @description Camada de regras de negócio para voluntários
 */
const VolunteerModel = require('../models/volunteerModel');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Mantém apenas os dígitos de um texto (ex.: telefone com máscara)
 * @param {string} [value] - Texto a limpar
 * @returns {string}
 */
function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

/**
 * @class VolunteerService
 */
class VolunteerService {
  /**
   * Lista todos os voluntários
   * @returns {Promise<Array<Object>>} Lista de voluntários
   */
  static async getAllVolunteers() {
    return VolunteerModel.findAll();
  }

  /**
   * Busca voluntário por ID
   * @param {number|string} id - ID do voluntário
   * @returns {Promise<Object>} Voluntário encontrado
   * @throws {Error} Se o voluntário não existir
   */
  static async getVolunteerById(id) {
    const volunteer = await VolunteerModel.findById(id);

    if (!volunteer) {
      throw new Error('Voluntário não encontrado');
    }

    return volunteer;
  }

  /**
   * Valida os dados de um voluntário
   * @param {Object} volunteer - Dados do voluntário
   * @param {string} volunteer.name - Nome (mínimo 8 caracteres)
   * @param {string} volunteer.email - E-mail
   * @param {string} volunteer.telephone - Telefone (mínimo 11 dígitos: DDD + número)
   * @throws {Error} Se algum campo for inválido ('Dados do voluntário inválidos')
   * @returns {void}
   */
  static validateVolunteer({ name, email, telephone }) {
    const isValidName = (name || '').trim().length >= 8;
    const isValidEmail = EMAIL_PATTERN.test((email || '').trim());
    const isValidPhone = onlyDigits(telephone).length >= 11;

    if (!isValidName || !isValidEmail || !isValidPhone) {
      throw new Error('Dados do voluntário inválidos');
    }
  }

  /**
   * Converte os dados já validados para o formato gravado no banco
   * (nome e e-mail sem espaços nas pontas, telefone só com dígitos)
   * @param {Object} volunteer - Dados validados
   * @returns {{name: string, email: string, telephone: string}}
   */
  static normalizeVolunteer({ name, email, telephone }) {
    return {
      name: name.trim(),
      email: email.trim(),
      telephone: onlyDigits(telephone),
    };
  }

  /**
   * Cadastra novo voluntário
   * @param {Object} volunteer - Dados do voluntário
   * @returns {Promise<Object>} Mensagem e ID do voluntário criado
   * @throws {Error} Se os dados forem inválidos
   * @throws {Error} Se o e-mail já estiver cadastrado
   */
  static async createVolunteer(volunteer) {
    this.validateVolunteer(volunteer);
    const data = this.normalizeVolunteer(volunteer);

    if (await VolunteerModel.findByEmail(data.email)) {
      throw new Error('Voluntário já cadastrado');
    }

    const id = await VolunteerModel.create(data);

    return {
      message: 'Voluntário cadastrado com sucesso',
      id,
    };
  }

  /**
   * Atualiza voluntário existente
   * @param {number|string} id - ID do voluntário
   * @param {Object} volunteer - Dados atualizados
   * @returns {Promise<Object>} Mensagem de sucesso
   * @throws {Error} Se o voluntário não existir, os dados forem inválidos ou o e-mail já estiver em uso
   */
  static async updateVolunteer(id, volunteer) {
    await this.getVolunteerById(id);
    this.validateVolunteer(volunteer);
    const data = this.normalizeVolunteer(volunteer);

    const sameEmail = await VolunteerModel.findByEmail(data.email);
    if (sameEmail && String(sameEmail.id) !== String(id)) {
      throw new Error('Voluntário já cadastrado');
    }

    await VolunteerModel.update(id, data);

    return { message: 'Voluntário atualizado com sucesso' };
  }

  /**
   * Exclui voluntário
   * @param {number|string} id - ID do voluntário
   * @returns {Promise<Object>} Mensagem de sucesso
   * @throws {Error} Se o voluntário não existir
   */
  static async deleteVolunteer(id) {
    await this.getVolunteerById(id);

    await VolunteerModel.delete(id);

    return { message: 'Voluntário excluído com sucesso' };
  }
}

module.exports = VolunteerService;
