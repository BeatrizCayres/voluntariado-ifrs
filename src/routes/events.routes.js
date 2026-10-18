/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Ações de voluntariado. Consulta é pública; alterações exigem administrador.
 */

/**
 * @swagger
 * /events:
 *   get:
 *     tags: [Events]
 *     summary: Lista eventos (público)
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtra eventos por categoria
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Erro interno
 *   post:
 *     tags: [Events]
 *     summary: Cadastra novo evento (somente admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Evento cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não informado
 *       403:
 *         description: Token inválido ou acesso negado
 *       500:
 *         description: Erro interno
 */

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     tags: [Events]
 *     summary: Consulta evento por ID (público)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Evento encontrado
 *       404:
 *         description: Evento não encontrado
 *       500:
 *         description: Erro interno
 *   put:
 *     tags: [Events]
 *     summary: Atualiza evento (somente admin)
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
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Evento atualizado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não informado
 *       403:
 *         description: Token inválido ou acesso negado
 *       404:
 *         description: Evento não encontrado
 *       409:
 *         description: Capacidade menor que o número de inscritos
 *       500:
 *         description: Erro interno
 *   delete:
 *     tags: [Events]
 *     summary: Exclui evento (somente admin)
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
 *         description: Evento excluído
 *       401:
 *         description: Token não informado
 *       403:
 *         description: Token inválido ou acesso negado
 *       404:
 *         description: Evento não encontrado
 *       500:
 *         description: Erro interno
 */

/**
 * @swagger
 * /events/{id}/volunteers:
 *   get:
 *     tags: [Events]
 *     summary: Lista voluntários inscritos no evento (autenticado)
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
 *         description: Lista de voluntários inscritos
 *       401:
 *         description: Token não informado
 *       403:
 *         description: Token inválido ou expirado
 *       404:
 *         description: Evento não encontrado
 *       500:
 *         description: Erro interno
 *   post:
 *     tags: [Events]
 *     summary: Inscreve voluntário no evento (autenticado, respeita a capacidade)
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
 *             $ref: '#/components/schemas/EventRegistrationRequest'
 *     responses:
 *       201:
 *         description: Voluntário inscrito
 *       400:
 *         description: Voluntário não informado
 *       401:
 *         description: Token não informado
 *       403:
 *         description: Token inválido ou expirado
 *       404:
 *         description: Evento ou voluntário não encontrado
 *       409:
 *         description: Limite de vagas atingido ou voluntário já inscrito
 *       500:
 *         description: Erro interno
 */

const express = require('express');

const EventsController = require('../controllers/events.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

// Rotas públicas
router.get('/', EventsController.getAll);
router.get('/:id', EventsController.getById);

// Alterações de eventos: somente administradores
router.post('/', authenticateToken, authorizeRole('admin'), EventsController.create);
router.put('/:id', authenticateToken, authorizeRole('admin'), EventsController.update);
router.delete('/:id', authenticateToken, authorizeRole('admin'), EventsController.remove);

// Inscrições de voluntários: qualquer usuário autenticado
router.get('/:id/volunteers', authenticateToken, EventsController.getVolunteers);
router.post('/:id/volunteers', authenticateToken, EventsController.registerVolunteer);

module.exports = router;
