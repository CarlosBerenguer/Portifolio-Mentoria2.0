const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class Usuario {
  constructor(usuario) {
    this.id = usuario.id;
    this.usuario = usuario.usuario;
    this.senha = usuario.senha;
    this.nome_completo = usuario.nome_completo;
    this.cpf = usuario.cpf;
    this.crp = usuario.crp;
    this.data_nascimento = usuario.data_nascimento;
    this.email = usuario.email;
    this.telefone = usuario.telefone;
    this.especialidade = usuario.especialidade;
    this.endereco = usuario.endereco;
    this.foto = usuario.foto;
    this.criado_em = usuario.criado_em;
  }

  // Criar um novo usuário
  static async criar(novoUsuario) {
    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(novoUsuario.senha, salt);

    const query = `
      INSERT INTO usuarios 
      (usuario, senha, nome_completo, cpf, crp, data_nascimento, email, telefone, especialidade, endereco, foto) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      novoUsuario.usuario,
      senhaHash,
      novoUsuario.nome_completo,
      novoUsuario.cpf,
      novoUsuario.crp,
      novoUsuario.data_nascimento || null,
      novoUsuario.email,
      novoUsuario.telefone || null,
      novoUsuario.especialidade || null,
      novoUsuario.endereco || null,
      novoUsuario.foto || null
    ]);

    const id = result.insertId;
    return { id, ...novoUsuario, senha: undefined };
  }

  // Buscar usuário por ID
  static async buscarPorId(id) {
    const [rows] = await pool.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    
    const usuario = rows[0];
    delete usuario.senha; // Não retornar a senha
    return new Usuario(usuario);
  }

  // Buscar usuário por nome de usuário
  static async buscarPorUsuario(usuario) {
    const [rows] = await pool.execute('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
    if (rows.length === 0) return null;
    return new Usuario(rows[0]);
  }

  // Buscar usuário por CPF
  static async buscarPorCPF(cpf) {
    const [rows] = await pool.execute('SELECT * FROM usuarios WHERE cpf = ?', [cpf]);
    if (rows.length === 0) return null;
    return new Usuario(rows[0]);
  }

  // Buscar usuário por email
  static async buscarPorEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) return null;
    return new Usuario(rows[0]);
  }

  // Atualizar usuário
  static async atualizar(id, usuarioAtualizado) {
    let query = 'UPDATE usuarios SET ';
    const values = [];
    const fields = [];

    // Construir a query dinamicamente com os campos a serem atualizados
    for (const [key, value] of Object.entries(usuarioAtualizado)) {
      // Pular o ID e a senha (a senha tem um método separado)
      if (key !== 'id' && key !== 'senha' && key !== 'criado_em') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      throw new Error('Nenhum campo para atualizar');
    }

    query += fields.join(', ');
    query += ' WHERE id = ?';
    values.push(id);

    await pool.execute(query, values);
    return this.buscarPorId(id);
  }

  // Atualizar senha
  static async atualizarSenha(id, novaSenha) {
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(novaSenha, salt);

    await pool.execute('UPDATE usuarios SET senha = ? WHERE id = ?', [senhaHash, id]);
    return true;
  }

  // Verificar senha
  static async verificarSenha(senhaPlana, senhaHash) {
    return await bcrypt.compare(senhaPlana, senhaHash);
  }
}

module.exports = Usuario;