/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno
 */

const express = require('express');

const AuthController = require('../controllers/auth.controller');

const router = express.Router();

// POST /auth/login
router.post('/login', AuthController.login);

module.exports = router;
