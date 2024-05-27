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
        ,'application form accepted', '/student/status', '/sendFeedback', '/student/cancelApplication', '/student/cancelApplicationForm','application canceled','application form canceled' , '/summerPracticeCoordinator/deleteApplication', '/company/getApplicationsById'
    , '/company/getApplications', '/departmentSecratary/uploadSSI','SSI document created'];
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
                }else if  (message.fields.routingKey ==='/company/getApplicationsById'){
                    processCommpanygetApplicationsById(message);
                }else if  (message.fields.routingKey === '/company/getApplications'){
                    processGetAllByAnnoucnement(message);
                }else if  (message.fields.routingKey === '/departmentSecratary/uploadSSI'){
                    processDepartmentSecrataryuploadSSI(message);}
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
        throw new Error('Error processing application letter created message:');
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
        throw new Error('Error processing application form created message:');
    }
}


async function processSSIDocumentCreated(message) {
    try {
        const content = JSON.parse(message.content.toString());
        const { studentMail, announcementId, companyMail } = content.jsonPayload;

        // Update the application status in the database
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'internship application is completed', '', 'application form is accepted by summer practise coordinator');
        console.log('Application status updated to "internship application is completed"');
    } catch (error) {
        console.error('Error processing application SSI upload created message:', error);
        throw new Error('Error processing SSI created message:');
    }
}

