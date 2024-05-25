const { DataTypes} = require('sequelize');
const sequelize = require('../utils/db');


const Students = sequelize.define('Students',{
    studentMail:{
        primaryKey:true, 
        type:DataTypes.STRING,
        unique:true
    },
    studentNumber:{ 
        type:DataTypes.INTEGER,
        unique:true,
        allowNull:false, 

    },
    firstName:{
        type:DataTypes.STRING,
        allowNull:false,

    },
    lastName:{
        type:DataTypes.STRING,
        allowNull:false,
        
    },
    gradeNumber:{ 
        type:DataTypes.INTEGER,
        allowNull:false, 
        
    },
    faculty:{
        type:DataTypes.STRING,
        allowNull:false,

    },
    department:{
        type:DataTypes.STRING,
        allowNull:false,
        
    },
    
    NationalIdentityNumber:{
        type:DataTypes.STRING,
        allowNull:false,   
    },
    Telephone:{
        type:DataTypes.STRING,
        allowNull:false,   
    }
});


Students.sync({FORCE : true})
module.exports = Students;