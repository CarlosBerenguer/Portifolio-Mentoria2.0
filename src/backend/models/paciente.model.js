const pool = require('../config/database');

class Paciente {
  constructor(paciente) {
    this.id = paciente.id;
    this.nome_completo = paciente.nome_completo;
    this.data_nascimento = paciente.data_nascimento;
    this.cpf = paciente.cpf;
    this.genero = paciente.genero;
    this.estado_civil = paciente.estado_civil;
    this.profissao = paciente.profissao;
    this.telefone = paciente.telefone;
    this.email = paciente.email;
    this.endereco = paciente.endereco;
    this.foto = paciente.foto;
    this.observacoes = paciente.observacoes;
    this.criado_em = paciente.criado_em;
    this.usuario_id = paciente.usuario_id;
  }

  // Criar um novo paciente
  static async criar(novoPaciente) {
    const query = `
      INSERT INTO pacientes 
      (nome_completo, data_nascimento, cpf, genero, estado_civil, profissao, 
       telefone, email, endereco, foto, observacoes, usuario_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      novoPaciente.nome_completo,
      novoPaciente.data_nascimento,
      novoPaciente.cpf,
      novoPaciente.genero,
      novoPaciente.estado_civil,
      novoPaciente.profissao,
      novoPaciente.telefone,
      novoPaciente.email,
      novoPaciente.endereco,
      novoPaciente.foto,
      novoPaciente.observacoes,
      novoPaciente.usuario_id
    ]);

    const id = result.insertId;
    return { id, ...novoPaciente };
  }

  // Buscar paciente por ID
  static async buscarPorId(id, usuarioId) {
    const [rows] = await pool.execute(
      'SELECT * FROM pacientes WHERE id = ? AND usuario_id = ?', 
      [id, usuarioId]
    );
    
    if (rows.length === 0) return null;
    return new Paciente(rows[0]);
  }

  // Listar todos os pacientes de um usuário
  static async listarPorUsuario(usuarioId, filtro = '', limite = null) {
    let query = 'SELECT * FROM pacientes WHERE usuario_id = ?';
    const params = [usuarioId];

    // Adicionar filtro de busca se fornecido
    if (filtro) {
      query += ' AND (nome_completo LIKE ? OR cpf LIKE ? OR email LIKE ?)';
      const termoBusca = `%${filtro}%`;
      params.push(termoBusca, termoBusca, termoBusca);
    }

    query += ' ORDER BY nome_completo ASC';
    
    // Adicionar limite se fornecido e válido
    if (limite !== null && limite !== undefined && typeof limite === 'number' && limite > 0) {
      // Usar LIMIT diretamente na query para evitar problemas com prepared statements
      query += ` LIMIT ${limite}`;
    }

    const [rows] = await pool.execute(query, params);
    return rows.map(row => new Paciente(row));
  }

  // Atualizar paciente
  static async atualizar(id, usuarioId, pacienteAtualizado) {
    // Verificar se o paciente pertence ao usuário
    const paciente = await this.buscarPorId(id, usuarioId);
    if (!paciente) {
      throw new Error('Paciente não encontrado ou não pertence a este usuário');
    }

    let query = 'UPDATE pacientes SET ';
    const values = [];
    const fields = [];

    // Construir a query dinamicamente com os campos a serem atualizados
    for (const [key, value] of Object.entries(pacienteAtualizado)) {
      // Pular o ID, usuario_id e criado_em
      if (key !== 'id' && key !== 'usuario_id' && key !== 'criado_em') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      throw new Error('Nenhum campo para atualizar');
    }

    query += fields.join(', ');
    query += ' WHERE id = ? AND usuario_id = ?';
    values.push(id, usuarioId);

    await pool.execute(query, values);
    return this.buscarPorId(id, usuarioId);
  }

  // Excluir paciente
  static async excluir(id, usuarioId) {
    // Verificar se o paciente pertence ao usuário
    const paciente = await this.buscarPorId(id, usuarioId);
    if (!paciente) {
      throw new Error('Paciente não encontrado ou não pertence a este usuário');
    }

    // Primeiro excluir todas as evoluções do paciente
    await pool.execute('DELETE FROM evolucoes WHERE paciente_id = ?', [id]);
    
    // Depois excluir o paciente
    const [result] = await pool.execute(
      'DELETE FROM pacientes WHERE id = ? AND usuario_id = ?', 
      [id, usuarioId]
    );

    return result.affectedRows > 0;
  }

  // Verificar se CPF já existe para outro paciente do mesmo usuário
  static async cpfExiste(cpf, usuarioId, pacienteId = null) {
    let query = 'SELECT id FROM pacientes WHERE cpf = ? AND usuario_id = ?';
    const params = [cpf, usuarioId];

    // Se for atualização, excluir o próprio paciente da verificação
    if (pacienteId) {
      query += ' AND id != ?';
      params.push(pacienteId);
    }

    const [rows] = await pool.execute(query, params);
    return rows.length > 0;
  }

  // Contar total de pacientes de um usuário
  static async contarPacientes(usuarioId) {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as total FROM pacientes WHERE usuario_id = ?',
      [usuarioId]
    );
    return rows[0].total;
  }

  // Contar pacientes novos (cadastrados nos últimos 30 dias)
  static async contarPacientesNovos(usuarioId) {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as total FROM pacientes WHERE usuario_id = ? AND criado_em >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)',
      [usuarioId]
    );
    return rows[0].total;
  }

  // Contar evoluções do mês atual
  static async contarEvolucoesMes(usuarioId) {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) as total FROM evolucoes e
       INNER JOIN pacientes p ON e.paciente_id = p.id
       WHERE p.usuario_id = ? AND MONTH(e.data_sessao) = MONTH(CURDATE()) AND YEAR(e.data_sessao) = YEAR(CURDATE())`,
      [usuarioId]
    );
    return rows[0].total;
  }

  // Contar evoluções de hoje
  static async contarEvolucoesHoje(usuarioId) {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) as total FROM evolucoes e
       INNER JOIN pacientes p ON e.paciente_id = p.id
       WHERE p.usuario_id = ? AND DATE(e.data_sessao) = CURDATE()`,
      [usuarioId]
    );
    return rows[0].total;
  }

}

module.exports = Paciente;