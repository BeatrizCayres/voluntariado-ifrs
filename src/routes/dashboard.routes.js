/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Painel do usuário autenticado
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     tags: [Dashboard]
 *     summary: Painel do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acesso ao painel
 *       401:
 *         description: Token não informado
 *       403:
 *         description: Token inválido ou expirado
 */

/**
 * @swagger
 * /dashboard/admin:
 *   get:
 *     tags: [Dashboard]
 *     summary: Área administrativa (somente admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acesso à área administrativa
 *       401:
 *         description: Token não informado
 *       403:
 *         description: Token inválido ou acesso negado
 */

const express = require('express');

const DashboardController = require('../controllers/dashboard.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authenticateToken, DashboardController.dashboard);
router.get('/admin', authenticateToken, authorizeRole('admin'), DashboardController.admin);

module.exports = router;
