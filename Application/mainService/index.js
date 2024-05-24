const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const applicationTable = require('./models/applicationTable.js');
const Sequelize = require("sequelize");


const app = express();
app.use(bodyParser.json());

// Store response handlers for pending RPC calls
const responseHandlers = {};

var amqp = require('amqplib/callback_api');
const rabbitMQUrl = 'amqp://localhost';

amqp.connect(rabbitMQUrl, function(error0, connection) {
    if (error0) throw error0;

    connection.createChannel(function(error1, ch) {
        if (error1) throw error1;

        channel = ch;
        const exchange = 'direct_logs';
        const queueName = 'applicationQueue1';
        const routingKeys = ['application letter created', 'application form created','/student/applyToInternship','/student/sendApplicationForm','/company/acceptApplicationLetter', 
        '/company/rejectApplicationLetter', '/company/rejectApplicationForm', '/summerPractiseCoordinator/rejectApplicationForm','/company/acceptApplicationForm', '/summerPractiseCoordinator/acceptApplicationForm'
        ,'application form accepted', '/student/status', '/sendFeedback', '/student/cancelApplication', '/student/cancelApplicationForm','application canceled','application form canceled' , '/summerPracticeCoordinator/deleteApplication'];
        // Declare the Direct Exchange
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
                const correlationId = message.properties.correlationId;
                const content = message.content.toString();
                // Determine which process function to call based on the routing key
                /*if (message.fields.routingKey === 'application letter created') {
                    processApplicationLetterCreated(message.content.toString());

                } if (message.fields.routingKey === 'application form created') {
                    processApplicationFormCreated(message.content.toString());
                } */ if (message.fields.routingKey === '/student/applyToInternship'){
                    processStudentApplyToInternship(message);
                } else if (message.fields.routingKey === '/student/sendApplicationForm'){
                    processStudentSendApplicationForm(message);
                } else if (message.fields.routingKey === '/company/acceptApplicationLetter'){
                    processCompanyAcceptApplicationLetter(message);
                } else if (message.fields.routingKey === '/company/rejectApplicationLetter'){
                    processCompanyRejectApplicationLetter(message);
                }else if  (message.fields.routingKey === '/company/rejectApplicationForm'){
                    processCompanyRejectApplicationForm(message);
                }else if (message.fields.routingKey === '/summerPractiseCoordinator/rejectApplicationForm'){
                    processSummerPractiseCoordinatorRejectApplicationForm(message);
                }else if (message.fields.routingKey === '/company/acceptApplicationForm'){
                    processCompanyAcceptApplicationForm(message);
                }else if (message.fields.routingKey === '/summerPractiseCoordinator/acceptApplicationForm'){
                    processSummerPractiseCoordinatorAcceptApplicationForm(message);
                }else if  (message.fields.routingKey === '/student/status'){
                    processGetStudentStatusById(message);
                }else if  (message.fields.routingKey === '/sendFeedback'){
                    processSendFeedBack(message);
                }else if  (message.fields.routingKey === '/student/cancelApplication'){
                    processCancelApplication(message);
                }else if  (message.fields.routingKey ===  '/student/cancelApplicationForm'){
                    processCancelApplicationForm(message);
                }else if  (message.fields.routingKey ==="/summerPracticeCoordinator/deleteApplication"){
                    processSummerPracticeCoordinatorDeleteApplication(message);
                }
                if (responseHandlers[correlationId]) {
                    responseHandlers[correlationId](content);
                    delete responseHandlers[correlationId];
                }
            }, { noAck: true });
        });

        console.log("RabbitMQ channel and exchange setup completed");
    });
});

function emitMessage(routingKey, message) {
    const exchange = 'direct_logs';
    channel.publish(exchange, routingKey, Buffer.from(message));
    console.log(`[x] Sent message with routing key ${routingKey}: '${message}'`);
}

function emitMessageCorrelationId(routingKey, message, correlationId) {
    const exchange = 'direct_logs';
    channel.publish(exchange, routingKey, Buffer.from(message), { correlationId });
    console.log(`[x] Sent message with routing key ${routingKey}: '${message}'`);
}

// Function to wait for a response
function waitForResponse(correlationId) {
    return new Promise((resolve) => {
        responseHandlers[correlationId] = (content) => {
            resolve(content);
        };
    });
}

function generateUuid() {
    return Math.random().toString() + Math.random().toString() + Math.random().toString();
}



