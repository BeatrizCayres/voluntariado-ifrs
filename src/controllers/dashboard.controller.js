/**
 * @module controllers/DashboardController
 * @description Controlador do painel. Usa os dados do JWT preenchidos pelo middleware authenticateToken.
 */

/**
 * @class DashboardController
 */
class DashboardController {
  /**
   * Painel do usuário autenticado
   * @param {import('express').Request} req - Requisição com req.user
   * @param {import('express').Response} res - Resposta Express
   * @returns {import('express').Response} Mensagem, e-mail e papel do usuário
   */
  static dashboard(req, res) {
    return res.status(200).json({
      message: 'Bem-vindo ao painel',
      user: req.user.email,
      role: req.user.role,
    });
  }

  /**
   * Painel administrativo (somente admins)
   * @param {import('express').Request} req - Requisição com req.user
   * @param {import('express').Response} res - Resposta Express
   * @returns {import('express').Response} Mensagem, e-mail e papel do usuário
   */
  static admin(req, res) {
    return res.status(200).json({
      message: 'Bem-vindo à área administrativa',
      user: req.user.email,
      role: req.user.role,
    });
  }
}

module.exports = DashboardController;
