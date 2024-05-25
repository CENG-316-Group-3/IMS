const NotificationRepository = require('../repositories/notification_repository');

exports.createNotification = async (msgContent, channel, message) => {
    try {
        const exchange = 'direct_logs'; 
        console.log("yes");
        console.log(msgContent);
        //const { sender_mail, receiver_mail, notification_type, title, content } = msgContent;
        await NotificationRepository.saveNotification({
            sender_mail: msgContent.user_mail, 
            receiver_mail:msgContent.receiver_mail, 
            notification_type: msgContent.notification_type, 
            title: msgContent.title, 
            content: msgContent.content });
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({status: 200})),{
            correlationId: message.properties.correlationId});  
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
            correlationId: message.properties.correlationId});
    }
};


exports.getNotifications = async (msgContent, channel, message) => {
    try {
        const exchange = 'direct_logs';

        const notification = await NotificationRepository.getNotifications(msgContent.user_mail);
        const response = { message: notification, status: 200 };
        console.log(response);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify(response)),{
            correlationId: message.properties.correlationId});  
    } catch (error) {
        console.error(error);
        channel.publish(exchange, 'success', Buffer.from(JSON.stringify({ status: 400 })),{
            correlationId: message.properties.correlationId});
    }
};