const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Rotas de autenticação
 */

/**
 * @swagger
 * /api/auth/registrar:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - senha
 *               - nome_completo
 *               - cpf
 *               - crp
 *               - email
 *             properties:
 *               usuario:
 *                 type: string
 *               senha:
 *                 type: string
 *               nome_completo:
 *                 type: string
 *               cpf:
 *                 type: string
 *               crp:
 *                 type: string
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               especialidade:
 *                 type: string
 *               endereco:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Dados inválidos ou usuário já existe
 *       500:
 *         description: Erro no servidor
 */
router.post('/registrar', AuthController.registrar);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza login de usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - senha
 *             properties:
 *               usuario:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro no servidor
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /api/auth/verificar:
 *   get:
 *     summary: Verifica se o token é válido
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token inválido ou expirado
 *       500:
 *         description: Erro no servidor
 */
router.get('/verificar', verificarToken, AuthController.verificarToken);

module.exports = router;