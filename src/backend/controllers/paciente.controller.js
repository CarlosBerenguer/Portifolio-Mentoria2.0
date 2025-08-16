const Paciente = require('../models/paciente.model');
const fs = require('fs');
const path = require('path');

class PacienteController {
  // Criar um novo paciente
  static async criar(req, res) {
    try {
      const { nome_completo, data_nascimento, cpf } = req.body;

      // Validar campos obrigatórios
      if (!nome_completo || !data_nascimento || !cpf) {
        return res.status(400).json({ 
          mensagem: 'Nome completo, data de nascimento e CPF são obrigatórios' 
        });
      }

      // Verificar se o CPF já existe para este usuário
      const cpfExiste = await Paciente.cpfExiste(cpf, req.usuarioId);
      if (cpfExiste) {
        return res.status(400).json({ 
          mensagem: 'CPF já cadastrado para outro paciente' 
        });
      }

      // Adicionar o ID do usuário aos dados do paciente
      const dadosPaciente = {
        ...req.body,
        usuario_id: req.usuarioId
      };

      // Criar o paciente
      const novoPaciente = await Paciente.criar(dadosPaciente);

      res.status(201).json({
        mensagem: 'Paciente cadastrado com sucesso',
        paciente: novoPaciente
      });
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      res.status(500).json({ mensagem: 'Erro ao cadastrar paciente' });
    }
  }

  // Listar todos os pacientes do usuário
  static async listar(req, res) {
    try {
      const { filtro, limite } = req.query;
      let limiteNum = null;
      
      // Validar e converter o parâmetro limite
      if (limite && limite.trim() !== '' && !isNaN(limite)) {
        limiteNum = parseInt(limite, 10);
        if (limiteNum <= 0) {
          limiteNum = null;
        }
      } else {
        limiteNum = null;
      }
      
      const pacientes = await Paciente.listarPorUsuario(req.usuarioId, filtro || '', limiteNum);

      res.status(200).json(pacientes);
    } catch (error) {
      console.error('Erro ao listar pacientes:', error);
      res.status(500).json({ mensagem: 'Erro ao listar pacientes' });
    }
  }

  // Obter detalhes de um paciente específico
  static async obterPorId(req, res) {
    try {
      const id = req.params.id;
      const paciente = await Paciente.buscarPorId(id, req.usuarioId);

      if (!paciente) {
        return res.status(200).json({ 
          mensagem: 'Paciente não encontrado',
          paciente: null 
        });
      }

      res.status(200).json(paciente);
    } catch (error) {
      console.error('Erro ao obter paciente:', error);
      res.status(500).json({ mensagem: 'Erro ao obter dados do paciente' });
    }
  }

  // Atualizar dados de um paciente
  static async atualizar(req, res) {
    try {
      const id = req.params.id;
      const { cpf } = req.body;

      // Verificar se o paciente existe e pertence ao usuário
      const pacienteExistente = await Paciente.buscarPorId(id, req.usuarioId);
      if (!pacienteExistente) {
        return res.status(200).json({ 
          mensagem: 'Paciente não encontrado',
          sucesso: false 
        });
      }

      // Verificar se o CPF está sendo alterado e se já existe
      if (cpf && cpf !== pacienteExistente.cpf) {
        const cpfExiste = await Paciente.cpfExiste(cpf, req.usuarioId, id);
        if (cpfExiste) {
          return res.status(400).json({ 
            mensagem: 'CPF já cadastrado para outro paciente' 
          });
        }
      }

      // Remover campos que não devem ser atualizados diretamente
      const dadosAtualizacao = { ...req.body };
      delete dadosAtualizacao.id;
      delete dadosAtualizacao.usuario_id;
      delete dadosAtualizacao.criado_em;

      // Atualizar o paciente
      const pacienteAtualizado = await Paciente.atualizar(id, req.usuarioId, dadosAtualizacao);

      res.status(200).json({
        mensagem: 'Paciente atualizado com sucesso',
        paciente: pacienteAtualizado
      });
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error);
      res.status(500).json({ mensagem: 'Erro ao atualizar dados do paciente' });
    }
  }

  // Excluir um paciente
  static async excluir(req, res) {
    try {
      const id = req.params.id;

      // Verificar se o paciente existe e pertence ao usuário
      const paciente = await Paciente.buscarPorId(id, req.usuarioId);
      if (!paciente) {
        return res.status(200).json({ 
          mensagem: 'Paciente não encontrado',
          sucesso: false 
        });
      }

      // Se o paciente tiver foto, remover o arquivo
      if (paciente.foto) {
        const caminhoFoto = path.join(__dirname, '..', paciente.foto.replace(/^\//, ''));
        if (fs.existsSync(caminhoFoto)) {
          fs.unlinkSync(caminhoFoto);
        }
      }

      // Excluir o paciente (e suas evoluções, conforme implementado no modelo)
      await Paciente.excluir(id, req.usuarioId);

      res.status(200).json({ mensagem: 'Paciente excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir paciente:', error);
      res.status(500).json({ mensagem: 'Erro ao excluir paciente' });
    }
  }

  // Atualizar foto do paciente
  static async atualizarFoto(req, res) {
    try {
      // O middleware de upload já salvou o arquivo
      if (!req.file) {
        return res.status(400).json({ mensagem: 'Nenhuma imagem foi enviada' });
      }

      const id = req.params.id;
      const caminhoRelativo = `/uploads/pacientes/${path.basename(req.file.path)}`;

      // Verificar se o paciente existe e pertence ao usuário
      const paciente = await Paciente.buscarPorId(id, req.usuarioId);
      if (!paciente) {
        // Se o paciente não existir, remover o arquivo que foi enviado
        fs.unlinkSync(req.file.path);
        return res.status(200).json({ 
          mensagem: 'Paciente não encontrado',
          sucesso: false 
        });
      }

      // Se o paciente já tiver uma foto, remover a antiga
      if (paciente.foto) {
        const caminhoAntigo = path.join(__dirname, '..', paciente.foto.replace(/^\//, ''));
        if (fs.existsSync(caminhoAntigo)) {
          fs.unlinkSync(caminhoAntigo);
        }
      }

      // Atualizar o caminho da foto no banco de dados
      await Paciente.atualizar(id, req.usuarioId, { foto: caminhoRelativo });

      res.status(200).json({
        mensagem: 'Foto atualizada com sucesso',
        foto: caminhoRelativo
      });
    } catch (error) {
      console.error('Erro ao atualizar foto:', error);
      res.status(500).json({ mensagem: 'Erro ao atualizar foto do paciente' });
    }
  }

  // Obter estatísticas para o dashboard
  static async obterEstatisticas(req, res) {
    try {
      // Obter o ID do usuário autenticado
      const usuarioId = req.usuarioId;
      
      // Buscar estatísticas no modelo
      const totalPacientes = await Paciente.contarPacientes(usuarioId);
      const pacientesNovos = await Paciente.contarPacientesNovos(usuarioId);
      const evolucoesMes = await Paciente.contarEvolucoesMes(usuarioId);
      const evolucoesHoje = await Paciente.contarEvolucoesHoje(usuarioId);
      
      // Retornar estatísticas (sempre retorna valores, mesmo que sejam 0)
      res.status(200).json({
        totalPacientes: totalPacientes || 0,
        pacientesNovos: pacientesNovos || 0,
        evolucoesMes: evolucoesMes || 0,
        evolucoesHoje: evolucoesHoje || 0
      });
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      res.status(500).json({ mensagem: 'Erro ao obter estatísticas' });
    }
  }
}

module.exports = PacienteController;