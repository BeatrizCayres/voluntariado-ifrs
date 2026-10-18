/**
 * @swagger
 * tags:
 *   name: Volunteers
 *   description: Cadastro de voluntários (requer autenticação)
 */

/**
 * @swagger
 * /volunteers:
 *   get:
 *     tags: [Volunteers]
 *     summary: Lista voluntários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de voluntários
 *       401:
 *         description: Token não informado
 *       403:
 *         description: Token inválido ou expirado
 *       500:
 *         description: Erro interno
 *   post:
 *     tags: [Volunteers]
 *     summary: Cadastra voluntário
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Volunteer'
 *     responses:
 *       201:
 *         description: Voluntário cadastrado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não informado
 *       403:
 *         description: Token inválido ou expirado
 *       409:
 *         description: E-mail já cadastrado
 *       500:
 *         description: Erro interno
 */

/**
 * @swagger
 * /volunteers/{id}:
 *   get:
 *     tags: [Volunteers]
 *     summary: Consulta voluntário por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Voluntário encontrado
 *       401:
 *         description: Token não informado
 *       403:
 *         description: Token inválido ou expirado
 *       404:
 *         description: Voluntário não encontrado
 *       500:
 *         description: Erro interno
 *   put:
 *     tags: [Volunteers]
 *     summary: Atualiza voluntário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Volunteer'
 *     responses:
 *       200:
 *         description: Voluntário atualizado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não informado
 *       403:
 *         description: Token inválido ou expirado
 *       404:
 *         description: Voluntário não encontrado
 *       409:
 *         description: E-mail já cadastrado
 *       500:
 *         description: Erro interno
 *   delete:
 *     tags: [Volunteers]
 *     summary: Exclui voluntário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Voluntário excluído
 *       401:
 *         description: Token não informado
 *       403:
 *         description: Token inválido ou expirado
 *       404:
 *         description: Voluntário não encontrado
 *       500:
 *         description: Erro interno
 */

const express = require('express');

const VolunteersController = require('../controllers/volunteers.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Todas as rotas de voluntários exigem token JWT
router.use(authenticateToken);

router.get('/', VolunteersController.getAll);
router.get('/:id', VolunteersController.getById);
router.post('/', VolunteersController.create);
router.put('/:id', VolunteersController.update);
router.delete('/:id', VolunteersController.remove);

module.exports = router;