async function updateApplicationStatus(studentMail, announcementId, companyMail, newStatus, applicationFormContent,statusCheck) {
    try {
        const result = await applicationTable.update(
            { status: newStatus,
              content: applicationFormContent
             }, // The new values to update
            {
                where: {
                    studentMail,
                    announcementId,
                    companyMail,
                    status: statusCheck
                }
            }
        );
        if (result[0] === 0) {
            console.log('Application not found or no changes made ');
            throw new Error('Application not found or no changes made');
           
        } else {
            console.log('Application status updated successfully');
        }
    } catch (error) {
        console.error('Error updating application status:', error);
        throw new Error('Application not found or no changes made');
    }
};

async function processApplicationLetterCreated(message) {
    try {
        const content = JSON.parse(message.content.toString());
        const { studentMail, announcementId, companyMail } = content;

        // Update the application status in the database
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application letter created', '', 'application is started');
        console.log('Application status updated to "application letter accepted"');
    } catch (error) {
        console.error('Error processing application letter created message:', error);
    }
}

async function processApplicationFormCreated(message) {
    try {
        const content = JSON.parse(message.content.toString());
        const { studentMail, announcementId, companyMail } = content;

        // Update the application status in the database
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application form is created', '', 'application form is processing');
        console.log('Application status updated to "application form created"');
    } catch (error) {
        console.error('Error processing application form created message:', error);
    }
}

async function processStudentApplyToInternship(message){
    
    const content = JSON.parse(message.content.toString());
    try{
        await applicationTable.create({
            studentMail: content.studentMail,
            companyMail: content.companyMail,
            announcementId:content.announcementId,
            status: "application is started",
            content: ""
        });
        //emitMessage('application letter create', JSON.stringify(content));
        const correlationId = generateUuid();
        emitMessageCorrelationId('application letter create',  JSON.stringify(content),  correlationId);    
        const response = await waitForResponse(correlationId);
        
        if (response.includes('application letter created')) {
            await processApplicationLetterCreated(message);
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Application Letter is Sent', status: 200}), message.properties.correlationId);
        }else{
            throw new Error('Application letter not created');
        }
        //emitMessage('success', JSON.stringify({ message: 'Application Letter is Sent' }));
        
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Duplicate entry: email must be unique' , status : 400}), message.properties.correlationId);
            
        } else {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Internal server error' , status : 400}), message.properties.correlationId);
        }
    }
}
/*
app.post('/student/applyToInternship', async(req, res) => { 
    const content = req.body;
    const msg = JSON.stringify(content);
    processStudentApplyToInternship(message)

    try{
    await applicationTable.create({
        studentMail: content.studentMail,
        companyMail: content.companyMail,
        announcementId:content.announcementId,
        status: "application is started",
        content: ""
    });
    emitMessage('application letter', JSON.stringify(content));
    res.status(201).json(user);
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(409).json({ message: 'Duplicate entry: email must be unique' });
        } else {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
});
*/
async function processStudentSendApplicationForm(message){
    
    const content = JSON.parse(message.content.toString());
    //const content = JSON.parse(message);
    try{
        await updateApplicationStatus(content.studentMail, content.announcementId, content.companyMail, 'application form is processing', "", 'application letter is accepted');
        const correlationId = generateUuid();
        emitMessageCorrelationId('application form create',  JSON.stringify(content), correlationId);    
        const response = await waitForResponse( correlationId);
       
        if (response.includes('application form created')) {
            await processApplicationFormCreated(message);
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Application Form is Sent' , status : 200}), message.properties.correlationId);
        }else{
            throw new Error('Application form not created');
        }
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Error updating application status' ,status : 400}), message.properties.correlationId);         
        }else {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Application letter is not sent or accepted',status : 400}), message.properties.correlationId);
        }
    }
}
/*
app.post('/student/sendApplicationForm', async (req, res) => {
    const content = req.body;
    try {
        await updateApplicationStatus(content.studentMail, content.announcementId, content.companyMail, 'application form is processing', "", 'application letter is accepted');
        emitMessage('application form', JSON.stringify(content));
        res.send('Application form is processing');
    } catch (error) {
        res.status(500).send('Error updating application status');
    }
});
*/

async function processCompanyAcceptApplicationLetter(message){
    const msg = JSON.parse(message.content.toString());
    const { studentMail, announcementId, companyMail, content} = msg;
    try {
        //emitMessage('success', JSON.stringify({ message: 'application letter is accepted' }));
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application letter is accepted', "", 'application letter created');
        emitMessageCorrelationId('success',  JSON.stringify({ message: 'application accepted by company' ,status : 200}),  message.properties.correlationId);    
    } catch (error) {
        emitMessageCorrelationId('success', JSON.stringify({ message: 'Error accepting Applicaton Letter ',status : 400}), message.properties.correlationId);
    }
}
/*
app.put('/company/acceptApplicationLetter', async(req, res) => {
    const { studentMail, announcementId, companyMail, content} = req.body;
    try {
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application letter is accepted', "", 'application letter created');
        res.send('application letter is accepted');
    } catch (error) {
        res.status(500).send('Error updating application status');
    }
});
*/


