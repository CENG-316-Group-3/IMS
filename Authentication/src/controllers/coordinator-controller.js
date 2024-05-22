const Coordinator = require('../models/Coordinator');
const JWT = require('../utils/jwt');
const jwt = new JWT();
const bcrypt = require('bcrypt');


// coordinator register
exports.register = async(req,res) =>{
    try {
        const coordinatorRegisterForm = req.body;
        const newCoordinator = await Coordinator.create(coordinatorRegisterForm);
        res.status(200).json({
            status:'success',
            newCoordinator:newCoordinator,

        })
    } catch (error) {
        res.status(400).json({
            status:'fail',
            error:error

        });
    }


};


//coordinator login
exports.login = async(req,res) =>{
    try {

        console.log('here');
        const coordinator = await Coordinator.findOne({where:{coordinatorMail:req.body.coordinatorMail}});
        if(!coordinator){
            throw new Error('Coordinator not found');

        }
        const isMatch = await bcrypt.compare(req.body.password,coordinator.password);
        
        if(!isMatch){
            throw new Error('Email or Password is wrong');
            }
        
        
        //generate token
        const token = await jwt.generateCoordinatorToken(coordinator);
        res.cookie('token',token,{httpOnly:true,secure:true});
        res.status(200).json({
                status:'success',
                loggedUser:coordinator,
                token:token,
                
        
                });
        
        

    } catch (error) {
        res.status(400).json({
            status:'fail',
            error:error

        });
    }
    
}