async function processDepartmentSecrataryuploadSSI(message){
    
    const content = JSON.parse(message.content.toString());
    try{
        //emitMessage('application letter create', JSON.stringify(content));
        const correlationId = generateUuid();
        emitMessageCorrelationId('create SSI document',  JSON.stringify(content),  correlationId);    
        const response = await waitForResponse(correlationId);
        const mailOptions = {
            user_mail: content.secratariatMail,
            receiver_mail: content.studentMail,
            notification_type: "secratary upload SSI document",
            title : 'Departmant Secratary sent SSI document',
            content: 'Departmant Secratary sent SSI document'
            //html: "<h1>texthtml</h1>"
        }
        
        if (response.includes('SSI document created')) {
            await processSSIDocumentCreated(message);
            emitMessageCorrelationId('success', JSON.stringify({ message: 'SSI document created', stat: 200}), message.properties.correlationId);
            emitMessageCorrelationId('notification.send_mail',JSON.stringify(mailOptions) , message.properties.correlationId);
            emitMessageCorrelationId('notification.create',JSON.stringify(mailOptions) , message.properties.correlationId);
        }else{
            throw new Error('SSI document not created');
        }
        //emitMessage('success', JSON.stringify({ message: 'Application Letter is Sent' }));
        
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Duplicate entry: email must be unique' , stat : 400}), message.properties.correlationId);
            
        } else {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Internal server error' , stat : 400}), message.properties.correlationId);
        }
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
        
        const mailOptions = {
            user_mail: content.studentMail,
            receiver_mail: content.companyMail,
            notification_type: "application letter created",
            title : "application letter sent",
            content: `${content.studentMail} sent you application letter`
            //html: "<h1>texthtml</h1>"
            }
                                                        

        if (response.includes('application letter created')) {
            await processApplicationLetterCreated(message);
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Application Letter is Sent', stat: 200}), message.properties.correlationId);
            emitMessageCorrelationId('notification.send_mail',JSON.stringify(mailOptions) , message.properties.correlationId);
            emitMessageCorrelationId('notification.create',JSON.stringify(mailOptions) , message.properties.correlationId);
        }else{
            throw new Error('Application letter not created');
        }
        //emitMessage('success', JSON.stringify({ message: 'Application Letter is Sent' }));
        
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Duplicate entry: email must be unique' , stat : 400}), message.properties.correlationId);
            
        } else {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Internal server error' , stat : 400}), message.properties.correlationId);
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
       
        const mailOptions = {
            user_mail: content.studentMail,
            receiver_mail: content.companyMail,
            notification_type: "application form created",
            title : "application form sent",
            content: `${content.studentMail} sent you application form`
            //html: "<h1>texthtml</h1>"
            }
                 
        if (response.includes('application form created')) {
            await processApplicationFormCreated(message);
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Application Form is Sent' , stat : 200}), message.properties.correlationId);
            emitMessageCorrelationId('notification.send_mail',JSON.stringify(mailOptions) , message.properties.correlationId);
            emitMessageCorrelationId('notification.create',JSON.stringify(mailOptions) , message.properties.correlationId);
        }else{
            throw new Error('Application form not created');
        }
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Error updating application status' ,stat : 400}), message.properties.correlationId);         
        }else {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Application letter is not sent or accepted',stat : 400}), message.properties.correlationId);
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
        const mailOptions = {
            user_mail: content.companyMail,
            receiver_mail: content.studentMail,
            notification_type: "application letter accepted",
            title : "company accepted your application letter",
            content: `${companyMail} company accepted your application letter`
            //html: "<h1>texthtml</h1>"
            }
        emitMessageCorrelationId('success',  JSON.stringify({ message: 'application accepted by company' ,stat : 200}),  message.properties.correlationId);
        emitMessageCorrelationId('notification.send_mail',JSON.stringify(mailOptions) , message.properties.correlationId);
        emitMessageCorrelationId('notification.create',JSON.stringify(mailOptions) , message.properties.correlationId);
    } catch (error) {
        emitMessageCorrelationId('success', JSON.stringify({ message: 'Error accepting Applicaton Letter ',stat : 400}), message.properties.correlationId);
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
    const mailOptions = {
        user_mail: companyMail,
        receiver_mail: studentMail,
        notification_type: "application letter rejected",
        title : "application letter rejected by company",
        content: `${companyMail} rejected your application letter`
        //html: "<h1>texthtml</h1>"
        }
    try {
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application letter is rejected', content, 'application letter created');
        emitMessageCorrelationId('success',  JSON.stringify({ message: 'company rejected application letter ', stat : 200 }),  message.properties.correlationId);  
        emitMessageCorrelationId('notification.send_mail',JSON.stringify(mailOptions) , message.properties.correlationId);  
        emitMessageCorrelationId('notification.create',JSON.stringify(mailOptions) , message.properties.correlationId);
    } catch (error) {   
        emitMessageCorrelationId('success', JSON.stringify({ message: 'Error updating application status', stat : 400 }), message.properties.correlationId);
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
        const mailOptions = {
            user_mail: companyMail,
            receiver_mail: studentMail,
            notification_type: "application form rejected",
            title : "application form rejected by company",
            content: `${companyMail} rejected your application form`
            //html: "<h1>texthtml</h1>"
        }
        emitMessageCorrelationId('success',  JSON.stringify({ message: 'application form is rejected by company', stat :200 }),  message.properties.correlationId);  
        emitMessageCorrelationId('notification.send_mail',JSON.stringify(mailOptions) , message.properties.correlationId);  
        emitMessageCorrelationId('notification.create',JSON.stringify(mailOptions) , message.properties.correlationId);
        //emitMessage('success', JSON.stringify({ message: 'application form is rejected by company' }));
    } catch (error) {
        emitMessageCorrelationId('success', JSON.stringify({ message: 'Error updating application status', stat : 400 }), message.properties.correlationId);
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
        const mailOptions = {
            user_mail: companyMail,
            receiver_mail: studentMail,
            notification_type: "application form rejeted coordinator",
            title : "application form rejected by summer practise coordinator",
            content: "application form rejected by summer practise coordinator"
            //html: "<h1>texthtml</h1>"
        }
        emitMessageCorrelationId('success',  JSON.stringify({ message:  'application form rejected by summer practise coordinator', stat : 200}),  message.properties.correlationId);
        emitMessageCorrelationId('notification.send_mail',JSON.stringify(mailOptions) , message.properties.correlationId);     
        emitMessageCorrelationId('notification.create',JSON.stringify(mailOptions) , message.properties.correlationId);
        //emitMessage('success', JSON.stringify({ message: 'application form rejected by summer practise coordinator' }));
    } catch (error) { 
        emitMessageCorrelationId('success',  JSON.stringify({ message: 'Error updating application status' ,stat : 400}),  message.properties.correlationId);   
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
        const mailOptions = {
            user_mail: content.companyMail,
            receiver_mail: content.studentMail,
            notification_type: "application form accepted",
            title : "application form accepted by company",
            content: `${content.companyMail} accepted and sent application form please check` 
        }
        console.log(respons);
        
        
        if (respons.includes('application form accepted')) {
            await updateApplicationStatus(content.studentMail, content.announcementId, content.companyMail, 'application form is accepted by company', '', 'application form is created');
            emitMessageCorrelationId('success', JSON.stringify({ message: 'application form filled by company', stat : 200}), message.properties.correlationId);
            emitMessageCorrelationId('notification.send_mail',JSON.stringify(mailOptions) , message.properties.correlationId);     
            emitMessageCorrelationId('notification.create',JSON.stringify(mailOptions) , message.properties.correlationId);
        }

        
        
        
    } catch (error) {
        emitMessageCorrelationId('success',  JSON.stringify({ message: 'Error updating application status',  stat : 400}),  message.properties.correlationId);   
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
       
        const mailOptions = {
            user_mail: companyMail,
            receiver_mail: studentMail,
            notification_type: "application form accepted coordinator",
            title : 'application form accepted by summer practise coordinator',
            content: 'summer practise coordinator accepted your application form'
            //html: "<h1>texthtml</h1>"
        };

        emitMessageCorrelationId('success',  JSON.stringify({ message: 'application form is accepted by summerPractiseCoordinator', stat : 200}),  message.properties.correlationId);   
        emitMessageCorrelationId('notification.send_mail',JSON.stringify(mailOptions) , message.properties.correlationId);     
        emitMessageCorrelationId('notification.create',JSON.stringify(mailOptions) , message.properties.correlationId);
    } catch (error) {
        emitMessageCorrelationId('success',  JSON.stringify({ message: 'Error updating application status' ,stat : 400 }),  message.properties.correlationId);   
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
        emitMessageCorrelationId('success',JSON.stringify({ message: 'application form is accepted by summerPractiseCoordinator' , stat : 400}), message.properties.correlationId);
        //emitMessage('error', JSON.stringify({ message:  'Internal server error'}));
    }
}

