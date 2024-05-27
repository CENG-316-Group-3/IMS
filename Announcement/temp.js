const AnnouncementRepository = require('../repositories/announcement_repository');
const amqp = require('amqplib/callback_api');
let channel;
let queue;
const rabbitMQUrl = 'amqp://localhost';
const responseHandlers = {};


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
// Function to wait for a response
function waitForResponse(correlationId) {
    return new Promise((resolve) => {
        responseHandlers[correlationId] = (content) => {
            resolve(content);
        };
    });
}

// Function to handle getAnnouncementbyId
exports.getAnnouncementById = async (msgContent, channel, message) => {
    try {
        const announcement = await AnnouncementRepository.getAnnouncementById(msgContent.id);
        const exchange = 'direct_logs';    
        const response = { message: announcement, status: 200 };
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify(response)),{
        correlationId: message.properties.correlationId})
  
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
        correlationId: message.properties.correlationId})
    }
};

// Function to handle getCompanyAnnouncements
exports.getCompanyAnnouncements = async (msgContent, channel, message) => {
    try {
        const announcements = await AnnouncementRepository.getCompanyAnnouncements(msgContent.user_mail);
        const exchange = 'direct_logs';   
        const response = { message: announcements, status: 200 }; 
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify(response)),{
        correlationId: message.properties.correlationId});
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
        correlationId: message.properties.correlationId});
    }    
};


exports.createInternshipAnnouncement = async (msgContent, channel, message) => {
    try {
        const exchange = 'direct_logs'; 
        const { user_mail, title, position, content, file_path } = msgContent;
        await AnnouncementRepository.saveInternshipAnnouncement({user_mail, title, position, content, file_path });
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({status: 200})),{
            correlationId: message.properties.correlationId});  
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
            correlationId: message.properties.correlationId});
    }
};

// Function to handle updateInternshipAnnouncement
exports.updateInternshipAnnouncement = async (msgContent, channel, message) => {
    try {
        const exchange = 'direct_logs';
        const { id, user_mail, title, position, content, file_path } = msgContent;
        await AnnouncementRepository.updateInternshipAnnouncement({ id, user_mail, title, position, content, file_path });
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({status: 200})),{
            correlationId: message.properties.correlationId});
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
            correlationId: message.properties.correlationId});
    }
};

// Function to handle deleteInternshipAnnouncement
exports.deleteInternshipAnnouncement = async (msgContent, channel, message) => {
    try {
        const exchange = 'direct_logs';
        await AnnouncementRepository.deleteAnnouncementById(msgContent.id);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({status: 200})),{
            correlationId: message.properties.correlationId});
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
            correlationId: message.properties.correlationId});
    }
};

exports.getAllCompanyAnnouncements = async (msgContent, channel, message) => {
    try {
        const announcements = await AnnouncementRepository.getAllCompanyAnnouncements();
        const exchange = 'direct_logs';   
        const response = { message: announcements, status: 200 }; 
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify(response)),{
        correlationId: message.properties.correlationId});
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
        correlationId: message.properties.correlationId});
    }    
};

// Function to handle getWaitingAnnouncements
exports.getWaitingAnnouncements = async (msgContent, channel, message) => {
    try {
        const announcements = await AnnouncementRepository.getAnnouncementsByStatus("waiting_for_approvation");
        const exchange = 'direct_logs';    
        const response = { message: announcements, status: 200 }; 
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify(response)),{
        correlationId: message.properties.correlationId});
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
        correlationId: message.properties.correlationId});
    }
};

exports.createCoordinatorAnnouncement = async (msgContent, channel, message) => {
    try {
        const exchange = 'direct_logs'; 
        const { user_mail, title, content, file_path } = msgContent;
        await AnnouncementRepository.saveCoordinatorAnnouncement({user_mail, title, content, file_path });
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({status:200})),{
            correlationId: message.properties.correlationId});  
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400})),{
            correlationId: message.properties.correlationId});
    }
};

exports.updateCoordinatorAnnouncement = async (msgContent, channel, message) => {
    try {
        const exchange = 'direct_logs';
        const { id, user_mail, title, content, file_path } = msgContent;
        await AnnouncementRepository.updateCoordinatorAnnouncement({ id, user_mail, title, content, file_path });
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({status: 200})),{
            correlationId: message.properties.correlationId});
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
            correlationId: message.properties.correlationId});
    }
};

exports.deleteCoordinatorAnnouncement = async (msgContent, channel, message) => {
    try {
        const exchange = 'direct_logs';
        await AnnouncementRepository.deleteCoordinatorAnnouncementById(msgContent.id);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({status: 200})),{
            correlationId: message.properties.correlationId});
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
            correlationId: message.properties.correlationId});
    }
};

// Function to handle approveAnnouncement
exports.approveAnnouncement = async (msgContent, channel, message) => {
    try {
        const exchange = 'direct_logs';  
        await AnnouncementRepository.updateAnnouncementStatus(msgContent.id, "approved");
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({status: 200})),{
            correlationId: message.properties.correlationId});
        const receiver_mail = await AnnouncementRepository.getCompanyMailByAnnouncementId(msgContent.id);
        msgContent.receiver_mail = receiver_mail;
        send_notification(msgContent);
        
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
            correlationId: message.properties.correlationId});
    }
};

send_notification = async (msgContent)=> {
    const correlationId = generateUuid();
    emitMessageCorrelationId('notification.create', JSON.stringify(msgContent), correlationId);
    const response = await waitForResponse(correlationId);
    const parsedResponse = JSON.parse(response);
    //res.status(parsedResponse.status).send(parsedResponse.message);
}

// Function to handle getApprovedAnnouncements
exports.getApprovedAnnouncements = async (msgContent, channel, message) => {
    try {
        const announcements = await AnnouncementRepository.getAnnouncementsByStatus("approved");
        const exchange = 'direct_logs';    
        const response = { message: announcements, status: 200 };
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify(response)),{
        correlationId: message.properties.correlationId});
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
        correlationId: message.properties.correlationId});
    }
};

exports.getCoordinatorAnnouncements = async (msgContent, channel, message) => {
    try {
        const announcements = await AnnouncementRepository.getCoordinatorAnnouncements();
        const exchange = 'direct_logs';   
        const response = { message: announcements, status: 200 };  
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify(response)),{
        correlationId: message.properties.correlationId});
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
        correlationId: message.properties.correlationId});
    }
};

exports.getCoordinatorAnnouncementsforCoordinator = async (msgContent, channel, message) => {
    try {
        const announcements = await AnnouncementRepository.getCoordinatorAnnouncementsforCoordinator(msgContent.user_mail);
        const exchange = 'direct_logs';    
        const response = { message: announcements, status: 200 }; 
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify(response)),{
        correlationId: message.properties.correlationId});
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
        correlationId: message.properties.correlationId});
    }
};


exports.getCoordinatorAnnouncementbyId = async (msgContent, channel, message) => {
    try {
        const announcements = await AnnouncementRepository.getCoordinatorAnnouncementById(msgContent.id);
        const exchange = 'direct_logs';    
        const response = { message: announcements, status: 200 };
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify(response)),{
        correlationId: message.properties.correlationId})
  
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
        correlationId: message.properties.correlationId})
    }
};
