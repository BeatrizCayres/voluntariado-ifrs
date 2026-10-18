/**
 * @module controllers/AuthController
 * @description Controlador de autenticação
 */
const UserService = require('../services/userService');

/**
 * @class AuthController
 */
class AuthController {
  static async register(req, res) {
    try {
      const result = await UserService.registerUser(req.body);

      return res.status(201).json(result);
    } catch (error) {
      // o Controller transforma os erros do Service em respostas HTTP.
      if (error.message === 'Usuário já existe') {
        return res.status(409).json({ message: error.message });
      }

      if (error.message === 'E-mail e senha são obrigatórios') {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({
        message: 'Erro ao cadastrar usuário',
        error: error.message,
      });
    }
  }

  static async login(req, res) {
    try {
      const result = await UserService.loginUser(req.body);

      return res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Usuário não encontrado' || error.message === 'Senha inválida') {
        return res.status(401).json({ message: error.message });
      }

      if (error.message === 'E-mail e senha são obrigatórios') {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({
        message: 'Erro ao realizar login',
        error: error.message,
      });
    }
  }
}

module.exports = AuthController;
