const { databaseConnection } = require('./database_connection.js');
const RabbitMQ = require("./rabbitmq.js");

const StartServer = async () => {
  await databaseConnection();
  RabbitMQ();
};

StartServer();







