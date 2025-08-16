const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importar rotas
const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const pacienteRoutes = require('./routes/paciente.routes');
const evolucaoRoutes = require('./routes/evolucao.routes');

// Importar configuração do Swagger
const swagger = require('./config/swagger');

// Inicializar app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/evolucoes', evolucaoRoutes);

// Documentação Swagger
app.use('/api-docs', swagger.serve, swagger.setup);

// Rota para o frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

module.exports = app;