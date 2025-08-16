const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

// Middleware para verificar o token JWT
const verificarToken = (req, res, next) => {
  // Obter o token do cabeçalho Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }

  // Formato esperado: "Bearer TOKEN"
  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ mensagem: 'Erro no formato do token' });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ mensagem: 'Token mal formatado' });
  }

  // Verificar o token
  jwt.verify(token, 'psycontrol_secret_key', async (err, decoded) => {
    if (err) {
      return res.status(401).json({ mensagem: 'Token inválido' });
    }

    // Verificar se o usuário ainda existe no banco de dados
    const usuario = await Usuario.buscarPorId(decoded.id);
    if (!usuario) {
      return res.status(401).json({ mensagem: 'Usuário não encontrado' });
    }

    // Adicionar o ID do usuário ao objeto de requisição
    req.usuarioId = decoded.id;
    return next();
  });
};

module.exports = { verificarToken };