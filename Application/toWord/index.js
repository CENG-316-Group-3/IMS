var amqp = require('amqplib/callback_api');
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
const rabbitMQUrl = 'amqp://localhost';


amqp.connect(rabbitMQUrl, function(error0, connection) {
    if (error0) throw error0;

    connection.createChannel(function(error1, ch) {
        if (error1) throw error1;

        channel = ch;
        const exchange = 'direct_logs';
        const queueName = 'applicationQueue2';
        const routingKeys = ['error', 'success'];
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
                if (message.fields.routingKey === 'error') {
                    handleError(message.content.toString());
                }else if(message.fields.routingKey === 'success'){
                    handleSuccess(message.content.toString())
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


app.post('/student/applyToInternship', async(req, res) => { 
    const content = req.body;
    const msg = JSON.stringify(content);
    emitMessage('/student/applyToInternship', msg);
    res.send('Application letter is created');
});

app.post('/student/sendApplicationForm', async(req, res) => { 
    const content = req.body;
    const msg = JSON.stringify(content);
    emitMessage('/student/applyToInternship', msg);
    res.send('Application form is created');
});

app.put('/company/acceptApplicationLetter', async(req, res) => { 
    const content = req.body;
    const msg = JSON.stringify(content);
    emitMessage('/company/acceptApplicationLetter', msg);
    res.send('Application letter is accepted by company');
});




async function handleError(msg) {
    const content = JSON.parse(msg);
    const { message } = content;
    // Update the application status in the database
    console.log(message);
    return 1;
}

async function handleSuccess(msg) {
    const content = JSON.parse(msg);
    const { message } = content;
    // Update the application status in the database
    console.log(message);
    return 1;
}

app.listen(4001, () => {
    console.log('Server is running on port 4001');
});
