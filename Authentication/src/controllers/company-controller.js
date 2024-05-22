const Company = require('../models/Company');
const JWT = require('../utils/jwt');
const jwt = new JWT();
const bcrypt = require('bcrypt');
const amqp = require('amqplib');
const path = "./config.env"
require('dotenv').config({path:path});



const consumeMessages = async () => {
    try {
        let message;
      const connection = await amqp.connect(process.env.RABBITURL);
      const channel = await connection.createChannel();
  
      await channel.assertExchange(process.env.RABBITEXCHANGE, 'direct');
  
      const q = await channel.assertQueue('registrationDecision', { durable: true });
  
      await channel.bindQueue(q.queue, process.env.RABBITEXCHANGE, 'notApprovedCompany');
  
      await channel.consume(q.queue, async (msg) => {
        const data = JSON.parse(msg.content.toString());
        message = data;
        console.log(data);

        await decisionToRegistration(data.message);
        channel.ack(msg);
      });
  
      console.log(`Waiting for messages in queue: ${q.queue}`);
    } catch (error) {
      console.error('Error in consumeMessages:', error);
    }
  };
  
  consumeMessages();

//accept or reject company

const decisionToRegistration = async (msg) =>{
    const decision = msg.decision;
    const company = await Company.findOne({where:{companyMail:msg.companyMail}});
    
    if(decision ==='approve'){
        company.status = 'approved';
        await company.save();
    }
};




// company register
exports.register = async(req,res) =>{
    try {
        const companyRegisterForm = req.body;
        const checkCompany = await Company.findOne({where:{companyMail:req.body.companyMail}});
        if(checkCompany){
            throw new Error('Company already exists');
        }
        const newCompany = await Company.create(companyRegisterForm);
        console.log(newCompany)
        res.status(200).json({
            status:'success',
            newCompany:newCompany,

        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status:'fail',
            error:error

        });
    }


};


//company login
exports.login = async(req,res) =>{
    try {


        const company = await Company.findOne({where:{companyMail:req.body.companyMail}});
        if(!company){
            throw new Error('Company not found');

        }
        const isMatch = await bcrypt.compare(req.body.password,company.password);
        
        if(!isMatch){
            throw new Error('Email or Password is wrong');
            }
        
        
        //generate token
        const token = await jwt.generateCompanyToken(company);
        res.cookie('token',token,{httpOnly:true,secure:true});
        res.status(200).json({
                status:'success',
                loggedUser:company,
                token:token,
                
        
                });
        
        

    } catch (error) {
        res.status(401).json({
            status:'fail',
            error:error

        });
    }
    
}


exports.getNotApprovedList = async (req,res) =>{ 
    try {
        console.log('here');
        const notApprovedCompanies = await  Company.findAll({where:{status:'not approved'}});
        console.log('here2');
        if(!notApprovedCompanies){
            notApprovedCompanies = []
        }
        console.log(notApprovedCompanies);
        res.status(200).json({
            status:'success',
            notApprovedCompanies:notApprovedCompanies
        })
        
    } catch (error) {
        res.status(400).json({
            status:'fail',
            error:error

        });
        
    }
}
