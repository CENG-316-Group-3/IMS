// database/index.js
const { Sequelize } = require('sequelize');
const path = "./config.env"
require('dotenv').config({path:path});

// const env = process.env.NODE_ENV || 'development';
// const dbConfig = config;

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
});

const databaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

module.exports = { sequelize, databaseConnection };