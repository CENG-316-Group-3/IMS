const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Students = require('./models/Students');
const ApplicationLetter = require('./models/ApplicationLetter');
const ApplicationForm = require('./models/ApplicationForm');
const Sequelize = require("sequelize");
var amqp = require('amqplib/callback_api');

const app = express();
app.use(bodyParser.json());

const rabbitMQUrl = 'amqp://localhost';
let channel; // Define a channel variable outside of the consumeFromQueue function

function emitMessage(routingKey, message) {
    const exchange = 'direct_logs';
    channel.publish(exchange, routingKey, Buffer.from(message));
    console.log(`[x] Sent message with routing key ${routingKey}: '${message}'`);
}

amqp.connect(rabbitMQUrl, function(error0, connection) {
    if (error0) throw error0;
    
    connection.createChannel(function(error1, ch) {
        if (error1) throw error1;
        
        channel = ch; // Assign the created channel to the variable
        
        // Call the consumeFromQueue function here or start listening to queues
        
        // Declare exchange and queue here
        const exchange = 'direct_logs';
        const queueName = 'applicationQueue';
        const routingKeys = ['application letter create', 'application form create', 'application form accept'
            ,'/applicationLetter', '/applicationForm'
        ];
        
        channel.assertExchange(exchange, 'direct', { durable: false });
        channel.assertQueue(queueName, { exclusive: true }, function(error2, q) {
            if (error2) throw error2;
            
            console.log(`[*] Waiting for messages in queue ${queueName}. To exit press CTRL+C`);
            
            // Bind the queue to the exchange with multiple routing keys
            routingKeys.forEach(routingKey => {
                channel.bindQueue(q.queue, exchange, routingKey);
                console.log(`[*] Bound queue ${queueName} to exchange ${exchange} with routing key ${routingKey}`);
            });
            
            channel.consume(q.queue, function(message) {
                console.log(`[x] Received message with routing key ${message.fields.routingKey}: '${message.content.toString()}'`);
                
                // Determine which process function to call based on the routing key
                if (message.fields.routingKey === 'application letter create') {
                    processApplicationLetter(message.content.toString());

                } else if (message.fields.routingKey === 'application form create') {
                    processApplicationForm(message.content.toString());
                }else if (message.fields.routingKey === 'application form accept'){
                    processApplicationFormAccept(message.content.toString());
                }else if (message.fields.routingKey === '/applicationLetter'){
                    processGetApplicationLetter(message);
                }else if (message.fields.routingKey === '/applicationForm') {
                    processGetApplicationForm(message)}
            }, { noAck: true });
        });
    });
});

async function processApplicationLetter(message) {
    try {
        const content = JSON.parse(message);
        const studentMail = content.studentMail;

        // Fetch the student details from the Students table
        const student = await Students.findOne({ where: { studentMail } });

        if (!student) {
            console.error('Student not found:', studentMail);
            return;
        }

        // Create a new ApplicationLetter entry combining message content and student details
        console.log("\n ", content.studentMail);
        await ApplicationLetter.create({
            studentMail: content.studentMail,
            announcementId: content.announcementId,
            companyMail: content.companyMail,
            
        });

        console.log('Application letter added to the database');
        
        // Emit message to notify other server
        const notificationMessage = JSON.stringify({
            studentMail,
            announcementId: content.announcementId,
            companyMail: content.companyMail
        });
        emitMessage('application letter created', notificationMessage);
        
        
    } catch (error) {
        console.error('Error processing application letter:', error);
    }
};


