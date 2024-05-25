const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Students = require('./models/Students');
const ApplicationLetter = require('./models/ApplicationLetter');
const ApplicationForm = require('./models/ApplicationForm');
const SSIdocument = require('./models/SSI');
const Sequelize = require("sequelize");
var amqp = require('amqplib/callback_api');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


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
            ,'/applicationLetter', '/applicationForm', 'cancel application', 'cancel application form','create SSI document', '/getSSI'
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
                    processApplicationLetter(message);

                } else if (message.fields.routingKey === 'application form create') {
                    processApplicationForm(message);
                }else if (message.fields.routingKey === 'application form accept'){//by company
                    processApplicationFormAccept(message);
                }else if (message.fields.routingKey === '/applicationLetter'){
                    processGetApplicationLetter(message);
                }else if (message.fields.routingKey === '/applicationForm') {
                    processGetApplicationForm(message)}
                else if (message.fields.routingKey === 'cancel application') {
                    processCancelApplication(message)}
                else if (message.fields.routingKey === 'cancel application form') {
                    processCancelApplicationForm(message)}
                else if (message.fields.routingKey === 'create SSI document') {
                    processCreateSSIdocument(message)}
                else if (message.fields.routingKey === '/getSSI') {
                    processGetSSI(message)}
                    
            }, { noAck: true });
        });
    });
});


// Function to wait for a response


async function processApplicationLetter(message) {
    try {
        const content = JSON.parse(message.content.toString());
        const studentMail = content.studentMail;

        // Fetch the student details from the Students table
        const student = await Students.findOne({ where: { studentMail } });

        if (!student) {
            console.error('Student not found:', studentMail);
            throw new Error('Student not found:');
        }

        // Create a new ApplicationLetter entry combining message content and student details
        console.log("\n ", content.studentMail);
        await ApplicationLetter.create({
            studentMail: content.studentMail,
            announcementId: content.announcementId,
            companyMail: content.companyMail,
            
        });

        console.log('Application letter added to the database');
        
    
        emitMessageCorrelationId('application letter created',  JSON.stringify({ message: 'application letter created' }),  message.properties.correlationId);
        //emitMessage('application letter created', notificationMessage);
        
        
    } catch (error) {
        emitMessageCorrelationId('application letter created',  JSON.stringify({ message: 'application letter not created' }),  message.properties.correlationId);
        console.error('Error processing application letter:', error);
    }
};
async function processCreateSSIdocument(message) {
    try {
        const payload = JSON.parse(message.content.toString());
        const jsonPayload = payload.jsonPayload;
        const file = payload.file;

        const filename = file.originalname;
        const fileData = file.buffer;
        const filePath = path.join(__dirname, 'files', filename);

        const studentMail = jsonPayload.studentMail;
        const announcementId = jsonPayload.announcementId;
        const companyMail = jsonPayload.companyMail;

        // Fetch the student details from the Students table
        const student = await Students.findOne({ where: { studentMail } });
        if (!student) {
            console.error('Student not found:', studentMail);
            throw new Error('Student not found');
        }

        fs.writeFileSync(filePath, Buffer.from(fileData));

        // Find or create SSIdocument
        const [ssidoc, created] = await SSIdocument.findOrCreate({
            where: {
                studentMail,
                announcementId
            },
            defaults: {
                studentMail,
                announcementId,
                companyMail,
                fileName: filename,
                path: filePath
            }
        });

        if (!created) {
            // If the document already exists, update its data
            ssidoc.update({
                companyMail,
                fileName: filename,
                path: filePath
            });
        }

        console.log('SSI document added/updated in the database');

        emitMessageCorrelationId('SSI document created', JSON.stringify({ message: 'SSI document created' }), message.properties.correlationId);
    } catch (error) {
        emitMessageCorrelationId('SSI document created', JSON.stringify({ message: 'SSI document not created' }), message.properties.correlationId);
        console.error('Error processing SSI document:', error);
    }
};