function addStatus(obj, status) {
    const newObj = obj.toJSON();
    newObj.stat = status;
    return newObj;
}

async function processSendFeedBack(message) {
    const { studentMail, announcementId, companyMail, content, coordinatorMail} = JSON.parse(message.content.toString());
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
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Application not found', stat : 400 }), message.properties.correlationId);
            return;
        }
        var whoMade ;
        var whoReceive;
        if (application.status === 'application letter created'){
            newStatus = 'application letter rejected by company and feedback is sent';
            whoMade = companyMail;
            whoReceive =  studentMail;
        }else if(application.status === 'application form is created'){
            newStatus = 'application form rejected by company and feedback is sent';
            whoMade =  companyMail;
            whoReceive =  studentMail;
        }else if(application.status === 'application form is accepted by company'){
            newStatus = 'application form rejected by summerPractiseCoordinator and feedback is sent';
            whoMade = coordinatorMail;
            whoReceive =  companyMail;
        }
        else if (application.status === 'application letter is rejected'){
            newStatus = 'application letter rejected by company and feedback is sent';
            whoMade = companyMail;
            whoReceive =  studentMail;
        }else if(application.status === 'application form created'){
            newStatus = 'application form is rejected by company';
            whoMade = companyMail;
            whoReceive =  studentMail;
        }else if(application.status === 'application form is rejected by summer practise coordinator'){
            whoMade = coordinatorMail;
            whoReceive =  companyMail;
        }else{
            throw new Error("Not correct state");
        }

        // Check if the current status matches the allowed statuses
      

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
        const mailOptions = {
            user_mail: whoMade,
            receiver_mail: whoReceive,
            notification_type: application.status,
            title : "feedback is sent",
            content: `${whoMade} accepted and sent application form please check` 
            
            //html: "<h1>texthtml</h1>"
        }
        if (result[0] === 0) {
            console.log('No changes made to the application');
            emitMessageCorrelationId('success', JSON.stringify({ message: 'No changes made to the application' , stat : 400}), message.properties.correlationId);
            
        } else {
            console.log('Application status updated successfully');
            emitMessageCorrelationId('success', JSON.stringify({ message: ' feedback send successfully',stat : 200 }), message.properties.correlationId);
            emitMessageCorrelationId('notification.send_mail',JSON.stringify(mailOptions) , message.properties.correlationId);     
            emitMessageCorrelationId('notification.create',JSON.stringify(mailOptions) , message.properties.correlationId);
        }
    } catch (error) {
        console.error('Error updating application status:', error);
        emitMessageCorrelationId('success', JSON.stringify({ message: 'Error updating application status', stat : 400 }), message.properties.correlationId);
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
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Application not found' , stat : 400}), message.properties.correlationId);
            throw new Error ('Application not found');
        }
        
        if (application.status === 'application form is accepted by summer practise coordinator'){
            throw new Error('Application is started, communicate with your coordinator');}
        
        const mailOptions = {
            receiver_mail: studentMail,
            title : "feedback is sent",
            content: `${whoMade} accepted and sent application form please check` 
            
            //html: "<h1>texthtml</h1>"
        }  
       
        //emitMessage('application letter create', JSON.stringify(content));
        const correlationId = generateUuid();
        emitMessageCorrelationId('cancel application',  JSON.stringify(content),  correlationId);    
        const response = await waitForResponse(correlationId);
        console.log("\n\n\n");
        console.log(response);
        deleteStudent(content.studentMail, content.announcementId, content.companyMail);

        
        if (response.includes('Application canceled')) {
             emitMessageCorrelationId('success', JSON.stringify({ message: 'Application canceled',  stat : 200 }), message.properties.correlationId);

        }else{
            throw new Error('Application letter created');
        }
        //emitMessage('success', JSON.stringify({ message: 'Application Letter is Sent' }));
        
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Duplicate entry: email must be unique' , status : 400}), message.properties.correlationId);
            
        } else {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Internal server error', stat : 400 }), message.properties.correlationId);
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
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Application not found', stat : 400 }), message.properties.correlationId);
            throw new Error ('Application not found');
        }
        const allowedStatuses = ['application form is created', 'application form is accepted by company', 'application form is rejected by company','application form is rejected by summer practise coordinator'];
        if (!allowedStatuses.includes(application.status)) {
            console.log('Current status does not allow this update');
            emitMessageCorrelationId('success',JSON.stringify({ message: 'Current status does not allow this update', stat : 400 }), message.properties.correlationId);
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
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Application form canceled', stat: 200}), message.properties.correlationId);

        }else{
            throw new Error('Application form error');
        }
        //emitMessage('success', JSON.stringify({ message: 'Application Letter is Sent' }));
        
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Duplicate entry: email must be unique', stat :400 }), message.properties.correlationId);
            
        } else {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Internal server error', stat :400  }), message.properties.correlationId);
        }
    }
}

