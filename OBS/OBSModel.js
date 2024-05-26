const { DataTypes} = require('sequelize');
const sequelize = require('./db');
const bcrypt = require('bcrypt');


const OBSModel = sequelize.define('OBSModel',{
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

    password:{
        type:DataTypes.STRING,
        validate: {
            is:{
               args: /^(?=.*[a-zA-Z])(?=.*\d).{8,24}$/,
               msg:'Invalid format. It must contain at least 8 and at most 16 characters and contain at least one letter and one number.'
            } 
          }
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

OBSModel.beforeCreate(async(student)=>{
    const salt = await bcrypt.genSalt();
    student.password = await bcrypt.hash(student.password,salt);

});



OBSModel.sync({})
module.exports = OBSModel;