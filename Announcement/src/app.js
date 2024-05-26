const express = require('express');
const { databaseConnection } = require('./database_connection.js');
const bodyParser = require('body-parser');
//const announcementApi = require("./announcement_api.js");
const startRabbitMQConsumer = require("./rabbitmq.js");

const StartServer = async () => {
  //const app = express();

  // Add bodyParser middleware
  //app.use(bodyParser.json());

  // Establish database connection
  await databaseConnection();

  // Configure the Express app
  //await announcementApi(app);
  //app.use(announcementApi);

  
/*
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  }).on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  });*/

  startRabbitMQConsumer();
};

StartServer();