async function processApplicationFormAccept(message) {
    try {
        const content = JSON.parse(message.content.toString());
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
            throw new Error('Application form not found:');
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
        emitMessageCorrelationId('application form accepted',  JSON.stringify({ message: 'application form accepted'}),  message.properties.correlationId);
    } catch (error) {
        emitMessageCorrelationId('application form accepted',  JSON.stringify({ message: 'application form not accepted' }),  message.properties.correlationId);
        console.error('Error processing application form accept:', error);
    }
}

async function processApplicationForm(message) {
    try {
        const content = JSON.parse(message.content.toString());
        const studentMail = content.studentMail;

        // Fetch the student details from the Students table
        const student = await Students.findOne({ where: { studentMail } });

        if (!student) {
            console.error('Student not found:', studentMail);
            throw new Error("Application form not found");
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
     
        
        emitMessageCorrelationId('application form created',  JSON.stringify({ message: 'application form created' }),  message.properties.correlationId);
        //emitMessage('application form created', notificationMessage);
    } catch (error) {
        emitMessageCorrelationId('application form created',  JSON.stringify({ message: 'application form not created' }),  message.properties.correlationId);
        console.error('Error processing application form:', error);
    }
}




app.post('/pushStudent', async(req, res) => {
    const content = req.body;
    try{
    const student = await Students.create({
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
    res.status(200).json(student);
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).json({ message: 'Duplicate entry ' });
        } else {
            res.status(400).json({ message: 'Internal server error', error: error.message });
        }
    }
});

async function processGetSSI(message){
    try {
        // Extract query parameters from the request
        msg = message.content.toString();
        const { companyMail, announcementId, studentMail } = JSON.parse(msg);;

        // Validate that all required query parameters are provided
        if (!companyMail || !announcementId || !studentMail) {
            emitMessage('error', JSON.stringify({ message: 'Missing required query parameters', stat : 400 }));
        }

        // Find the application letter and include the related student information
        const SSI = await SSIdocument.findOne({
            where: {
                companyMail,
                announcementId,
                studentMail
            }
        });

       
        // Check if the application letter was found
        if (!SSI) {
            emitMessage('error', JSON.stringify({ message:  'Application letter not found', stat: 400 }));
        }
        // Return the application letter and student information as a JSON response
        const filePath = SSI.path;
       
        

        
        console.log( message.properties.correlationId);
        emitMessageCorrelationId('success',JSON.stringify(filePath), message.properties.correlationId);
    } catch (error) {
        console.error('Error retrieving application letter:', error);
        // Return a 500 Internal Server Error response in case of an error
        emitMessageCorrelationId('success','ssı found not found', message.properties.correlationId);
        //emitMessage('error', JSON.stringify({ message:  'Internal server error'}));
    }
}


async function processGetApplicationLetter(message){
    
    try {
        // Extract query parameters from the request
        msg = message.content.toString();
        const { companyMail, announcementId, studentMail } = JSON.parse(msg);;

        // Validate that all required query parameters are provided
        if (!companyMail || !announcementId || !studentMail) {
            emitMessage('error', JSON.stringify({ message: 'Missing required query parameters', stat : 400 }));
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
            emitMessage('error', JSON.stringify({ message:  'Application letter not found', stat: 400 }));
        }
        // Return the application letter and student information as a JSON response

        
        console.log( message.properties.correlationId);
        emitMessageCorrelationId('success',JSON.stringify( addStatus(applicationLetter, 200)), message.properties.correlationId);
    } catch (error) {
        console.error('Error retrieving application letter:', error);
        // Return a 500 Internal Server Error response in case of an error
        emitMessageCorrelationId('success','application letter found not found', message.properties.correlationId);
        //emitMessage('error', JSON.stringify({ message:  'Internal server error'}));
    }
}

async function emitMessageCorrelationId(routingKey, message, correlationId) {
    const exchange = 'direct_logs';    
    
    channel.publish(exchange, routingKey, Buffer.from(message),{
        correlationId: correlationId
    });
    console.log(`[x] Sent message with routing key ${routingKey}: '${message}'`);
}

function waitForResponse(correlationId) {
    return new Promise((resolve) => {
        responseHandlers[correlationId] = (content) => {
            resolve(content);
        };
    });
}

function addStatus(obj, status) {
    const newObj = obj.toJSON();
    newObj.stat = status;
    return newObj;
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
            emitMessageCorrelationId('success',JSON.stringify({ message: 'Missing required query parameters', stat : 400 }), message.properties.correlationId);
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
            emitMessageCorrelationId('success',JSON.stringify({ message:  'Application letter not found',stat : 400 }), message.properties.correlationId);
        }
        // Return the application letter and student information as a JSON response

        console.log("\n", applicationForm.toJSON());
        console.log( message.properties.correlationId);
        emitMessageCorrelationId('success',JSON.stringify( addStatus(applicationForm, 200)), message.properties.correlationId);
    } catch (error) {
        console.error('Error retrieving application letter:', error);
        // Return a 500 Internal Server Error response in case of an error
        emitMessageCorrelationId('success',JSON.stringify({ message:'application form found not found', stat : 400 }), message.properties.correlationId);
        //emitMessage('error', JSON.stringify({ message:  'Internal server error'}));
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


async function processCancelApplication(message){
    const content = JSON.parse(message.content.toString());
    const { studentMail, announcementId, companyMail } = JSON.parse(message.content.toString());
    try{
        const application = await ApplicationLetter.findOne({
            where: {
                studentMail,
                announcementId,
                companyMail,
            },
        });

        if (!application) {
            console.log('Application not found');
            emitMessageCorrelationId('application canceled', JSON.stringify({ message: 'Application not found' }), message.properties.correlationId);
            throw new Error ('Application not found');
        }
        deleteStudent(studentMail, announcementId, companyMail, "ApplicationLetter");
        const applicationForm = await ApplicationForm.findOne({
            where: {
                studentMail,
                announcementId,
                companyMail,
            },
        });
        if (applicationForm) {
            deleteStudent(studentMail, announcementId, companyMail, "ApplicationForm");
        };
        //emitMessage('application letter create', JSON.stringify(content));
        emitMessageCorrelationId('application canceled', JSON.stringify({ message: 'Application canceled' }), message.properties.correlationId);
        
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            emitMessageCorrelationId('application canceled', JSON.stringify({ message: 'Duplicate entry: email must be unique' }), message.properties.correlationId);
            
        } else {
            emitMessageCorrelationId('application canceled', JSON.stringify({ message: 'Internal server error' }), message.properties.correlationId);
        }
    }
}