async function  processGetAllByAnnoucnement(message){
    const {companyMail} = JSON.parse(message.content.toString());
    try {
        if (!companyMail  ) {
            emitMessageCorrelationId('success',{ message: 'Missing required query parameters' }, message.properties.correlationId);
        }

        // Find the application letter and include the related student information
        console.log(JSON.parse(message.content.toString()));
        const applications = await applicationTable.findAll({
            where: {
                companyMail,
            }
        });
        console.log(applications);
        // Check if the application letter was found
        if (!applications) {
            emitMessageCorrelationId('success',JSON.stringify({ message:  'Application not found' }, message.properties.correlationId));
        }
        emitMessageCorrelationId('success',JSON.stringify( {applications, stat : 200}), message.properties.correlationId);
    }catch (error) {
        console.error('Error retrieving application:', error);
        // Return a 500 Internal Server Error response in case of an error
        emitMessageCorrelationId('success',JSON.stringify({ message: 'application form is accepted by summerPractiseCoordinator' , stat : 400}), message.properties.correlationId);
        //emitMessage('error', JSON.stringify({ message:  'Internal server error'}));
    }
}

async function  processCommpanygetApplicationsById(message){
    const { announcementId,companyMail} = JSON.parse(message.content.toString());
    try {
        if (!companyMail || !announcementId ) {
            emitMessageCorrelationId('success',{ message: 'Missing required query parameters' }, message.properties.correlationId);
        }

        // Find the application letter and include the related student information
        console.log(JSON.parse(message.content.toString()));
        const applications = await applicationTable.findAll({
            where: {
                companyMail,
                announcementId,
            }
        });
        console.log(applications);
        // Check if the application letter was found
        if (!applications) {
            emitMessageCorrelationId('success',JSON.stringify({ message:  'Application not found' }, message.properties.correlationId));
        }
        emitMessageCorrelationId('success',JSON.stringify( {applications, stat : 200}), message.properties.correlationId);
    }catch (error) {
        console.error('Error retrieving application:', error);
        // Return a 500 Internal Server Error response in case of an error
        emitMessageCorrelationId('success',JSON.stringify({ message: 'application form is accepted by summerPractiseCoordinator' , stat : 400}), message.properties.correlationId);
        //emitMessage('error', JSON.stringify({ message:  'Internal server error'}));
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
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Application not found' , stat : 400}), message.properties.correlationId);
            throw new Error ('Application not found');
        }
        
        //emitMessage('application letter create', JSON.stringify(content));
        const correlationId = generateUuid();
        emitMessageCorrelationId('cancel application',  JSON.stringify(content),  correlationId);    
        const response = await waitForResponse(correlationId);
        deleteStudent(content.studentMail, content.announcementId, content.companyMail);
        if (response.includes('Application canceled')) {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Application canceled',  stat : 200 }), message.properties.correlationId);
        }else{
            throw new Error('Application letter created');
        }
        //emitMessage('success', JSON.stringify({ message: 'Application Letter is Sent' }));
        
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Duplicate entry: email must be unique' , stat : 400}), message.properties.correlationId);
            
        } else {
            emitMessageCorrelationId('success', JSON.stringify({ message: 'Internal server error', stat : 400 }), message.properties.correlationId);
        }
    }
}




app.listen(5001, () => {
    console.log('Server is running on port 5001');
});