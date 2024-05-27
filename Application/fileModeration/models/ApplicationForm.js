const { DataTypes} = require('sequelize');
const sequelize = require('../utils/db');
const Students = require('./Students.js');


const ApplicationForm = sequelize.define('ApplicationForm',{
   
    companyMail:{
        type:DataTypes.STRING,
        primaryKey: true,
        allowNull:false,
    },announcementId:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        allowNull:false,
    },
    studentMail:{ 
        type:DataTypes.STRING,
        primaryKey: true,
        allowNull:false, 

    },companyName:{
        type:DataTypes.STRING,
        allowNull:true

    },companyAdress:{
        type:DataTypes.STRING,
        allowNull:true

    },internshipStart:{
        type:DataTypes.DATE,
        allowNull:true

    },internshipEnd:{
        type:DataTypes.DATE,
        allowNull:true

    },internshipDuration:{
        type:DataTypes.INTEGER,
        allowNull:true

    },employerNameSurname:{
        type:DataTypes.STRING,
        allowNull:true
    },
    saturdayWorking:{
        type:DataTypes.BOOLEAN,
        allowNull:false

    },holidayWorking:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },wantToHaveInsurance:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    

    
});


ApplicationForm.hasOne(Students, { foreignKey: 'studentMail' });

Students.hasMany(ApplicationForm, { foreignKey: 'studentMail' });


ApplicationForm.sync({});
Students.sync({});

module.exports = ApplicationForm;