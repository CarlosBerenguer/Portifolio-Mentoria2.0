const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuração da conexão com o banco de dados
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: 'root', // Definindo a senha diretamente
  database: process.env.DB_NAME || 'psicologos_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testar a conexão
pool.getConnection()
  .then(connection => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    connection.release();
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

module.exports = pool;