const { DataTypes} = require('sequelize');
const sequelize = require('../utils/db');
const bcrypt = require('bcrypt');


const Coordinator = sequelize.define('Coordinator',{
    coordinatorMail:{
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

Coordinator.beforeCreate(async(coordinator)=>{
    const salt = await bcrypt.genSalt();
    coordinator.password = await bcrypt.hash(coordinator.password,salt);

});

Coordinator.sync({});

module.exports = Coordinator;