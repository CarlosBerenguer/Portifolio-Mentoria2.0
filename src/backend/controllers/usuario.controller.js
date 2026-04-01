const Usuario = require('../models/usuario.model');
const fs = require('fs');
const path = require('path');

class UsuarioController {
  // Obter dados do perfil do usuário logado
  static async obterPerfil(req, res) {
    try {
      const usuario = await Usuario.buscarPorId(req.usuarioId);
      if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      }

      // Adicionar campo created_at para compatibilidade com o frontend
      const usuarioComData = {
        ...usuario,
        created_at: usuario.criado_em
      };

      res.status(200).json(usuarioComData);
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      res.status(500).json({ mensagem: 'Erro ao obter dados do perfil' });
    }
  }

  // Obter dados do usuário por ID
  static async obterUsuario(req, res) {
    try {
      const id = req.params.id;

      // Verificar se o ID do usuário na requisição é o mesmo do token
      // (um usuário só pode acessar seus próprios dados)
      if (parseInt(id) !== req.usuarioId) {
        return res.status(403).json({ 
          mensagem: 'Acesso negado. Você só pode acessar seus próprios dados.' 
        });
      }

      const usuario = await Usuario.buscarPorId(id);
      if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      }

      res.status(200).json(usuario);
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      res.status(500).json({ mensagem: 'Erro ao obter dados do usuário' });
    }
  }

  // Atualizar dados do usuário
  static async atualizarUsuario(req, res) {
    try {
      const id = req.params.id;

      // Verificar se o ID do usuário na requisição é o mesmo do token
      if (parseInt(id) !== req.usuarioId) {
        return res.status(403).json({ 
          mensagem: 'Acesso negado. Você só pode atualizar seus próprios dados.' 
        });
      }

      // Verificar se o usuário existe
      const usuarioExistente = await Usuario.buscarPorId(id);
      if (!usuarioExistente) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      }

      // Remover campos que não devem ser atualizados diretamente
      const dadosAtualizacao = { ...req.body };
      delete dadosAtualizacao.id;
      delete dadosAtualizacao.senha;
      delete dadosAtualizacao.criado_em;

      // Verificar se o email está sendo alterado e se já existe
      if (dadosAtualizacao.email && dadosAtualizacao.email !== usuarioExistente.email) {
        const emailExistente = await Usuario.buscarPorEmail(dadosAtualizacao.email);
        if (emailExistente) {
          return res.status(400).json({ mensagem: 'Email já está em uso por outro usuário' });
        }
      }

      // Verificar se o CPF está sendo alterado e se já existe
      if (dadosAtualizacao.cpf && dadosAtualizacao.cpf !== usuarioExistente.cpf) {
        const cpfExistente = await Usuario.buscarPorCPF(dadosAtualizacao.cpf);
        if (cpfExistente) {
          return res.status(400).json({ mensagem: 'CPF já está cadastrado para outro usuário' });
        }
      }

      // Atualizar o usuário
      const usuarioAtualizado = await Usuario.atualizar(id, dadosAtualizacao);

      res.status(200).json({
        mensagem: 'Usuário atualizado com sucesso',
        usuario: usuarioAtualizado
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ mensagem: 'Erro ao atualizar dados do usuário' });
    }
  }

  // Atualizar senha do usuário
  static async atualizarSenha(req, res) {
    try {
      const id = req.params.id;
      const { senhaAtual, novaSenha } = req.body;

      // Verificar se o ID do usuário na requisição é o mesmo do token
      if (parseInt(id) !== req.usuarioId) {
        return res.status(403).json({ 
          mensagem: 'Acesso negado. Você só pode atualizar sua própria senha.' 
        });
      }

      // Verificar se as senhas foram fornecidas
      if (!senhaAtual || !novaSenha) {
        return res.status(400).json({ 
          mensagem: 'Senha atual e nova senha são obrigatórias' 
        });
      }

      // Buscar usuário
      const usuario = await Usuario.buscarPorId(id);
      if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      }

      // Verificar se a senha atual está correta
      const senhaCorreta = await Usuario.verificarSenha(senhaAtual, usuario.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ mensagem: 'Senha atual incorreta' });
      }

      // Atualizar a senha
      await Usuario.atualizarSenha(id, novaSenha);

      res.status(200).json({ mensagem: 'Senha atualizada com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      res.status(500).json({ mensagem: 'Erro ao atualizar senha' });
    }
  }

  // Atualizar foto do usuário
  static async atualizarFoto(req, res) {
    try {
      // O middleware de upload já salvou o arquivo
      if (!req.file) {
        return res.status(400).json({ mensagem: 'Nenhuma imagem foi enviada' });
      }

      const id = req.usuarioId;
      const caminhoRelativo = `/uploads/usuarios/${path.basename(req.file.path)}`;

      // Buscar usuário para verificar se já tem foto
      const usuario = await Usuario.buscarPorId(id);
      if (!usuario) {
        // Se o usuário não existir, remover o arquivo que foi enviado
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      }

      // Se o usuário já tiver uma foto, remover a antiga
      if (usuario.foto) {
        const caminhoAntigo = path.join(__dirname, '..', usuario.foto.replace(/^\//, ''));
        if (fs.existsSync(caminhoAntigo)) {
          fs.unlinkSync(caminhoAntigo);
        }
      }

      // Atualizar o caminho da foto no banco de dados
      await Usuario.atualizar(id, { foto: caminhoRelativo });

      res.status(200).json({
        mensagem: 'Foto atualizada com sucesso',
        foto: caminhoRelativo
      });
    } catch (error) {
      console.error('Erro ao atualizar foto:', error);
      res.status(500).json({ mensagem: 'Erro ao atualizar foto do usuário' });
    }
  }

  // Remover foto do usuário logado
  static async removerFoto(req, res) {
    try {
      const id = req.usuarioId;
      const usuario = await Usuario.buscarPorId(id);

      if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      }

      if (!usuario.foto) {
        return res.status(200).json({ mensagem: 'Nenhuma foto cadastrada', foto: null });
      }

      const caminhoRelativo = usuario.foto.replace(/^\//, '');
      const caminhoAbsoluto = path.join(__dirname, '..', caminhoRelativo);

      if (fs.existsSync(caminhoAbsoluto)) {
        fs.unlinkSync(caminhoAbsoluto);
      }

      await Usuario.atualizar(id, { foto: null });

      res.status(200).json({
        mensagem: 'Foto removida com sucesso',
        foto: null
      });
    } catch (error) {
      console.error('Erro ao remover foto:', error);
      res.status(500).json({ mensagem: 'Erro ao remover foto do usuário' });
    }
  }

  // Obter estatísticas do usuário
  static async obterEstatisticas(req, res) {
    try {
      const usuarioId = req.usuarioId;
      const pool = require('../config/database');

      // Buscar total de pacientes
      const [pacientesResult] = await pool.execute(
        'SELECT COUNT(*) as total FROM pacientes WHERE usuario_id = ?',
        [usuarioId]
      );

      // Buscar total de evoluções (JOIN com pacientes para filtrar por usuario_id)
      const [evolucoesResult] = await pool.execute(
        'SELECT COUNT(*) as total FROM evolucoes e INNER JOIN pacientes p ON e.paciente_id = p.id WHERE p.usuario_id = ?',
        [usuarioId]
      );

      // Buscar evoluções do mês atual (JOIN com pacientes e usando data_hora)
      const [evolucoesMessResult] = await pool.execute(
        'SELECT COUNT(*) as total FROM evolucoes e INNER JOIN pacientes p ON e.paciente_id = p.id WHERE p.usuario_id = ? AND MONTH(e.data_hora) = MONTH(CURDATE()) AND YEAR(e.data_hora) = YEAR(CURDATE())',
        [usuarioId]
      );

      const estatisticas = {
        total_pacientes: pacientesResult[0].total,
        total_evolucoes: evolucoesResult[0].total,
        evolucoes_mes: evolucoesMessResult[0].total
      };

      res.status(200).json(estatisticas);
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      res.status(500).json({ mensagem: 'Erro ao obter estatísticas do usuário' });
    }
  }
}

module.exports = UsuarioController;
