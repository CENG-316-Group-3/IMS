const Sequelize = require("sequelize");
const path = "./config.env";
require('dotenv').config({path});
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER || "root", process.env.DB_PASSWORD, {
    dialect: process.env.DB_DIALECT || "mysql",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
});

module.exports = sequelize;