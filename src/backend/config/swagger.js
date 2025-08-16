const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuração do Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PsyControl API',
      version: '1.0.0',
      description: 'API para o sistema de controle de psicólogos PsyControl',
      contact: {
        name: 'Suporte PsyControl',
        email: 'suporte@psycontrol.com.br'
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento'
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [__dirname + '/../routes/*.routes.js'], // Caminho para os arquivos com anotações JSDoc
};

const specs = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, { explorer: true })
};