async function processCompanyRejectApplicationLetter(message){
    const { studentMail, announcementId, companyMail, content} = JSON.parse(message.content.toString());
    try {
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application letter is rejected', content, 'application letter created');
        emitMessageCorrelationId('success',  JSON.stringify({ message: 'application letter is rejected', status : 200 }),  message.properties.correlationId);    
    } catch (error) {   
        emitMessageCorrelationId('success', JSON.stringify({ message: 'Error updating application status', status : 400 }), message.properties.correlationId);
    }
}
/*
app.put('/company/rejectApplicationLetter', async(req, res) => {
    const { studentMail, announcementId, companyMail, content} = req.body;
    try {
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application letter is rejected', content, 'application letter created');
        res.send('application letter is rejected');
    } catch (error) {
        res.status(500).send('Error updating application status');
    }
});
*/
async function processCompanyRejectApplicationForm(message){
    const { studentMail, announcementId, companyMail, content} = JSON.parse(message.content.toString());
    try {
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application form is rejected by company', content, 'application form is created');
        emitMessageCorrelationId('success',  JSON.stringify({ message: 'application form is rejected by company', status :200 }),  message.properties.correlationId);   
        //emitMessage('success', JSON.stringify({ message: 'application form is rejected by company' }));
    } catch (error) {
        emitMessageCorrelationId('success', JSON.stringify({ message: 'Error updating application status', status : 400 }), message.properties.correlationId);
        //emitMessage('error', JSON.stringify({ message: 'Error updating application status' }));
    }
}
/*
app.put('/company/rejectApplicationForm', async(req, res) => {
    const { studentMail, announcementId, companyMail, content} = req.body;
    try {
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application form is rejected by company', content, 'application form is created');
        res.send('application form is rejected by company');
    } catch (error) {
        res.status(500).send('Error updating application status');
    }
});
*/

async function processSummerPractiseCoordinatorRejectApplicationForm(message){
    const { studentMail, announcementId, companyMail, content} = JSON.parse(message.content.toString());
    try {
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application form is rejected by summer practise coordinator', content, 'application form is accepted by company');
        emitMessageCorrelationId('success',  JSON.stringify({ message:  'application form rejected by summer practise coordinator', status : 200}),  message.properties.correlationId);   
        //emitMessage('success', JSON.stringify({ message: 'application form rejected by summer practise coordinator' }));
    } catch (error) {
        emitMessageCorrelationId('success',  JSON.stringify({ message: 'Error updating application status' ,status : 400}),  message.properties.correlationId);   
    }
}

/*
app.put('/summerPractiseCoordinator/rejectApplicationForm', async(req, res) => {
    const { studentMail, announcementId, companyMail, content} = req.body;
    try {
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application form is rejected by summer practise coordinator', content, 'application form is accepted by company');
        res.send('application form rejected by summer practise coordinator');
    } catch (error) {
        res.status(500).send('Error updating application status');
    }
});
*/
async function processCompanyAcceptApplicationForm(message){
    const content = JSON.parse(message.content.toString());
    try {
        const correlationId = generateUuid();
        emitMessageCorrelationId('application form accept',  JSON.stringify(content), correlationId); 
        const respons = await waitForResponse(correlationId);
        console.log(respons);
        
        
        if (respons.includes('application form accepted')) {
            await updateApplicationStatus(content.studentMail, content.announcementId, content.companyMail, 'application form is accepted by company', '', 'application form is created');
            emitMessageCorrelationId('success', JSON.stringify({ message: 'application form filled by company', status : 200}), message.properties.correlationId);
        }
        
        
        
    } catch (error) {
        emitMessageCorrelationId('success',  JSON.stringify({ message: 'Error updating application status',  status : 400}),  message.properties.correlationId);   
    }
}

/*

app.put('/company/acceptApplicationForm', async (req, res) => {
    const content = req.body;
    emitMessage('application form accept', JSON.stringify(content));
    try {
        await updateApplicationStatus(content.studentMail, content.announcementId, content.companyMail, 'application form is accepted by company', '', 'application form is created');
        res.send('Application form is processing');
    } catch (error) {
        res.status(500).send('Error updating application status');
    }
});
*/

