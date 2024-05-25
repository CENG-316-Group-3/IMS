const { DataTypes} = require('sequelize');
const sequelize = require('../utils/db');
const Students = require('./Students.js');
const { FORCE } = require('sequelize/lib/index-hints');




const SSIdocument = sequelize.define('SSIdocument',{
   
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
        
    },path: {
        type: DataTypes.STRING,
        allowNull: false
    },
});


SSIdocument.hasOne(Students, { foreignKey: 'studentMail' });
Students.hasMany(SSIdocument, { foreignKey: 'studentMail' });


SSIdocument.sync({FORCE : true});
Students.sync({FORCE : true});

module.exports = SSIdocument;