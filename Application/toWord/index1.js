var amqp = require('amqplib/callback_api');
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ApplicationLetter = require('../fileModeration/models/ApplicationLetter');
const Rabbitmq = require('rabbitmq');
const rabbitmq =

app.post('/student/applyToInternship', async(req, res) => { // to send application letter
    const content = req.body;
    const msg = JSON.stringify(content);
    emitMessage('/student/applyToInternship', msg);
    res.send('Application letter is created');
});

app.post('/student/sendApplicationForm', async(req, res) => { 
    const content = req.body;
    const msg = JSON.stringify(content);
    emitMessage('/student/sendApplicationForm', msg);
    res.send('Application form is created');
});

app.put('/company/acceptApplicationLetter', async(req, res) => { 
    const content = req.body;
    const msg = JSON.stringify(content);
    emitMessage('/company/acceptApplicationLetter', msg);
    res.send('Application letter is accepted by company');
});

app.put('/company/rejectApplicationLetter', async(req, res) => { 
    const content = req.body;
    const msg = JSON.stringify(content);
    emitMessage('/company/rejectApplicationLetter', msg);
    res.send('Application letter is rejected by company');
});

app.put('/company/rejectApplicationForm', async(req, res) => { 
    const content = req.body;
    const msg = JSON.stringify(content);
    emitMessage('/company/rejectApplicationForm', msg);
    res.send('Application form is rejected by company');
});


app.put('/summerPractiseCoordinator/rejectApplicationForm', async(req, res) => { 
    const content = req.body;
    const msg = JSON.stringify(content);
    emitMessage('/summerPractiseCoordinator/rejectApplicationForm', msg);
    res.send('Application form is rejected by summer practise coordinator');
});

app.put('/company/acceptApplicationForm', async(req, res) => { 
    const content = req.body;
    const msg = JSON.stringify(content);
    emitMessage('/company/acceptApplicationForm', msg);
    res.send('Application form is accepted by company');
});


app.put('/summerPractiseCoordinator/acceptApplicationForm', async(req, res) => { 
    const content = req.body;
    const msg = JSON.stringify(content);
    emitMessage('/summerPractiseCoordinator/acceptApplicationForm', msg);
    res.send('Application form is accepted by summer Practise Coordinator');
});

//http://localhost:4001/applicationLetter?companyMail=company@gmail.com&announcementId=2&studentMail=serhateren2002@gmail.com
app.get('/applicationLetter', async(req, res) => {
    const content = req.query;
    const msg = JSON.stringify(content);
    const correlationId = generateUuid();
    emitMessageCorrelationId('/applicationLetter', msg, correlationId);
    await waitForResponse(correlationId,res);    
} );

async function emitMessageCorrelationId(routingKey, message, correlationId) {
    const exchange = 'direct_logs';    
    channel.publish(exchange, routingKey, Buffer.from(msg),{
        correlationId: correlationId
    });
    console.log(`[x] Sent message with routing key ${routingKey}: '${message}'`);
}


async function waitForResponse(correlationId, res) {
    channel.consume(queue.queue, function (msg) {

        if (me.fields.routingKey === 'success'){
            if (msg.properties.correlationId === correlationId) {
                console.log(JSON.stringify(msg.content.toString()));
                res.send(JSON.stringify(msg.content.toString()));
            }
        } 
    }, { noAck: true });
}
    

function emitMessage(routingKey, message) {
    const exchange = 'direct_logs';    
    channel.publish(exchange, routingKey, Buffer.from(message));
    console.log(`[x] Sent message with routing key ${routingKey}: '${message}'`);
}


/*

async function handleError(msg) {
    const content = JSON.parse(msg);
    const { message } = content;
    // Update the application status in the database
    console.log(message);
    return 1;
}
*/


function generateUuid() {
    return Math.random().toString() + Math.random().toString() + Math.random().toString();
}

app.listen(4001, () => {
    console.log('Server is running on port 4001');
});
