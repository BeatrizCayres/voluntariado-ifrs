const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Voluntariado IFRS',
      version: '1.0.0',
      description: 'API para gerenciamento de eventos e voluntários com autenticação JWT',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
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
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'admin@ifrs.edu.br' },
            password: { type: 'string', example: '123456' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                email: { type: 'string', example: 'admin@ifrs.edu.br' },
                role: { type: 'string', example: 'admin' },
              },
            },
          },
        },
        Event: {
          type: 'object',
          required: ['name', 'category', 'location', 'eventDate', 'capacity'],
          properties: {
            id: { type: 'integer', readOnly: true },
            name: { type: 'string', minLength: 8, example: 'Mutirão Ambiental' },
            category: { type: 'string' },
            location: { type: 'string' },
            eventDate: { type: 'string', format: 'date' },
            capacity: {
              type: 'integer',
              minimum: 1,
              description: 'Número máximo de voluntários inscritos no evento',
            },
          },
        },
        EventRegistrationRequest: {
          type: 'object',
          required: ['volunteer_id'],
          properties: {
            volunteer_id: { type: 'integer', example: 3 },
          },
        },
        Volunteer: {
          type: 'object',
          required: ['name', 'email', 'telephone'],
          properties: {
            id: { type: 'integer', readOnly: true },
            name: { type: 'string', minLength: 8, example: 'Maria Silva' },
            email: { type: 'string', format: 'email', example: 'maria@gmail.com' },
            telephone: {
              type: 'string',
              example: '54988887777',
              description: 'DDD + número (mín. 11 dígitos)',
            },
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../controllers/*.js'),
    path.join(__dirname, '../app.js'),
  ],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
