const Secretariat = require('../models/DepartmentSecretariat');
const JWT = require('../utils/jwt');
const jwt = new JWT();
const bcrypt = require('bcrypt');


// secretariat register
exports.register = async(req,res) =>{
    try {
        const secretariatRegisterForm = req.body;
        const newSecretariat = await Secretariat.create(secretariatRegisterForm);
        res.status(200).json({
            status:'success',
            newSecretariat:newSecretariat,

        })
    } catch (error) {
        res.status(400).json({
            status:'fail',
            error:error

        });
    }


};


//secretariat login
exports.login = async(req,res) =>{
    try {

        console.log('here');
        const secretariat = await Secretariat.findOne({where:{departmentMail:req.body.departmentMail}});
        console.log(secretariat);
        if(!secretariat){
            throw new Error('Secretariat not found');

        }
        const isMatch = await bcrypt.compare(req.body.password,secretariat.password);
        
        if(!isMatch){
            throw new Error('Email or Password is wrong');
            }
        
        
        //generate token
        console.log('hghbfgh');
        const token = await jwt.generateSecretariatToken(secretariat);
        res.cookie('token',token,{httpOnly:true,secure:true});
        res.status(200).json({
                status:'success',
                loggedUser:secretariat,
                token:token,
                
        
                });
        
        

    } catch (error) {
        res.status(400).json({
            status:'fail',
            error:error

        });
    }
    
}