async function processApplicationFormAccept(message) {
    try {
        const content = JSON.parse(message);
        const { studentMail, announcementId, companyMail } = content;

        // Fetch the existing ApplicationForm entry
        const applicationForm = await ApplicationForm.findOne({
            where: {
                studentMail,
                announcementId,
                companyMail
            }
        });

        if (!applicationForm) {
            console.error('Application form not found:', studentMail, announcementId, companyMail);
            return;
        }

        // Update the ApplicationForm entry with new values
        await applicationForm.update({
            companyName: content.companyName,
            companyAdress: content.companyAdress,
            internshipStart: content.internshipStart,
            internshipEnd: content.internshipEnd,
            internshipDuration: content.internshipDuration,
            employerNameSurname: content.employerNameSurname,
            saturdayWorking: content.saturdayWorking,
            holidayWorking: content.holidayWorking,
            wantToHaveInsurance: content.wantToHaveInsurance
        });

        console.log('Application form updated successfully');

        // Emit message to notify other server
        const notificationMessage = JSON.stringify({
            studentMail,
            announcementId,
            companyMail
        });
        emitMessage('application form accepted', notificationMessage);
    } catch (error) {
        console.error('Error processing application form accept:', error);
    }
}

async function processApplicationForm(message) {
    try {
        const content = JSON.parse(message);
        const studentMail = content.studentMail;

        // Fetch the student details from the Students table
        const student = await Students.findOne({ where: { studentMail } });

        if (!student) {
            console.error('Student not found:', studentMail);
            return;
        }

        // Create a new ApplicationForm entry combining message content and student details
        await ApplicationForm.create({
            studentMail: content.studentMail,
            announcementId: content.announcementId,
            companyMail: content.companyMail,
            companyName: null,
            companyAdress: null,
            internshipStart: null,
            internshipEnd: null,
            internshipDuration: null,
            employerNameSurname: null,
            saturdayWorking: content.saturdayWorking,
            holidayWorking: content.holidayWorking,
            wantToHaveInsurance: content.wantToHaveInsurance,
        });

        console.log('Application form added to the database');

        // Emit message to notify other server
        const notificationMessage = JSON.stringify({
            studentMail,
            announcementId: content.announcementId,
            companyMail: content.companyMail
        });
        emitMessage('application form created', notificationMessage);
    } catch (error) {
        console.error('Error processing application form:', error);
    }
}



