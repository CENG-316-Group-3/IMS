const express = require('express');
const coordinatorRouter = express.Router();
const coordinatorController = require('../controllers/coordinator-controller');

coordinatorRouter
    .route('/register')
    .post(coordinatorController.register);

coordinatorRouter
    .route('/login')
    .post(coordinatorController.login);





module.exports = coordinatorRouter;