const m2s = require('mongoose-to-swagger');
const Admin = require('./models/admins.models');
const Participant = require('./models/participant.models')
const Transaction = require('./models/transaction.models')
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      version: "1.0.0",
      title: "Stripe and Auth API",
      description: "A boilerplate for login and stripe checkout",
    },
    components: {
      schemas: {
        Admin: m2s(Admin),
        Participant: m2s(Participant),
        Transaction: m2s(Transaction),
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  // 👇 This is the critical part: tell swagger-jsdoc where to find your route/controller annotations
  apis: ['./routes/*.js', './controllers/*.js'], // adjust paths if needed
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
