const express = require('express');
const router = express.Router();
const PacienteController = require('../controllers/paciente.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { uploadFotoPaciente } = require('../middlewares/upload.middleware');

/**
 * @swagger
 * tags:
 *   name: Pacientes
 *   description: Rotas de gerenciamento de pacientes
 */

/**
 * @swagger
 * /api/pacientes:
 *   post:
 *     summary: Cadastra um novo paciente
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome_completo
 *               - data_nascimento
 *               - cpf
 *             properties:
 *               nome_completo:
 *                 type: string
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *               cpf:
 *                 type: string
 *               genero:
 *                 type: string
 *               estado_civil:
 *                 type: string
 *               profissao:
 *                 type: string
 *               telefone:
 *                 type: string
 *               email:
 *                 type: string
 *               endereco:
 *                 type: string
 *               observacoes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Paciente cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro no servidor
 */
router.post('/', verificarToken, uploadFotoPaciente, PacienteController.criar);

/**
 * @swagger
 * /api/pacientes:
 *   get:
 *     summary: Lista todos os pacientes do usuário
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: filtro
 *         schema:
 *           type: string
 *         description: Filtro de busca por nome, CPF ou email
 *     responses:
 *       200:
 *         description: Lista de pacientes retornada com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro no servidor
 */
router.get('/', verificarToken, PacienteController.listar);

/**
 * @swagger
 * /api/pacientes/{id}:
 *   get:
 *     summary: Obtém dados de um paciente específico
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do paciente
 *     responses:
 *       200:
 *         description: Dados do paciente retornados com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Paciente não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.get('/:id', verificarToken, PacienteController.obterPorId);

/**
 * @swagger
 * /api/pacientes/{id}:
 *   put:
 *     summary: Atualiza dados de um paciente
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do paciente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_completo:
 *                 type: string
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *               cpf:
 *                 type: string
 *               genero:
 *                 type: string
 *               estado_civil:
 *                 type: string
 *               profissao:
 *                 type: string
 *               telefone:
 *                 type: string
 *               email:
 *                 type: string
 *               endereco:
 *                 type: string
 *               observacoes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Paciente atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Paciente não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/:id', verificarToken, PacienteController.atualizar);

/**
 * @swagger
 * /api/pacientes/{id}:
 *   delete:
 *     summary: Exclui um paciente
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do paciente
 *     responses:
 *       200:
 *         description: Paciente excluído com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Paciente não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.delete('/:id', verificarToken, PacienteController.excluir);

/**
 * @swagger
 * /api/pacientes/{id}/foto:
 *   post:
 *     summary: Atualiza a foto do paciente
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do paciente
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - foto
 *             properties:
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto atualizada com sucesso
 *       400:
 *         description: Arquivo inválido
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Paciente não encontrado
 *       500:
 *         description: Erro no servidor
 */
/**
 * @swagger
 * /api/pacientes/estatisticas:
 *   get:
 *     summary: Obtém estatísticas para o dashboard
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas retornadas com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro no servidor
 */
router.get('/estatisticas', verificarToken, PacienteController.obterEstatisticas);

router.post('/:id/foto', verificarToken, uploadFotoPaciente, PacienteController.atualizarFoto);

module.exports = router;