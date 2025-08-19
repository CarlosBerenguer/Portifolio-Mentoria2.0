const Evolucao = require('../models/evolucao.model');

class EvolucaoController {
  // Adicionar uma nova evolução para um paciente
  static async criar(req, res) {
    try {
      console.log('=== CRIANDO EVOLUÇÃO ===');
      console.log('req.body:', JSON.stringify(req.body, null, 2));
      console.log('req.files:', req.files);
      console.log('req.usuarioId:', req.usuarioId);
      console.log('========================');
      
      const { paciente_id, data_hora, observacao, descricao, titulo } = req.body;

      // Validar campos obrigatórios
      if (!paciente_id || (!observacao && !descricao)) {
        console.log('Erro: Campos obrigatórios faltando');
        console.log('paciente_id:', paciente_id);
        console.log('observacao:', observacao);
        console.log('descricao:', descricao);
        return res.status(400).json({ 
          mensagem: 'ID do paciente e observação são obrigatórios' 
        });
      }

      // Verificar se o paciente pertence ao usuário logado
      const pacientePertenceAoUsuario = await Evolucao.verificarPacienteDoUsuario(
        paciente_id, 
        req.usuarioId
      );

      if (!pacientePertenceAoUsuario) {
        return res.status(403).json({ 
          mensagem: 'Acesso negado. O paciente não pertence a este usuário.' 
        });
      }

      // Processar anexos se existirem
      let anexos = [];
      if (req.files && req.files.length > 0) {
        anexos = req.files.map(file => ({
          nome_original: file.originalname,
          nome_arquivo: file.filename,
          caminho: file.path,
          tamanho: file.size,
          tipo: file.mimetype
        }));
      }

      // Preparar dados para criação
      const dadosEvolucao = {
        ...req.body,
        anexos: anexos
      };

      // Criar a evolução
      const novaEvolucao = await Evolucao.criar(dadosEvolucao);

      res.status(201).json({
        mensagem: 'Evolução registrada com sucesso',
        evolucao: novaEvolucao
      });
    } catch (error) {
      console.error('Erro ao criar evolução:', error);
      res.status(500).json({ mensagem: 'Erro ao registrar evolução' });
    }
  }

  // Listar evoluções de um paciente
  static async listarPorPaciente(req, res) {
    try {
      const pacienteId = req.params.paciente_id;

      // Verificar se o paciente pertence ao usuário logado
      const pacientePertenceAoUsuario = await Evolucao.verificarPacienteDoUsuario(
        pacienteId, 
        req.usuarioId
      );

      if (!pacientePertenceAoUsuario) {
        return res.status(403).json({ 
          mensagem: 'Acesso negado. O paciente não pertence a este usuário.' 
        });
      }

      // Listar evoluções
      const evolucoes = await Evolucao.listarPorPaciente(pacienteId);

      // Garantir que os campos de compatibilidade com frontend sejam incluídos
      const evolucoesFormatadas = evolucoes.map(evolucao => ({
        ...evolucao,
        conteudo: evolucao.observacao,
        data_evolucao: evolucao.data_hora
      }));

      res.status(200).json(evolucoesFormatadas);
    } catch (error) {
      console.error('Erro ao listar evoluções:', error);
      res.status(500).json({ mensagem: 'Erro ao listar evoluções do paciente' });
    }
  }

  // Obter uma evolução específica
  static async obterPorId(req, res) {
    try {
      const id = req.params.id;
      const evolucao = await Evolucao.buscarPorId(id);

      if (!evolucao) {
        return res.status(200).json({ 
          mensagem: 'Evolução não encontrada',
          evolucao: null 
        });
      }

      // Verificar se o paciente da evolução pertence ao usuário logado
      const pacientePertenceAoUsuario = await Evolucao.verificarPacienteDoUsuario(
        evolucao.paciente_id, 
        req.usuarioId
      );

      if (!pacientePertenceAoUsuario) {
        return res.status(403).json({ 
          mensagem: 'Acesso negado. Esta evolução não pertence a um paciente seu.' 
        });
      }

      res.status(200).json(evolucao);
    } catch (error) {
      console.error('Erro ao obter evolução:', error);
      res.status(500).json({ mensagem: 'Erro ao obter dados da evolução' });
    }
  }

  // Atualizar uma evolução
  static async atualizar(req, res) {
    try {
      const id = req.params.id;
      
      // Verificar se a evolução existe
      const evolucaoExistente = await Evolucao.buscarPorId(id);
      if (!evolucaoExistente) {
        return res.status(200).json({ 
          mensagem: 'Evolução não encontrada',
          sucesso: false 
        });
      }

      // Verificar se o paciente da evolução pertence ao usuário logado
      const pacientePertenceAoUsuario = await Evolucao.verificarPacienteDoUsuario(
        evolucaoExistente.paciente_id, 
        req.usuarioId
      );

      if (!pacientePertenceAoUsuario) {
        return res.status(403).json({ 
          mensagem: 'Acesso negado. Esta evolução não pertence a um paciente seu.' 
        });
      }

      // Remover campos que não devem ser atualizados diretamente
      const dadosAtualizacao = { ...req.body };
      delete dadosAtualizacao.id;
      delete dadosAtualizacao.paciente_id;
      delete dadosAtualizacao.criado_em;

      // Atualizar a evolução
      const evolucaoAtualizada = await Evolucao.atualizar(id, dadosAtualizacao);

      res.status(200).json({
        mensagem: 'Evolução atualizada com sucesso',
        evolucao: evolucaoAtualizada
      });
    } catch (error) {
      console.error('Erro ao atualizar evolução:', error);
      res.status(500).json({ mensagem: 'Erro ao atualizar dados da evolução' });
    }
  }

  // Excluir uma evolução
  static async excluir(req, res) {
    try {
      const id = req.params.id;
      
      // Verificar se a evolução existe
      const evolucao = await Evolucao.buscarPorId(id);
      if (!evolucao) {
        return res.status(200).json({ 
          mensagem: 'Evolução não encontrada',
          sucesso: false 
        });
      }

      // Verificar se o paciente da evolução pertence ao usuário logado
      const pacientePertenceAoUsuario = await Evolucao.verificarPacienteDoUsuario(
        evolucao.paciente_id, 
        req.usuarioId
      );

      if (!pacientePertenceAoUsuario) {
        return res.status(403).json({ 
          mensagem: 'Acesso negado. Esta evolução não pertence a um paciente seu.' 
        });
      }

      // Excluir a evolução
      await Evolucao.excluir(id);

      res.status(200).json({ mensagem: 'Evolução excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir evolução:', error);
      res.status(500).json({ mensagem: 'Erro ao excluir evolução' });
    }
  }

  // Listar evoluções recentes para o dashboard
  static async listarRecentes(req, res) {
    try {
      const usuarioId = req.usuarioId;
      const limite = 5; // Limitar a 5 evoluções recentes
      
      // Buscar evoluções recentes do usuário
      const evolucoes = await Evolucao.listarRecentes(usuarioId, limite);
      
      // Sempre retorna um array, mesmo que vazio
      res.status(200).json(evolucoes || []);
    } catch (error) {
      console.error('Erro ao listar evoluções recentes:', error);
      res.status(500).json({ mensagem: 'Erro ao listar evoluções recentes' });
    }
  }
}

module.exports = EvolucaoController;