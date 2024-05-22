const express = require('express');
const secretariatRouter = express.Router();
const secretariatController = require('../controllers/secretariat-controller');

secretariatRouter
    .route('/register')
    .post(secretariatController.register);

secretariatRouter
    .route('/login')
    .post(secretariatController.login);





module.exports = secretariatRouter;