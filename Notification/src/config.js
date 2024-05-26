// config/config.js
module.exports = {
    development: {
      username: 'root',
      password: 'your_root_password',
      database: 'notification',
      host: 'localhost',
      dialect: 'mysql',
      port: 3307,
    },
    test: {
      username: 'root',
      password: '0000',
      database: 'notification',
      host: '127.0.0.1',
      dialect: 'mysql'
    },
    production: {
      username: 'root',
      password: '0000',
      database: 'notification',
      host: '127.0.0.1',
      dialect: 'mysql'
    }
  };