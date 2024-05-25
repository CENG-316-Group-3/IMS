const { DataTypes} = require('sequelize');
const sequelize = require('../utils/db');
const bcrypt = require('bcrypt');


const DepartmentSecretariat = sequelize.define('DepartmentSecretariat',{
    departmentMail:{
        primaryKey:true, 
        type:DataTypes.STRING,
        unique:true
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
    firstName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    lastName:{
        type:DataTypes.STRING,
        allowNull:false
    }
});

DepartmentSecretariat.beforeCreate(async(secretariat)=>{
    const salt = await bcrypt.genSalt();
    secretariat.password = await bcrypt.hash(secretariat.password,salt);

});

DepartmentSecretariat.sync({});

module.exports = DepartmentSecretariat;