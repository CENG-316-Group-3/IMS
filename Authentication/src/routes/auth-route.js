const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth-controller');

authRouter
    .route('/login')
    .post(authController.login);



authRouter
    .route('/logout')
    .get(authController.logout);

  
authRouter
    .route('/check-user')
    .get(authController.checkUser);

module.exports = authRouter;