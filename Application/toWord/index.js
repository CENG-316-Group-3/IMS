const amqp = require('amqplib/callback_api');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const rabbitMQUrl = 'amqp://localhost';
let channel;
let queue;

// Store response handlers for pending RPC calls
const responseHandlers = {};

// Generate a unique UUID for each request
function generateUuid() {
    return Math.random().toString() + Math.random().toString() + Math.random().toString();
}

// Establish connection and setup the RabbitMQ channel and queue
amqp.connect(rabbitMQUrl, function(error0, connection) {
    if (error0) throw error0;

    connection.createChannel(function(error1, ch) {
        if (error1) throw error1;

        channel = ch;
        const exchange = 'direct_logs';
        const queueName = 'applicationQueue2';
        const routingKeys = ['error', 'success'];
        
        channel.assertExchange(exchange, 'direct', { durable: false });
        channel.assertQueue(queueName, { exclusive: true }, function(error2, q) {
            if (error2) throw error2;
            
            queue = q.queue;
            console.log(`[*] Waiting for messages in queue ${queueName}. To exit press CTRL+C`);

            routingKeys.forEach(routingKey => {
                channel.bindQueue(q.queue, exchange, routingKey);
                console.log(`[*] Bound queue ${queueName} to exchange ${exchange} with routing key ${routingKey}`);
            });

            // Set up a single consumer to handle responses
            channel.consume(q.queue, (msg) => {
                const correlationId = msg.properties.correlationId;
                const content = msg.content.toString();
                if (msg.fields.routingKey === 'error') {
                    handleError(msg.content.toString());
                }else if(msg.fields.routingKey === 'success'){
                if (responseHandlers[correlationId]) {
                    responseHandlers[correlationId](content);
                    delete responseHandlers[correlationId];
                }}
            }, { noAck: true });

            console.log("RabbitMQ channel and exchange setup completed");
        });
    });
});

// Emit message with correlationId for RPC
function emitMessageCorrelationId(routingKey, message, correlationId) {
    const exchange = 'direct_logs';
    channel.publish(exchange, routingKey, Buffer.from(message), { correlationId, replyTo: queue });
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

// Middleware to handle POST requests

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


// Additional routes for handling various application actions...

// Handle GET request for application letter
app.get('/applicationLetter', async (req, res) => {
    const content = req.query;
    const msg = JSON.stringify(content);
    const correlationId = generateUuid();

    emitMessageCorrelationId('/applicationLetter', msg, correlationId);
    const response = await waitForResponse(correlationId);
    res.send(response);
});

app.get('/applicationForm', async (req, res) => {
    const content = req.query;
    const msg = JSON.stringify(content);
    const correlationId = generateUuid();
    
    emitMessageCorrelationId('/applicationForm', msg, correlationId);
    const response = await waitForResponse(correlationId);
    res.send(response);
});

// Emit message without correlationId
function emitMessage(routingKey, message) {
    const exchange = 'direct_logs';
    channel.publish(exchange, routingKey, Buffer.from(message));
    console.log(`[x] Sent message with routing key ${routingKey}: '${message}'`);
}
async function handleError(msg) {
    const content = JSON.parse(msg);
    const { message } = content;
    // Update the application status in the database
    console.log(message);
    return 1;
}

// Start the Express server
app.listen(4001, () => {
    console.log('Server is running on port 4001');
});
