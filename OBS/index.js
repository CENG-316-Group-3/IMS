const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

//db
const sequelize = require('./db');
// confing env
const path = './config.env'
require('dotenv').config({path:path});


// initialize app
const app = express();


//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//cookie parser
app.use(cookieParser());

//login
const OBSModel = require('./OBSModel');
app.post('/iyte/obs-api/login', async(req,res) =>{
    try {
        const {email,password} = req.body;
        const student = await OBSModel.findOne({where:{studentMail:email}});
        if(!student){ 
           throw new Error('User Not Found');
        };
            //check password
        const isMatch = await bcrypt.compare(password,student.password);
        if(!isMatch){
            throw new Error('Email or Password is wrong');
            }
        
        res.status(200).json({
            status:'success',
            loggedStudent:student,
    
            });
        
    


    } catch (error) {
        console.log(error);
        res.status(400).json({
            status:'fail',
            error:error

        });
    }
})

// create User
app.post('/iyte/obs-api/register',async(req,res) =>{
    try {
        const newStudent = await OBSModel.create(req.body);
        res.status(200).json({ 
            status:'success', 
            newStudent:newStudent
        });
    } catch (error) {
        res.status(400).json({
            status:'fail',
            error:error

        });
    }
})


sequelize
    .sync()
    .then(result => {
        console.log("Database connected");
        app.listen(process.env.PORT);
        console.log(process.env.PORT)
    })
    .catch(err => console.log(err,'error handle'));