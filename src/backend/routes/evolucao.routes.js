const express = require('express');
const router = express.Router();
const EvolucaoController = require('../controllers/evolucao.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Evoluções
 *   description: Rotas de gerenciamento de evoluções de pacientes
 */

/**
 * @swagger
 * /api/evolucoes:
 *   post:
 *     summary: Registra uma nova evolução para um paciente
 *     tags: [Evoluções]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paciente_id
 *               - data_sessao
 *               - descricao
 *             properties:
 *               paciente_id:
 *                 type: integer
 *               data_sessao:
 *                 type: string
 *                 format: date
 *               descricao:
 *                 type: string
 *               diagnostico:
 *                 type: string
 *               conduta:
 *                 type: string
 *     responses:
 *       201:
 *         description: Evolução registrada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro no servidor
 */
router.post('/', verificarToken, EvolucaoController.criar);

/**
 * @swagger
 * /api/evolucoes/paciente/{paciente_id}:
 *   get:
 *     summary: Lista todas as evoluções de um paciente
 *     tags: [Evoluções]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paciente_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do paciente
 *     responses:
 *       200:
 *         description: Lista de evoluções retornada com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro no servidor
 */
router.get('/paciente/:paciente_id', verificarToken, EvolucaoController.listarPorPaciente);

/**
 * @swagger
 * /api/evolucoes/{id}:
 *   get:
 *     summary: Obtém dados de uma evolução específica
 *     tags: [Evoluções]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da evolução
 *     responses:
 *       200:
 *         description: Dados da evolução retornados com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Evolução não encontrada
 *       500:
 *         description: Erro no servidor
 */
router.get('/:id', verificarToken, EvolucaoController.obterPorId);

/**
 * @swagger
 * /api/evolucoes/{id}:
 *   put:
 *     summary: Atualiza dados de uma evolução
 *     tags: [Evoluções]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da evolução
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data_sessao:
 *                 type: string
 *                 format: date
 *               descricao:
 *                 type: string
 *               diagnostico:
 *                 type: string
 *               conduta:
 *                 type: string
 *     responses:
 *       200:
 *         description: Evolução atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Evolução não encontrada
 *       500:
 *         description: Erro no servidor
 */
router.put('/:id', verificarToken, EvolucaoController.atualizar);

/**
 * @swagger
 * /api/evolucoes/{id}:
 *   delete:
 *     summary: Exclui uma evolução
 *     tags: [Evoluções]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da evolução
 *     responses:
 *       200:
 *         description: Evolução excluída com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Evolução não encontrada
 *       500:
 *         description: Erro no servidor
 */
/**
 * @swagger
 * /api/evolucoes/recentes:
 *   get:
 *     summary: Obtém as evoluções mais recentes para o dashboard
 *     tags: [Evoluções]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de evoluções recentes retornada com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro no servidor
 */
router.get('/recentes', verificarToken, EvolucaoController.listarRecentes);

router.delete('/:id', verificarToken, EvolucaoController.excluir);

module.exports = router;