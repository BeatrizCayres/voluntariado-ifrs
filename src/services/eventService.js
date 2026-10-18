/**
 * @module services/EventService
 * @description Camada de regras de negócio para eventos e inscrições de voluntários
 */
const EventModel = require('../models/eventModel');
const EventVolunteerModel = require('../models/eventVolunteerModel');
const VolunteerService = require('./volunteerService');

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * @class EventService
 * @description Regras de negócio de eventos. O campo `capacity` do evento é o
 * número máximo de voluntários que podem se inscrever nele.
 */
class EventService {
  /**
   * Lista todos os eventos, podendo filtrar por categoria
   * @param {string} [category] - Categoria para filtrar
   * @returns {Promise<Array<Object>>} Lista de eventos
   */
  static async getAllEvents(category) {
    return EventModel.findAll(category);
  }

  /**
   * Busca evento por ID
   * @param {number|string} id - ID do evento
   * @returns {Promise<Object>} Evento encontrado
   * @throws {Error} Se evento não encontrado
   */
  static async getEventById(id) {
    const event = await EventModel.findById(id);

    if (!event) {
      throw new Error('Evento não encontrado');
    }

    return event;
  }

  /**
   * Valida os dados de um evento
   * @param {Object} event - Dados do evento
   * @throws {Error} Se algum campo for inválido ('Dados do evento inválidos')
   * @returns {void}
   */
  static validateEvent(event) {
    const name = (event.name || '').trim();
    const capacity = Number(event.capacity);
    const isValidName = name.length >= 8;
    const isValidDate = DATE_PATTERN.test(event.eventDate || '');
    const isValidCapacity =
      event.capacity !== undefined &&
      event.capacity !== '' &&
      Number.isInteger(capacity) &&
      capacity >= 1;

    if (
      !isValidName ||
      !event.category?.trim() ||
      !event.location?.trim() ||
      !isValidDate ||
      !isValidCapacity
    ) {
      throw new Error('Dados do evento inválidos');
    }
  }

  /**
   * Cria novo evento
   * @param {Object} event - Dados do evento
   * @returns {Promise<Object>} Mensagem e ID do evento criado
   * @throws {Error} Se os dados forem inválidos
   */
  static async createEvent(event) {
    this.validateEvent(event);

    const id = await EventModel.create(event);

    return {
      message: 'Evento cadastrado com sucesso',
      id,
    };
  }

  /**
   * Atualiza evento existente. A capacidade não pode ficar abaixo do número de inscritos.
   * @param {number|string} id - ID do evento
   * @param {Object} event - Dados atualizados
   * @returns {Promise<Object>} Mensagem de sucesso
   * @throws {Error} Se o evento não existir, os dados forem inválidos ou a capacidade for menor que os inscritos
   */
  static async updateEvent(id, event) {
    await this.getEventById(id);
    this.validateEvent(event);

    const registered = await EventVolunteerModel.countByEvent(id);
    if (Number(event.capacity) < registered) {
      throw new Error('Capacidade menor que o número de inscritos');
    }

    await EventModel.update(id, event);

    return { message: 'Evento atualizado com sucesso' };
  }

  /**
   * Exclui evento
   * @param {number|string} id - ID do evento
   * @returns {Promise<Object>} Mensagem de sucesso
   * @throws {Error} Se o evento não existir
   */
  static async deleteEvent(id) {
    await this.getEventById(id);

    await EventModel.delete(id);

    return { message: 'Evento excluído com sucesso' };
  }

  /**
   * Verifica se ainda há vagas no evento
   * @param {number|string} eventId - ID do evento
   * @returns {Promise<void>}
   * @throws {Error} Se o evento não existir ou o limite máximo de voluntários já foi atingido
   */
  static async checkEventCapacity(eventId) {
    const event = await this.getEventById(eventId);
    const registered = await EventVolunteerModel.countByEvent(eventId);

    if (registered >= event.capacity) {
      throw new Error('Limite máximo de voluntários por evento atingido');
    }
  }

  /**
   * Lista os voluntários inscritos em um evento
   * @param {number|string} eventId - ID do evento
   * @returns {Promise<Array<Object>>} Voluntários inscritos
   * @throws {Error} Se o evento não existir
   */
  static async getEventVolunteers(eventId) {
    await this.getEventById(eventId);

    return EventVolunteerModel.findVolunteersByEvent(eventId);
  }

  /**
   * Inscreve um voluntário em um evento, respeitando o limite de vagas
   * @param {number|string} eventId - ID do evento
   * @param {number|string} volunteerId - ID do voluntário
   * @returns {Promise<Object>} Mensagem de sucesso
   * @throws {Error} Se evento/voluntário não existirem, já houver inscrição ou não houver vagas
   */
  static async registerVolunteer(eventId, volunteerId) {
    if (!volunteerId) {
      throw new Error('Voluntário não informado');
    }

    await this.getEventById(eventId);
    await VolunteerService.getVolunteerById(volunteerId);

    if (await EventVolunteerModel.exists(eventId, volunteerId)) {
      throw new Error('Voluntário já inscrito neste evento');
    }

    await this.checkEventCapacity(eventId);
    await EventVolunteerModel.add(eventId, volunteerId);

    return { message: 'Voluntário inscrito no evento com sucesso' };
  }
}

module.exports = EventService;
