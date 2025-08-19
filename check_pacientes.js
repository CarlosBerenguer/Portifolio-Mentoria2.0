const pool = require('./src/backend/config/database.js');

async function checkDatabase() {
  try {
    // Verificar estrutura da tabela evolucoes
    console.log('=== ESTRUTURA DA TABELA EVOLUCOES ===');
    const [columns] = await pool.execute('DESCRIBE evolucoes');
    console.table(columns);
    
    // Verificar se a tabela existe e tem dados
    const [count] = await pool.execute('SELECT COUNT(*) as total FROM evolucoes');
    console.log('\nTotal de registros na tabela evolucoes:', count[0].total);
    
  } catch (error) {
    console.error('Erro ao verificar estrutura:', error);
  } finally {
    await pool.end();
  }
}

checkDatabase();