async function processSummerPractiseCoordinatorAcceptApplicationForm(message){
    const { studentMail, announcementId, companyMail, content} = JSON.parse(message.content.toString());
    try {
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application form is accepted by summer practise coordinator', content, 'application form is accepted by company');
        emitMessageCorrelationId('success',  JSON.stringify({ message: 'application form is accepted by summerPractiseCoordinator', status : 200}),  message.properties.correlationId);   
    } catch (error) {
        emitMessageCorrelationId('success',  JSON.stringify({ message: 'Error updating application status' ,status : 400 }),  message.properties.correlationId);   
    }
}
/*
app.put('/summerPractiseCoordinator/acceptApplicationForm', async(req, res) => {
    const { studentMail, announcementId, companyMail, content} = req.body;
    try {
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application form is accepted by summer practise coordinator', content, 'application form is accepted by company');
        res.send('application form is accepted by summerPractiseCoordinator');
    } catch (error) {
        res.status(500).send('Error updating application status');
    }
});
*/

async function processGetStudentStatusById(message){
    const { studentMail, announcementId, companyMail} = JSON.parse(message.content.toString());
    try {
        if (!companyMail || !announcementId || !studentMail) {
            emitMessageCorrelationId('success',{ message: 'Missing required query parameters' }, message.properties.correlationId);
        }

        // Find the application letter and include the related student information
        console.log(JSON.parse(message.content.toString()));
        const application = await applicationTable.findOne({
            where: {
                companyMail,
                announcementId,
                studentMail
            }
        });

        // Check if the application letter was found
        if (!application) {
            emitMessageCorrelationId('success',JSON.stringify({ message:  'Application not found' }, message.properties.correlationId));
        }
        emitMessageCorrelationId('success',JSON.stringify( addStatus(application, 200)), message.properties.correlationId);
    }catch (error) {
        console.error('Error retrieving application:', error);
        // Return a 500 Internal Server Error response in case of an error
        emitMessageCorrelationId('success',JSON.stringify({ message: 'application form is accepted by summerPractiseCoordinator' , status : 400}), message.properties.correlationId);
        //emitMessage('error', JSON.stringify({ message:  'Internal server error'}));
    }
}

function addStatus(obj, status) {
    const newObj = obj.toJSON();
    newObj.status = status;
    return newObj;
}

async function processSendFeedBack(message) {
    const { studentMail, announcementId, companyMail, content } = JSON.parse(message.content.toString());
    var newStatus;
    try {
        // Retrieve the current application status
        const application = await applicationTable.findOne({
            where: {
                studentMail,
                announcementId,
                companyMail,
            },
        });

        if (!application) {
            console.log('Application not found');
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Application not found', status : 400 }), message.properties.correlationId);
            return;
        }
    
        if (application.status === 'application letter created'){
            newStatus = 'application letter rejected by company and feedback is sent';
        }else if(application.status === 'application form created'){
            newStatus = 'application form rejected by company and feedback is sent';
        }else if(application.status === 'application form is accepted by company'){
            newStatus = 'application form rejected by summerPractiseCoordinator and feedback is sent';
        }

        // Check if the current status matches the allowed statuses
        const allowedStatuses = ['application letter created', 'application form created', 'application form is accepted by company'];
        if (!allowedStatuses.includes(application.status)) {
            console.log('Current status does not allow this update');
            emitMessageCorrelationId('success',JSON.stringify({ message: 'Current status does not allow this update', status : 400 }), message.properties.correlationId);
            return;
        }

        // Update the application status and content
        
        const result = await applicationTable.update(
            {
                status: newStatus,
                content: content,
            },
            {
                where: {
                    studentMail,
                    announcementId,
                    companyMail,
                },
            }
        );

        if (result[0] === 0) {
            console.log('No changes made to the application');
            emitMessageCorrelationId('success', JSON.stringify({ message: 'No changes made to the application' , status : 400}), message.properties.correlationId);
        } else {
            console.log('Application status updated successfully');
            emitMessageCorrelationId('success', JSON.stringify({ message: ' feedback send successfully',status : 200 }), message.properties.correlationId);
        }
    } catch (error) {
        console.error('Error updating application status:', error);
        emitMessageCorrelationId('success', JSON.stringify({ message: 'Error updating application status', status : 400 }), message.properties.correlationId);
    }
}
async function processCancelApplication(message){
    const { studentMail, announcementId, companyMail} = JSON.parse(message.content.toString());
    const content = JSON.parse(message.content.toString());
    try{
        const application = await applicationTable.findOne({
            where: {
                studentMail,
                announcementId,
                companyMail
            }
        });

        if (!application) {
            console.log('Application not found');
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Application not found' , status : 400}), message.properties.correlationId);
            throw new Error ('Application not found');
        }
        
        if (application.status === 'application form is accepted by summer practise coordinator'){
            throw new Error('Application is started, communicate with your coordinator');}
          
       
        //emitMessage('application letter create', JSON.stringify(content));
        const correlationId = generateUuid();
        emitMessageCorrelationId('cancel application',  JSON.stringify(content),  correlationId);    
        const response = await waitForResponse(correlationId);
        console.log("\n\n\n");
        console.log(response);
        if (response.includes('Application canceled')) {
            deleteStudent(content.studentMail, content.announcementId, content.companyMail);
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Application canceled',  status : 200 }), message.properties.correlationId);

        }else{
            throw new Error('Application letter created');
        }
        //emitMessage('success', JSON.stringify({ message: 'Application Letter is Sent' }));
        
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Duplicate entry: email must be unique' , status : 400}), message.properties.correlationId);
            
        } else {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Internal server error', status : 400 }), message.properties.correlationId);
        }
    }
}

