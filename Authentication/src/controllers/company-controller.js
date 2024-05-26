const Company = require('../models/Company');
const JWT = require('../utils/jwt');
const jwt = new JWT();
const bcrypt = require('bcrypt');
const amqp = require('amqplib');
const path = "./config.env"
require('dotenv').config({path:path});



const consumeMessages = async () => {
    try {
      const connection = await amqp.connect(process.env.RABBITURL);
      const channel = await connection.createChannel();
  
      await channel.assertExchange(process.env.RABBITEXCHANGE, 'direct', { durable: false });
  
      const q = await channel.assertQueue('registrationDecision', { durable: false });
  
      await channel.bindQueue(q.queue, process.env.RABBITEXCHANGE, 'decision/to/registration/');
  
      await channel.consume(q.queue, async (msg) => {
        if (msg !== null) {
          const data = JSON.parse(msg.content.toString());
          console.log('Received message:', data);
          //console.log(msg.properties);
  
          try {
            await decisionToRegistration(data);
  
            await channel.publish(process.env.RABBITEXCHANGE, 'success', Buffer.from('decided'),{
                correlationId: msg.properties.correlationId
            });

            const message = {receiver_mail:data.companyMail,title:'Registration to IMS',content:`Your registration request is ${data.decision}`};
            await channel.publish(process.env.RABBITEXCHANGE,'notification.send_mail', Buffer.from(JSON.stringify(message)))
            //console.log('Published feedback message to notApprovedCompanyBack');
          } catch (error) {
            console.error('Error processing message:', error);
          }
  
          channel.ack(msg);
        }
      });
  
      console.log(`Waiting for messages in queue: ${q.queue}`);
    } catch (error) {
      console.error('Error in consumeMessages:', error);
    }
  };
  
  consumeMessages();



exports.sendResetLink = async(req,res) =>{
    const email = req.body.companyMail;
    console.log('girdim')
    if(!email){ 
       
        return res.status(400).json({})
    }

    const user = await Company.findOne({where:{companyMail:email}});
    if(!user){
        return res.status(200).json({})
    }
    const uuid = generateUuid();
    console.log( uuid )
    user.resetToken = uuid
    user.save();


    const oneTimeLink = `http://localhost:3000/ims/company/reset/${uuid}`
    console.log(oneTimeLink);
           // RabbitMQ'ya bağlan
    const connection = await amqp.connect(process.env.RABBITURL);
    const channel = await connection.createChannel();
   
           // Exchange adı
    const exchangeName = process.env.RABBITEXCHANGE;
   
           // Exchange tanımla
    await channel.assertExchange(exchangeName, 'direct', { durable: false });
   
           // Routing key
    const routingKey = 'notification.send_mail';
   
           // Gönderilecek mesaj
    const message = {receiver_mail:email,title:'reset link',content:oneTimeLink};
   
           // Mesajı exchange'e gönder
    await channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)));
   
    console.log(`Mesaj gönderildi: ${message}`);
   
           // Bağlantıyı kapat
           await channel.close();
           await connection.close();
    return res.status(200).json({message:'link sent to email'});


    
}

exports.resetPassword = async(req,res) =>{
    try {
        if(req.body.password1 === req.body.password2){
            console.log(req.body.email)
            const user = await Company.findOne({where:{companyMail:req.body.email}})
            console.log(user);
            if(user.resetToken === req.params.id){
                user.password = req.body.password1;
                user.save();
                return res.status(200).json({
                    message:'password changed'
                })
            }
            else{
                return res.status(400).json({ 
                    message:'link experied'
                })
            }

        }else{
            return res.status(400).json({ 
                message:'passwords do not match'
            })
        }
    } catch (error) {
        return res.status(400).json({ 
            message:'bad request'
        })
    }

}
//accept or reject company

const decisionToRegistration = async (msg) =>{
    console.log(msg);
    const decision = msg.decision;
    console.log(typeof(msg.companyMail));
    const company = await Company.findOne({where:{companyMail:msg.companyMail}});
    console.log(company);
    
    if(decision ==='approve'){
        company.status = 'approved';
        await company.save();
    }
    if(decision ==='reject'){
        Company.destroy({where:{companyMail:company.companyMail}});
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

function generateUuid() {
    return Math.random().toString() + Math.random().toString() + Math.random().toString();
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
        return res.status(200).json({
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

exports.getCompany = async (req,res) =>{ 
    try {
        const company = await Company.findOne({where:{companyMail:req.params.mail}});
        if (company){
            //console.log(company)
            console.log('yandım çek')
            return res.status(200).json({companyName:company.companyName})
        }
        else{
            return res.status(400).json({success:'bad req'})
        }
    } catch (error) {
        return res.status(400).json({success:'bad req'})
    }
    
}