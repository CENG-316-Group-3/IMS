const Sequelize = require('sequelize');
// confing env
const path = "./config.env"
require('dotenv').config({path:path});
/* console.log(process.env.DB_NAME)
console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)
console.log(process.env.DB_HOST) */

/* const sequelize = new Sequelize('auth_db', 'root', 'your_root_password', {
    host: 'localhost',
    dialect: 'mysql',
    port:3306,
    logging: false,
  }); */




/* const sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
    host: config.DB_HOST,
    dialect: config.DB_DIALECT,
    port: config.DB_PORT,
    logging: config.DB_LOGGING,
  });
 */

  const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT, // Specify the database dialect explicitly
    port: process.env.DB_PORT,
    logging: process.env.DB_LOGGING === 'true' ? true : false, // Convert string to boolean
  });
module.exports = sequelize;