app.post('/pushStudent', async(req, res) => {
    const content = req.body;
    try{
    await Students.create({
        studentMail: content.studentMail,
        studentNumber: content.studentNumber,
        firstName:content.firstName,
        lastName: content.lastName,
        gradeNumber: content.gradeNumber,
        faculty: content.faculty,
        department: content.department,
        NationalIdentityNumber: content.NationalIdentityNumber,
        Telephone: content.Telephone
    });
    res.status(201).json(user);
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(409).json({ message: 'Duplicate entry: email must be unique' });
        } else {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
});

async function processGetApplicationLetter(message){
    try {
        // Extract query parameters from the request
        msg = message.content.toString()
        const { companyMail, announcementId, studentMail } = JSON.parse(msg);;

        // Validate that all required query parameters are provided
        if (!companyMail || !announcementId || !studentMail) {
            emitMessage('error', JSON.stringify({ message: 'Missing required query parameters' }));
        }

        // Find the application letter and include the related student information
        const applicationLetter = await ApplicationLetter.findOne({
            where: {
                companyMail,
                announcementId,
                studentMail
            },
            include: [{
                model: Students,
                attributes: ['studentNumber', 'firstName', 'lastName', 'gradeNumber', 'faculty', 'department', 'NationalIdentityNumber', 'Telephone']
            }]
        });

        // Check if the application letter was found
        if (!applicationLetter) {
            emitMessage('error', JSON.stringify({ message:  'Application letter not found' }));
        }
        // Return the application letter and student information as a JSON response

        
        console.log( message.properties.correlationId);
        emitMessageCorrelationId('success',JSON.stringify( applicationLetter.toJSON()), message.properties.correlationId);
    } catch (error) {
        console.error('Error retrieving application letter:', error);
        // Return a 500 Internal Server Error response in case of an error
        emitMessage('error', JSON.stringify({ message:  'Internal server error'}));
    }
}

async function emitMessageCorrelationId(routingKey, message, correlationId) {
    const exchange = 'direct_logs';    
    
    channel.publish(exchange, routingKey, Buffer.from(message),{
        correlationId: correlationId
    });
    console.log(`[x] Sent message with routing key ${routingKey}: '${message}'`);
}


/*

app.get('/applicationLetter', async (req, res) => {
    try {
        // Extract query parameters from the request
        
        const { companyMail, announcementId, studentMail } = req.query;

        // Validate that all required query parameters are provided
        if (!companyMail || !announcementId || !studentMail) {
            return res.status(400).json({ error: 'Missing required query parameters' });
        }

        // Find the application letter and include the related student information
        const applicationLetter = await ApplicationLetter.findOne({
            where: {
                companyMail,
                announcementId,
                studentMail
            },
            include: [{
                model: Students,
                attributes: ['studentNumber', 'firstName', 'lastName', 'gradeNumber', 'faculty', 'department', 'NationalIdentityNumber', 'Telephone']
            }]
        });

        // Check if the application letter was found
        if (!applicationLetter) {
            return res.status(404).json({ error: 'Application letter not found' });
        }

        // Return the application letter and student information as a JSON response
        res.status(200).json(applicationLetter);
    } catch (error) {
        console.error('Error retrieving application letter:', error);
        // Return a 500 Internal Server Error response in case of an error
        res.status(500).json({ error: 'Internal server error' });
    }
});*/


async function processGetApplicationForm(message){
    try {
        // Extract query parameters from the request
        msg = message.content.toString()
        const { companyMail, announcementId, studentMail } = JSON.parse(msg);;

        // Validate that all required query parameters are provided
        if (!companyMail || !announcementId || !studentMail) {
            emitMessage('error', JSON.stringify({ message: 'Missing required query parameters' }));
        }

        // Find the application letter and include the related student information
        const applicationForm = await ApplicationForm.findOne({
            where: {
                companyMail,
                announcementId,
                studentMail
            },
            include: [{
                model: Students,
                attributes: ['studentNumber', 'firstName', 'lastName', 'gradeNumber', 'faculty', 'department', 'NationalIdentityNumber', 'Telephone']
            }]
        });

        // Check if the application letter was found
        if (!applicationForm) {
            emitMessage('error', JSON.stringify({ message:  'Application letter not found' }));
        }
        // Return the application letter and student information as a JSON response

        console.log("\n", applicationForm.toJSON());
        console.log( message.properties.correlationId);
        emitMessageCorrelationId('success',JSON.stringify( applicationForm.toJSON()), message.properties.correlationId);
    } catch (error) {
        console.error('Error retrieving application letter:', error);
        // Return a 500 Internal Server Error response in case of an error
        emitMessage('error', JSON.stringify({ message:  'Internal server error'}));
    }
}
/*
app.get('/applicationForm', async (req, res) => {
    try {
        // Extract query parameters from the request
        const { companyMail, announcementId, studentMail } = req.query;

        // Validate that all required query parameters are provided
        if (!companyMail || !announcementId || !studentMail) {
            return res.status(400).json({ error: 'Missing required query parameters' });
        }

        // Find the application letter and include the related student information
        const applicationForm = await ApplicationForm.findOne({
            where: {
                companyMail,
                announcementId,
                studentMail
            },
            include: [{
                model: Students,
                attributes: ['studentNumber', 'firstName', 'lastName', 'gradeNumber', 'faculty', 'department', 'NationalIdentityNumber', 'Telephone']
            }]
        });

        // Check if the application letter was found
        if (!applicationForm) {
            return res.status(404).json({ error: 'Application letter not found' });
        }

        // Return the application letter and student information as a JSON response
        res.status(200).json(applicationForm);
    } catch (error) {
        console.error('Error retrieving application letter:', error);
        // Return a 500 Internal Server Error response in case of an error
        res.status(500).json({ error: 'Internal server error' });
    }
});*/



app.listen(4002, () => {
    console.log('Server is running on port 4002');
});

