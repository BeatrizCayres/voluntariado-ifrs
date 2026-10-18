/**
 * @module controllers/VolunteersController
 * @description Controlador das rotas de voluntários. Recebe a requisição, chama o VolunteerService e monta a resposta HTTP.
 */
const VolunteerService = require('../services/volunteerService');

/**
 * @class VolunteersController
 */
class VolunteersController {
  /**
   * Lista todos os voluntários
   * @param {import('express').Request} req - Requisição Express
   * @param {import('express').Response} res - Resposta Express
   * @returns {Promise<import('express').Response>} Lista de voluntários
   */
  static async getAll(req, res) {
    try {
      const volunteers = await VolunteerService.getAllVolunteers();

      return res.status(200).json(volunteers);
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao consultar voluntários',
        error: error.message,
      });
    }
  }

  /**
   * Consulta um voluntário pelo ID
   * @param {import('express').Request} req - Parâmetro id
   * @param {import('express').Response} res - Resposta Express
   * @returns {Promise<import('express').Response>} Voluntário encontrado
   */
  static async getById(req, res) {
    try {
      const volunteer = await VolunteerService.getVolunteerById(req.params.id);

      return res.status(200).json(volunteer);
    } catch (error) {
      if (error.message === 'Voluntário não encontrado') {
        return res.status(404).json({ message: error.message });
      }

      return res.status(500).json({
        message: 'Erro ao consultar voluntário',
        error: error.message,
      });
    }
  }

  /**
   * Cadastra um novo voluntário
   * @param {import('express').Request} req - Corpo com name, email e telephone
   * @param {import('express').Response} res - Resposta Express
   * @returns {Promise<import('express').Response>} Mensagem e ID criado
   */
  static async create(req, res) {
    try {
      const result = await VolunteerService.createVolunteer(req.body);

      return res.status(201).json(result);
    } catch (error) {
      if (error.message === 'Dados do voluntário inválidos') {
        return res.status(400).json({ message: error.message });
      }

      if (error.message === 'Voluntário já cadastrado') {
        return res.status(409).json({ message: error.message });
      }

      return res.status(500).json({
        message: 'Erro ao cadastrar voluntário',
        error: error.message,
      });
    }
  }

  /**
   * Atualiza um voluntário
   * @param {import('express').Request} req - Parâmetro id e corpo com os dados
   * @param {import('express').Response} res - Resposta Express
   * @returns {Promise<import('express').Response>} Mensagem de sucesso
   */
  static async update(req, res) {
    try {
      const result = await VolunteerService.updateVolunteer(req.params.id, req.body);

      return res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Voluntário não encontrado') {
        return res.status(404).json({ message: error.message });
      }

      if (error.message === 'Dados do voluntário inválidos') {
        return res.status(400).json({ message: error.message });
      }

      if (error.message === 'Voluntário já cadastrado') {
        return res.status(409).json({ message: error.message });
      }

      return res.status(500).json({
        message: 'Erro ao atualizar voluntário',
        error: error.message,
      });
    }
  }

  /**
   * Exclui um voluntário
   * @param {import('express').Request} req - Parâmetro id
   * @param {import('express').Response} res - Resposta Express
   * @returns {Promise<import('express').Response>} Mensagem de sucesso
   */
  static async remove(req, res) {
    try {
      const result = await VolunteerService.deleteVolunteer(req.params.id);

      return res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Voluntário não encontrado') {
        return res.status(404).json({ message: error.message });
      }

      return res.status(500).json({
        message: 'Erro ao excluir voluntário',
        error: error.message,
      });
    }
  }
}

module.exports = VolunteersController;
