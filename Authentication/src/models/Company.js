const { DataTypes} = require('sequelize');
const sequelize = require('../utils/db');
const bcrypt = require('bcrypt');


const Company = sequelize.define('Company',{
    companyMail:{
        primaryKey:true, 
        type:DataTypes.STRING,
        unique:true
    },
    //password
    password:{
        type:DataTypes.STRING,
        validate: {
            is:{
               args: /^(?=.*[a-zA-Z])(?=.*\d).{8,24}$/,
               msg:'Invalid format. It must contain at least 8 and at most 16 characters and contain at least one letter and one number.'
            } 
          }
    },

    companyName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    address:{
        type:DataTypes.STRING,
        allowNull:false
    },
    status:{
        type:DataTypes.STRING,
        defaultValue:'not approved'
    },
    resetToken:{
        type:DataTypes.STRING,
        allowNull:true,
        unique:true
    }
})


Company.beforeCreate(async(company)=>{
    const salt = await bcrypt.genSalt();
    company.password = await bcrypt.hash(company.password,salt);

});

Company.sync({})

module.exports = Company;
