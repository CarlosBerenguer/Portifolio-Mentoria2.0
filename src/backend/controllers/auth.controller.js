const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

// Controlador para autenticação
class AuthController {
  // Registrar um novo usuário
  static async registrar(req, res) {
    try {
      console.log('=== DADOS RECEBIDOS NO REGISTRO ===');
      console.log('Todos os campos do req.body:', JSON.stringify(req.body, null, 2));
      console.log('Campos recebidos:', Object.keys(req.body));
      console.log('=====================================');
      
      const { usuario, senha, nome_completo, cpf, crp, email, data_nascimento } = req.body;

      // Validar campos obrigatórios
      const camposObrigatorios = {
        usuario: 'Usuário',
        senha: 'Senha',
        nome_completo: 'Nome completo',
        cpf: 'CPF',
        crp: 'CRP',
        email: 'Email'
      };
      
      const camposFaltantes = [];
      Object.keys(camposObrigatorios).forEach(campo => {
        if (!req.body[campo] || req.body[campo].trim() === '') {
          camposFaltantes.push(camposObrigatorios[campo]);
        }
      });
      
      if (camposFaltantes.length > 0) {
        return res.status(400).json({ 
          mensagem: `Os seguintes campos são obrigatórios: ${camposFaltantes.join(', ')}`,
          campos_faltantes: camposFaltantes
        });
      }
      
      // Validar formato da data de nascimento
      if (data_nascimento) {
        const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dataRegex.test(data_nascimento)) {
          return res.status(400).json({
            mensagem: 'Formato de data de nascimento inválido. Use YYYY-MM-DD.',
            erro: 'FORMATO_DATA_INVALIDO',
            detalhe: 'A data deve estar no formato YYYY-MM-DD'
          });
        }
        
        // Verificar se a data é válida
        const dataObj = new Date(data_nascimento);
        if (isNaN(dataObj.getTime())) {
          return res.status(400).json({
            mensagem: 'Data de nascimento inválida',
            erro: 'DATA_INVALIDA',
            detalhe: 'A data fornecida não é uma data válida'
          });
        }
      }

      // Verificar se o nome de usuário já existe
      const usuarioExistente = await Usuario.buscarPorUsuario(usuario);
      if (usuarioExistente) {
        return res.status(400).json({ mensagem: 'Nome de usuário já está em uso' });
      }

      // Verificar se o CPF já existe
      const cpfExistente = await Usuario.buscarPorCPF(cpf);
      if (cpfExistente) {
        return res.status(400).json({ mensagem: 'CPF já está cadastrado' });
      }

      // Verificar se o email já existe
      const emailExistente = await Usuario.buscarPorEmail(email);
      if (emailExistente) {
        return res.status(400).json({ mensagem: 'Email já está em uso' });
      }

      // Criar o novo usuário
      const novoUsuario = await Usuario.criar(req.body);

      // Gerar token JWT
      const token = jwt.sign({ id: novoUsuario.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      });

      res.status(201).json({
        mensagem: 'Usuário registrado com sucesso',
        usuario: novoUsuario,
        token
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      
      // Tratamento de erros específicos
      if (error.code === 'ER_DUP_ENTRY') {
        // Erro de duplicação de entrada no banco de dados
        if (error.sqlMessage.includes('usuarios.usuario')) {
          return res.status(400).json({ 
            mensagem: 'Nome de usuário já está em uso',
            erro: error.code,
            detalhe: 'Duplicação de nome de usuário'
          });
        } else if (error.sqlMessage.includes('usuarios.cpf')) {
          return res.status(400).json({ 
            mensagem: 'CPF já está cadastrado',
            erro: error.code,
            detalhe: 'Duplicação de CPF'
          });
        } else if (error.sqlMessage.includes('usuarios.email')) {
          return res.status(400).json({ 
            mensagem: 'Email já está em uso',
            erro: error.code,
            detalhe: 'Duplicação de email'
          });
        } else if (error.sqlMessage.includes('usuarios.crp')) {
          return res.status(400).json({ 
            mensagem: 'CRP já está cadastrado',
            erro: error.code,
            detalhe: 'Duplicação de CRP'
          });
        }
      } else if (error.code === 'ER_BAD_FIELD_ERROR') {
        // Erro de campo inválido
        return res.status(400).json({ 
          mensagem: 'Campo inválido na requisição',
          erro: error.code,
          detalhe: error.sqlMessage
        });
      } else if (error.code === 'ER_NO_REFERENCED_ROW') {
        // Erro de chave estrangeira
        return res.status(400).json({ 
          mensagem: 'Referência inválida',
          erro: error.code,
          detalhe: error.sqlMessage
        });
      } else if (error.code === 'ER_DATA_TOO_LONG') {
        // Erro de dados muito longos
        return res.status(400).json({ 
          mensagem: 'Dados muito longos para um campo',
          erro: error.code,
          detalhe: error.sqlMessage
        });
      }
      
      // Erro genérico
      res.status(500).json({ 
        mensagem: 'Erro ao registrar usuário', 
        erro: error.code || 'ERRO_DESCONHECIDO',
        detalhe: error.sqlMessage || error.message || 'Erro interno do servidor'
      });
    }
  }

  // Login de usuário
  static async login(req, res) {
    try {
      const { usuario, senha } = req.body;

      // Validar campos obrigatórios
      if (!usuario || !senha) {
        return res.status(400).json({ 
          mensagem: 'Usuário e senha são obrigatórios' 
        });
      }

      // Buscar usuário
      const usuarioEncontrado = await Usuario.buscarPorUsuario(usuario);
      if (!usuarioEncontrado) {
        return res.status(401).json({ mensagem: 'Credenciais inválidas' });
      }

      // Verificar senha
      const senhaCorreta = await Usuario.verificarSenha(senha, usuarioEncontrado.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ mensagem: 'Credenciais inválidas' });
      }

      // Remover a senha do objeto de resposta
      const usuarioSemSenha = { ...usuarioEncontrado };
      delete usuarioSemSenha.senha;

      // Gerar token JWT
      const token = jwt.sign({ id: usuarioEncontrado.id }, 'psycontrol_secret_key', {
        expiresIn: '24h'
      });

      res.status(200).json({
        mensagem: 'Login realizado com sucesso',
        usuario: usuarioSemSenha,
        token
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ mensagem: 'Erro ao fazer login' });
    }
  }

  // Verificar token (rota protegida para testar autenticação)
  static async verificarToken(req, res) {
    try {
      // O middleware de autenticação já verificou o token
      // e adicionou o ID do usuário à requisição
      const usuario = await Usuario.buscarPorId(req.usuarioId);
      
      if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      }

      res.status(200).json({
        mensagem: 'Token válido',
        usuario
      });
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      res.status(500).json({ mensagem: 'Erro ao verificar token' });
    }
  }
}

module.exports = AuthController;