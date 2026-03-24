const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Student Performance Analytics API',
    version: '1.0.0',
    description: 'API Documentation for the Student Performance Analytics System',
  },
  servers: [
    {
      url: '/',
      description: 'Current environment (Local or Deployed)',
    }
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'sessionId',
        description: 'Cookie containing the JWT token (used by frontend)',
      },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Authorization header using the Bearer scheme (alternative to cookies)',
      }
    },
  },
  security: [
    { cookieAuth: [] },
    { bearerAuth: [] }
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Scans all files in the routes directory for JSDoc comments
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
