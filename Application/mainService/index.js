const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const applicationTable = require('./models/applicationTable.js');
const Sequelize = require("sequelize");


const app = express();
app.use(bodyParser.json());

var amqp = require('amqplib/callback_api');
const rabbitMQUrl = 'amqp://localhost';

amqp.connect(rabbitMQUrl, function(error0, connection) {
    if (error0) throw error0;

    connection.createChannel(function(error1, ch) {
        if (error1) throw error1;

        channel = ch;
        const exchange = 'direct_logs';
        const queueName = 'applicationQueue1';
        const routingKeys = ['application letter created', 'application form created','/student/applyToInternship','/student/sendApplicationForm','/company/acceptApplicationLetter'];
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
                
                // Determine which process function to call based on the routing key
                if (message.fields.routingKey === 'application letter created') {
                    processApplicationLetterCreated(message.content.toString());

                } else if (message.fields.routingKey === 'application form created') {
                    processApplicationFormCreated(message.content.toString());
                } else if (message.fields.routingKey === '/student/applyToInternship'){
                    processStudentApplyToInternship(message.content.toString());
                } else if (message.fields.routingKey === '/student/sendApplicationForm'){
                    processStudentSendApplicationForm(message.content.toString());
                } else if (message.fields.routingKey === '/company/acceptApplicationLetter'){
                    processCompanyAcceptApplicationLetter(message.content.toString());
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
        const content = JSON.parse(message);
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
        const content = JSON.parse(message);
        const { studentMail, announcementId, companyMail } = content;

        // Update the application status in the database
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application form is created', '', 'application form is processing');
        console.log('Application status updated to "application form created"');
    } catch (error) {
        console.error('Error processing application form created message:', error);
    }
}

async function processStudentApplyToInternship(message){
    const content = JSON.parse(message);
    try{
        await applicationTable.create({
            studentMail: content.studentMail,
            companyMail: content.companyMail,
            announcementId:content.announcementId,
            status: "application is started",
            content: ""
        });
        emitMessage('application letter', JSON.stringify(content));
        emitMessage('success', JSON.stringify({ message: 'Application Letter is Sent' }));
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            emitMessage('error', JSON.stringify({ message: 'Duplicate entry: email must be unique' }));
            
        } else {
            emitMessage('error', JSON.stringify({ message: 'Internal server error' }));
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
    const content = JSON.parse(message);
    try{
        await updateApplicationStatus(content.studentMail, content.announcementId, content.companyMail, 'application form is processing', "", 'application letter is accepted');
        emitMessage('application form', JSON.stringify(content));
        emitMessage('success', JSON.stringify({ message: 'Application Form is Sent' }));
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            emitMessage('error', JSON.stringify({ message: 'Error updating application status' }));
            
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
    const msg = JSON.parse(message);
    const { studentMail, announcementId, companyMail, content} = msg;
    try {
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application letter is accepted', "", 'application letter created');
        emitMessage('success', JSON.stringify({ message: 'application letter is accepted' }));
    } catch (error) {
        emitMessage('error', JSON.stringify({ message: 'Error accepting Applicaton Letter ' }));
    }
}
app.put('/company/acceptApplicationLetter', async(req, res) => {
    const { studentMail, announcementId, companyMail, content} = req.body;
    try {
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application letter is accepted', "", 'application letter created');
        res.send('application letter is accepted');
    } catch (error) {
        res.status(500).send('Error updating application status');
    }
});

app.put('/company/rejectApplicationLetter', async(req, res) => {
    const { studentMail, announcementId, companyMail, content} = req.body;
    try {
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application letter is rejected', content, 'application letter created');
        res.send('application letter is rejected');
    } catch (error) {
        res.status(500).send('Error updating application status');
    }
});

app.put('/company/rejectApplicationForm', async(req, res) => {
    const { studentMail, announcementId, companyMail, content} = req.body;
    try {
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application form is rejected by company', content, 'application form is created');
        res.send('application form is rejected by company');
    } catch (error) {
        res.status(500).send('Error updating application status');
    }
});

app.put('/summerPractiseCoordinator/rejectApplicationForm', async(req, res) => {
    const { studentMail, announcementId, companyMail, content} = req.body;
    try {
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application form is rejected by summer practise coordinator', content, 'application form is accepted by company');
        res.send('application form rejected by summer practise coordinator');
    } catch (error) {
        res.status(500).send('Error updating application status');
    }
});




app.put('/company/acceptApplicationLetter', async(req, res) => {
    const { studentMail, announcementId, companyMail, content} = req.body;
    try {
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application letter is accepted', "", 'application letter created');
        res.send('application letter is accepted');
    } catch (error) {
        res.status(500).send('Error updating application status');
    }
});



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


app.put('/summerPractiseCoordinator/acceptApplicationForm', async(req, res) => {
    const { studentMail, announcementId, companyMail, content} = req.body;
    try {
        await updateApplicationStatus(studentMail, announcementId, companyMail, 'application form is accepted by summer practise coordinator', content, 'application form is accepted by company');
        res.send('application form is accepted by summerPractiseCoordinator');
    } catch (error) {
        res.status(500).send('Error updating application status');
    }
});




app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