async function processCancelApplicationForm(message){
    const content = JSON.parse(message.content.toString());
    const { studentMail, announcementId, companyMail } = JSON.parse(message.content.toString());
    try{
        
        const applicationForm = await ApplicationForm.findOne({
            where: {
                studentMail,
                announcementId,
                companyMail,
            },
        });
        if (applicationForm) {
            deleteStudent(studentMail, announcementId, companyMail, "ApplicationForm");
        }else{
            console.log('Application form not found');
            emitMessageCorrelationId('application form canceled', JSON.stringify({ message: 'Application form not found' }), message.properties.correlationId);
            throw new Error ('Application form not found');
        }
        //emitMessage('application letter create', JSON.stringify(content));
        emitMessageCorrelationId('application form canceled', JSON.stringify({ message: 'Application form canceled' }), message.properties.correlationId);
        
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            emitMessageCorrelationId('application form canceled', JSON.stringify({ message: 'Duplicate entry: email must be unique' }), message.properties.correlationId);
            
        } else {
            emitMessageCorrelationId('application form canceled', JSON.stringify({ message: 'Internal server error' }), message.properties.correlationId);
        }
    }
}


async function deleteStudent(studentMail, announcementId, companyMail, table) {
    try {
        var result;
        if (table === "ApplicationLetter"){
            result = await ApplicationLetter.destroy({
            where: {
                studentMail,
                announcementId,
                companyMail
            }
        });
        }else if(table === "ApplicationForm"){
                result = await ApplicationForm.destroy({
                where: {
                    studentMail,
                    announcementId,
                    companyMail
                }
            });
        }

        if (result === 0) {
            console.log('Application not found or no deletion occurred');
            throw new Error('Application not found or no deletion occurred');
            return false;
        } else {
            console.log('Application deleted successfully');
            return true;
        }
    } catch (error) {
        console.error('Error deleting application:', error);
   
    }
}




app.listen(4002, () => {
    console.log('Server is running on port 4002');
});

