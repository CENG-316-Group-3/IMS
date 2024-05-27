const express = require('express');
const companyRouter = express.Router();
const companyController = require('../controllers/company-controller');

companyRouter
    .route('/register')
    .post(companyController.register);

companyRouter
    .route('/login')
    .post(companyController.login)

companyRouter
    .route('/notApprovedList')
    .get(companyController.getNotApprovedList)

companyRouter
    .route('/resetPassword')
    .post(companyController.sendResetLink);


companyRouter
    .route('/setNewPassword/:id')
    .post(companyController.resetPassword);


companyRouter
    .route('/:mail')
    .get(companyController.getCompany);


module.exports = companyRouter;