async function deleteStudent(studentMail, announcementId, companyMail) {
    try {
        const result = await applicationTable.destroy({
            where: {
                studentMail,
                announcementId,
                companyMail
            }
        });

        if (result === 0) {
            console.log('Application not found or no deletion occurred');
            return false;
        } else {
            console.log('Application deleted successfully');
            return true;
        }
    } catch (error) {
        console.error('Error deleting application:', error);
        return false;
    }
}


async function processCancelApplicationForm(message){
    const { studentMail, announcementId, companyMail} = JSON.parse(message.content.toString());
    const content = JSON.parse(message.content.toString());
    try{
        const application = await applicationTable.findOne({
            where: {
                studentMail,
                announcementId,
                companyMail
            }
        });

        if (!application) {
            console.log('Application not found');
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Application not found', status : 400 }), message.properties.correlationId);
            throw new Error ('Application not found');
        }
        const allowedStatuses = ['application form is created', 'application form is accepted by company', 'application form is rejected by company','application form is rejected by summer practise coordinator'];
        if (!allowedStatuses.includes(application.status)) {
            console.log('Current status does not allow this update');
            emitMessageCorrelationId('success',JSON.stringify({ message: 'Current status does not allow this update', status : 400 }), message.properties.correlationId);
            return;
        };
       
        //emitMessage('application letter create', JSON.stringify(content));
        const correlationId = generateUuid();
        emitMessageCorrelationId('cancel application form',  JSON.stringify(content),  correlationId);    
        const response = await waitForResponse(correlationId);
        console.log("\n\n\n");
        console.log(response);
        console.log(response);
        if (response.includes('Application form canceled')) {
            const result = await applicationTable.update(
                { status: 'application letter is accepted',
                 }, // The new values to update
                {
                    where: {
                        studentMail,
                        announcementId,
                        companyMail
                    }
                }
            );
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Application form canceled', status: 200}), message.properties.correlationId);

        }else{
            throw new Error('Application form error');
        }
        //emitMessage('success', JSON.stringify({ message: 'Application Letter is Sent' }));
        
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Duplicate entry: email must be unique', status :400 }), message.properties.correlationId);
            
        } else {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Internal server error', status :400  }), message.properties.correlationId);
        }
    }
}

async function processSummerPracticeCoordinatorDeleteApplication(message){
    const { studentMail, announcementId, companyMail} = JSON.parse(message.content.toString());
    const content = JSON.parse(message.content.toString());
    try{
        const application = await applicationTable.findOne({
            where: {
                studentMail,
                announcementId,
                companyMail
            }
        });

        if (!application) {
            console.log('Application not found');
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Application not found' , status : 400}), message.properties.correlationId);
            throw new Error ('Application not found');
        }
        
        //emitMessage('application letter create', JSON.stringify(content));
        const correlationId = generateUuid();
        emitMessageCorrelationId('cancel application',  JSON.stringify(content),  correlationId);    
        const response = await waitForResponse(correlationId);
        console.log("\n\n\n");
        console.log(response);
        if (response.includes('Application canceled')) {
            deleteStudent(content.studentMail, content.announcementId, content.companyMail);
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Application canceled',  status : 200 }), message.properties.correlationId);

        }else{
            throw new Error('Application letter created');
        }
        //emitMessage('success', JSON.stringify({ message: 'Application Letter is Sent' }));
        
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Duplicate entry: email must be unique' , status : 400}), message.properties.correlationId);
            
        } else {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Internal server error', status : 400 }), message.properties.correlationId);
        }
    }
}




app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
