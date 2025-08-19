const pool = require('../config/database');

class Evolucao {
  constructor(evolucao) {
    this.id = evolucao.id;
    this.paciente_id = evolucao.paciente_id;
    this.data_hora = evolucao.data_hora;
    this.titulo = evolucao.titulo || '';
    this.observacao = evolucao.observacao;
    // Manter compatibilidade com campos antigos e frontend
    this.data_sessao = evolucao.data_hora;
    this.data_evolucao = evolucao.data_hora; // Para compatibilidade com frontend
    this.descricao = evolucao.observacao;
    this.conteudo = evolucao.observacao; // Para compatibilidade com frontend
    this.diagnostico = evolucao.diagnostico || '';
    this.conduta = evolucao.conduta || '';
    this.criado_em = evolucao.data_hora;
  }

  // Criar uma nova evolução
  static async criar(novaEvolucao) {
    const query = `
      INSERT INTO evolucoes 
      (paciente_id, data_hora, titulo, observacao) 
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      novaEvolucao.paciente_id,
      novaEvolucao.data_hora || new Date(),
      novaEvolucao.titulo || '',
      novaEvolucao.observacao || novaEvolucao.descricao || ''
    ]);

    const id = result.insertId;
    return { id, ...novaEvolucao };
  }

  // Buscar evolução por ID
  static async buscarPorId(id) {
    const [rows] = await pool.execute('SELECT * FROM evolucoes WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return new Evolucao(rows[0]);
  }

  // Listar evoluções de um paciente
  static async listarPorPaciente(pacienteId) {
    const [rows] = await pool.execute(
      'SELECT * FROM evolucoes WHERE paciente_id = ? ORDER BY data_hora DESC, id DESC', 
      [pacienteId]
    );
    return rows.map(row => new Evolucao(row));
  }

  // Verificar se paciente pertence ao usuário antes de listar evoluções
  static async verificarPacienteDoUsuario(pacienteId, usuarioId) {
    const [rows] = await pool.execute(
      'SELECT id FROM pacientes WHERE id = ? AND usuario_id = ?', 
      [pacienteId, usuarioId]
    );
    return rows.length > 0;
  }

  // Atualizar evolução
  static async atualizar(id, evolucaoAtualizada) {
    let query = 'UPDATE evolucoes SET ';
    const values = [];
    const fields = [];

    // Construir a query dinamicamente com os campos a serem atualizados
    for (const [key, value] of Object.entries(evolucaoAtualizada)) {
      // Pular o ID, paciente_id e criado_em
      if (key !== 'id' && key !== 'paciente_id' && key !== 'criado_em') {
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

  // Excluir evolução
  static async excluir(id) {
    const [result] = await pool.execute('DELETE FROM evolucoes WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Listar evoluções recentes para o dashboard
  static async listarRecentes(usuarioId, limite = 5) {
    const query = `
      SELECT e.*, p.nome_completo as paciente_nome, p.id as paciente_id,
             e.data_hora as data_evolucao
      FROM evolucoes e
      INNER JOIN pacientes p ON e.paciente_id = p.id
      WHERE p.usuario_id = ?
      ORDER BY e.data_hora DESC, e.id DESC
      LIMIT ?
    `;
    
    const [rows] = await pool.execute(query, [usuarioId, limite]);
    return rows;
  }
}

module.exports = Evolucao;