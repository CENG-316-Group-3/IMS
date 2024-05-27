const { DataTypes} = require('sequelize');
const sequelize = require('../utils/db');
const Students = require('./Students.js');
const { FORCE } = require('sequelize/lib/index-hints');

const ApplicationLetter = sequelize.define('ApplicationLetter',{
   
    companyMail:{
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey: true,
    },
    announcementId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey: true,
    },
    studentMail:{ 
        type:DataTypes.STRING,
        allowNull:false, 
        primaryKey: true,
        
    }
});


ApplicationLetter.belongsTo(Students, { foreignKey: 'studentMail' });
Students.hasMany(ApplicationLetter, { foreignKey: 'studentMail' });


ApplicationLetter.sync({FORCE:true});
Students.sync({FORCE:true});

module.exports = ApplicationLetter;