const bcrypt = require('bcryptjs');
const pool = require('./database');

async function seedDatabase() {
  try {
    console.log('Iniciando seed do banco de dados...');
    
    // Verificar se já existem dados
    const [usuarios] = await pool.query('SELECT COUNT(*) as count FROM usuarios');
    if (usuarios[0].count > 0) {
      console.log('O banco de dados já possui dados. Pulando seed.');
      process.exit(0);
    }
    
    // Criar usuário padrão para testes (carlos/123)
    const senhaHash = await bcrypt.hash('123', 10);
    await pool.query(
      'INSERT INTO usuarios (usuario, senha, nome_completo, cpf, crp, data_nascimento, email, telefone, especialidade, endereco, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['carlos', senhaHash, 'Carlos Psicólogo', '12345678900', '123456/00', '1990-01-01', 'carlos@example.com', '(11) 99999-9999', null, null, null]
    );
    console.log('Usuário padrão de testes criado com sucesso!');
    
    // Criar alguns pacientes de exemplo
    const [result] = await pool.query('SELECT id FROM usuarios WHERE usuario = ?', ['carlos']);
    const usuarioId = result[0].id;
    
    await pool.query(
      'INSERT INTO pacientes (usuario_id, nome_completo, cpf, data_nascimento, telefone, email, endereco) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [usuarioId, 'João Silva', '98765432100', '1985-05-15', '(11) 98888-7777', 'joao@email.com', 'Rua A, 123']
    );
    
    await pool.query(
      'INSERT INTO pacientes (usuario_id, nome_completo, cpf, data_nascimento, telefone, email, endereco) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [usuarioId, 'Maria Oliveira', '45678912300', '1990-10-20', '(11) 97777-6666', 'maria@email.com', 'Av. B, 456']
    );
    
    console.log('Pacientes de exemplo criados com sucesso!');
    
    // Criar algumas evoluções de exemplo
    const [pacientes] = await pool.query('SELECT id FROM pacientes WHERE usuario_id = ?', [usuarioId]);
    
    if (pacientes.length > 0) {
      const pacienteId1 = pacientes[0].id;
      const pacienteId2 = pacientes.length > 1 ? pacientes[1].id : pacientes[0].id;
      
      const dataHoje = new Date().toISOString().split('T')[0];
      const dataOntem = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      await pool.query(
        'INSERT INTO evolucoes (paciente_id, data_evolucao, titulo, descricao) VALUES (?, ?, ?, ?)',
        [pacienteId1, dataHoje, 'Primeira consulta', 'Paciente relatou ansiedade e dificuldades para dormir. Iniciamos trabalho de técnicas de respiração e relaxamento.']
      );
      
      await pool.query(
        'INSERT INTO evolucoes (paciente_id, data_evolucao, titulo, descricao) VALUES (?, ?, ?, ?)',
        [pacienteId2, dataOntem, 'Sessão inicial', 'Avaliação inicial do paciente. Histórico familiar de depressão. Definimos plano terapêutico inicial.']
      );
      
      console.log('Evoluções de exemplo criadas com sucesso!');
    }
    
    console.log('Seed do banco de dados concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao realizar seed do banco de dados:', error);
    process.exit(1);
  }
}

seedDatabase();
