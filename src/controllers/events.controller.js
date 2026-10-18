/**
 * @module controllers/EventsController
 * @description Controlador das rotas de eventos. Recebe a requisição, chama o EventService e monta a resposta HTTP.
 */
const EventService = require('../services/eventService');

/**
 * @class EventsController
 */
class EventsController {
  /**
   * Lista eventos, podem ser filtrados por categoria
   * @param {import('express').Request} req - Query opcional: category
   * @param {import('express').Response} res - Resposta Express
   * @returns {Promise<import('express').Response>} Lista de eventos
   */
  static async getAll(req, res) {
    try {
      const events = await EventService.getAllEvents(req.query.category);

      return res.status(200).json(events);
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao consultar eventos',
        error: error.message,
      });
    }
  }

  /**
   * Consulta um evento pelo ID
   * @param {import('express').Request} req - Parâmetro id
   * @param {import('express').Response} res - Resposta Express
   * @returns {Promise<import('express').Response>} Evento encontrado
   */
  static async getById(req, res) {
    try {
      const event = await EventService.getEventById(req.params.id);

      return res.status(200).json(event);
    } catch (error) {
      if (error.message === 'Evento não encontrado') {
        return res.status(404).json({ message: error.message });
      }

      return res.status(500).json({
        message: 'Erro ao consultar evento',
        error: error.message,
      });
    }
  }

  /**
   * Cadastra um novo evento (somente admins)
   * @param {import('express').Request} req - Corpo com os dados do evento
   * @param {import('express').Response} res - Resposta Express
   * @returns {Promise<import('express').Response>} Mensagem e ID criado
   */
  static async create(req, res) {
    try {
      const result = await EventService.createEvent(req.body);

      return res.status(201).json(result);
    } catch (error) {
      if (error.message === 'Dados do evento inválidos') {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({
        message: 'Erro ao cadastrar evento',
        error: error.message,
      });
    }
  }

  /**
   * Atualiza um evento (somente admins)
   * @param {import('express').Request} req - Parâmetro id e corpo com os dados
   * @param {import('express').Response} res - Resposta Express
   * @returns {Promise<import('express').Response>} Mensagem de sucesso
   */
  static async update(req, res) {
    try {
      const result = await EventService.updateEvent(req.params.id, req.body);

      return res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Evento não encontrado') {
        return res.status(404).json({ message: error.message });
      }

      if (error.message === 'Dados do evento inválidos') {
        return res.status(400).json({ message: error.message });
      }

      if (error.message === 'Capacidade menor que o número de inscritos') {
        return res.status(409).json({ message: error.message });
      }

      return res.status(500).json({
        message: 'Erro ao atualizar evento',
        error: error.message,
      });
    }
  }

  /**
   * Exclui um evento (somente admins)
   * @param {import('express').Request} req - Parâmetro id
   * @param {import('express').Response} res - Resposta Express
   * @returns {Promise<import('express').Response>} Mensagem de sucesso
   */
  static async remove(req, res) {
    try {
      const result = await EventService.deleteEvent(req.params.id);

      return res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Evento não encontrado') {
        return res.status(404).json({ message: error.message });
      }

      return res.status(500).json({
        message: 'Erro ao excluir evento',
        error: error.message,
      });
    }
  }

  /**
   * Lista os voluntários inscritos em um evento
   * @param {import('express').Request} req - Parâmetro id
   * @param {import('express').Response} res - Resposta Express
   * @returns {Promise<import('express').Response>} Lista de voluntários inscritos
   */
  static async getVolunteers(req, res) {
    try {
      const volunteers = await EventService.getEventVolunteers(req.params.id);

      return res.status(200).json(volunteers);
    } catch (error) {
      if (error.message === 'Evento não encontrado') {
        return res.status(404).json({ message: error.message });
      }

      return res.status(500).json({
        message: 'Erro ao consultar voluntários do evento',
        error: error.message,
      });
    }
  }

  /**
   * Inscreve um voluntário em um evento, respeitando a capacidade
   * @param {import('express').Request} req - Parâmetro id e corpo com volunteer_id
   * @param {import('express').Response} res - Resposta Express
   * @returns {Promise<import('express').Response>} Mensagem de sucesso
   */
  static async registerVolunteer(req, res) {
    try {
      const result = await EventService.registerVolunteer(req.params.id, req.body.volunteer_id);

      return res.status(201).json(result);
    } catch (error) {
      if (
        error.message === 'Evento não encontrado' ||
        error.message === 'Voluntário não encontrado'
      ) {
        return res.status(404).json({ message: error.message });
      }

      if (error.message === 'Voluntário não informado') {
        return res.status(400).json({ message: error.message });
      }

      if (
        error.message === 'Voluntário já inscrito neste evento' ||
        error.message === 'Limite máximo de voluntários por evento atingido'
      ) {
        return res.status(409).json({ message: error.message });
      }

      return res.status(500).json({
        message: 'Erro ao inscrever voluntário no evento',
        error: error.message,
      });
    }
  }
}

module.exports = EventsController;
