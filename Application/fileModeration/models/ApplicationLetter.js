const { DataTypes} = require('sequelize');
const sequelize = require('../utils/db');
const Students = require('./Students.js');

const ApplicationLetter = sequelize.define('ApplicationLetter',{
   
    companyMail:{
        type:DataTypes.STRING,
        primaryKey: true,
        allowNull:false,
    },
    announcementId:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        allowNull:false,
    },
    studentMail:{ 
        type:DataTypes.STRING,
        primaryKey: true,
        allowNull:false, 
        
    },
    
});


ApplicationLetter.belongsTo(Students, { foreignKey: 'studentMail' });
Students.hasMany(ApplicationLetter, { foreignKey: 'studentMail' });


ApplicationLetter.sync({});
Students.sync({});

module.exports = ApplicationLetter;