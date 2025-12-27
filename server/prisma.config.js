// server/prisma.config.js
require('dotenv').config();

module.exports = {
  schema: "../client/prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
};