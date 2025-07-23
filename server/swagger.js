const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pizza Delivery API',
      version: '1.0.0',
      description: 'API for registration, OTP and login'
    },
    servers: [
      {
        url: 'http://localhost:5000/api/users',
        description: 'Local development server'
      }
    ],
  },
  apis: ['./routes/*.js'], // 👈 Look for Swagger comments here
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
