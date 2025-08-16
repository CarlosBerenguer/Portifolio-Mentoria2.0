const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
  // Primeiro, conectar sem especificar o banco de dados
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });

  try {
    // Ler o arquivo SQL
    const sqlFilePath = path.join(__dirname, 'init-db.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    // Dividir o script em comandos individuais
    const commands = sqlScript.split(';').filter(cmd => cmd.trim() !== '');

    // Executar cada comando
    for (const command of commands) {
      try {
        await connection.query(command + ';');
        console.log(`Comando SQL executado com sucesso: ${command.substring(0, 50)}...`);
      } catch (err) {
        // Ignorar erros de índice já existente
        if (err.code === 'ER_DUP_KEYNAME') {
          console.log(`Índice já existe, ignorando: ${command.substring(0, 50)}...`);
        } else {
          throw err;
        }
      }
    }

    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  } finally {
    await connection.end();
  }
}

// Executar a função se este arquivo for chamado diretamente
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;