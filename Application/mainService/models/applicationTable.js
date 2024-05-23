const { DataTypes} = require('sequelize');
const sequelize = require('../utils/db');



const applicationTable = sequelize.define('applicationTable',{
    studentMail:{
        primaryKey:true, 
        type:DataTypes.STRING,
       
    },

    companyMail:{
        primaryKey:true,
        type:DataTypes.STRING,
        allowNull:false,

    },
    announcementId:{
        primaryKey:true,
        type:DataTypes.INTEGER,
        allowNull:false,
        
    },
    status:{ 
        type:DataTypes.STRING,
        allowNull:false, 
        
    },
    content:{ 
        type:DataTypes.STRING,
        allowNull:true,   
    },

});

applicationTable.sync({});
module.exports = applicationTable;