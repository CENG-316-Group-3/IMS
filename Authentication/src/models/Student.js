const { DataTypes} = require('sequelize');
const sequelize = require('../utils/db');
const bcrypt = require('bcrypt');


const Student = sequelize.define('Student',{
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
        allowNull:true, 
        
    },

    faculty:{
        type:DataTypes.STRING,
        allowNull:false,
    }, 
    department:{
        type:DataTypes.STRING,
        allowNull:false,
        
    },
    
    nationalIdentityNumber:{
        type:DataTypes.STRING,
        allowNull:false,   
    },
    telephone:{
        type:DataTypes.STRING,
        allowNull:false,   
    }
});

Student.sync({})
module.exports = Student;