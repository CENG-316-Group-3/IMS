const amqp = require('amqplib/callback_api');
let channel;
let queue;
const rabbitMQUrl = 'amqp://localhost';
const responseHandlers = {};
const AnnouncementRepository = require('../repositories/announcement_repository');




function generateUuid() {
    return Math.random().toString() + Math.random().toString() + Math.random().toString();
}

function emitMessageCorrelationId(routingKey, message, correlationId) {
    const exchange = 'direct_logs';
    channel.publish(exchange, routingKey, Buffer.from(message), { correlationId, replyTo: queue });
    console.log(`[x] Sent message with routing key ${routingKey}: '${message}'`);
}

function connect() {amqp.connect(rabbitMQUrl, function(error0, connection) {
    if (error0) throw error0;

    connection.createChannel(function(error1, ch) {
        if (error1) throw error1;

        channel = ch;
        const exchange = 'direct_logs';
        const queueName = 'notificationQueueSender';
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
                console.log(`[x] Received message with routing key ${msg.fields.routingKey}: '${msg.content.toString()}'`);
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
}

connect();

function waitForResponse(correlationId) {
    return new Promise((resolve) => {
        responseHandlers[correlationId] = (content) => {
            resolve(content);
        };
    });
}

send_notification = async (msgContent)=> {
    const correlationId = generateUuid();
    emitMessageCorrelationId('notification.create', JSON.stringify(msgContent), correlationId);
    const response = await waitForResponse(correlationId);
    const parsedResponse = JSON.parse(response);
    //res.status(parsedResponse.status).send(parsedResponse.message);
}

exports.sendApproveAnnouncementNotification = async(msgContent)=> {
    const announcement = await AnnouncementRepository.getAnnouncementById(msgContent.id);
    const announcement_data = announcement[0].dataValues;
    const notification_type = "Announcement Approvation";  
    const title = `Your request is accepted for ${announcement_data.title}` ;
    console.log("küçük ünal");
    console.log(msgContent);
    const updatedMsgContent = { 
        ...msgContent, 
        receiver_mail: announcement_data.user_mail, 
        notification_type: notification_type,
        title: title,
    };
    
    send_notification(updatedMsgContent);
}

exports.sendRejectAnnouncementNotification = async(msgContent)=> {
    const announcement = await AnnouncementRepository.getAnnouncementById(msgContent.id);
    console.log("küçük eşek");
    console.log(announcement);
    const announcement_data = announcement[0].dataValues;
    const notification_type = "Announcement Rejection";  
    const title = `Your request is rejected for ${announcement_data.title}` ;
    console.log(msgContent.content);

    const updatedMsgContent = { 
        ...msgContent, 
        receiver_mail: announcement_data.user_mail, 
        notification_type: notification_type,
        title: title,
        content: msgContent.content
    };
    
    send_notification(updatedMsgContent);
}



