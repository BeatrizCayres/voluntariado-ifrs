const jwt = require('jsonwebtoken');

/**
 * @module middlewares/AuthMiddleware
 * @description Middlewares de autenticação e autorização
 */

/**
 * Middleware para autenticar token JWT
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Próximo middleware
 * @returns {void}
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  // espera-se Authorization: Bearer TOKEN
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Token não informado',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(403).json({
        message: 'Token inválido ou expirado',
      });
    }

    req.user = user;
    next();
  });
}

/**
 * Middleware para autorizar por papel
 * @param {string} role - Papel necessário
 * @returns {Function} Middleware Express
 */
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({
        message: 'Acesso negado',
      });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRole,
};
