const amqp = require('amqplib/callback_api');
const NotificationController = require('./controllers/notification_controller'); // Adjust the path as needed

const rabbitMQUrl = 'amqp://localhost'; // Replace with your RabbitMQ URL

const startRabbitMQConsumer = () => {
    amqp.connect(rabbitMQUrl, function(error0, connection) {
        if (error0) throw error0;

        connection.createChannel(function(error1, channel) {
            if (error1) throw error1;

            const exchange = 'direct_logs';
            const queueName = 'notificationQueue';
            const routingKeys = [
                'notification.create',//
                'notification.get'
                
            ];

            channel.assertExchange(exchange, 'direct', { durable: false });

            channel.assertQueue(queueName, { durable: false}, function(error2, q) {
                if (error2) throw error2;

                console.log(`[*] Waiting for messages in queue ${queueName}. To exit press CTRL+C`);

                routingKeys.forEach(routingKey => {
                    channel.bindQueue(q.queue, exchange, routingKey);
                    console.log(`[*] Bound queue ${queueName} to exchange ${exchange} with routing key ${routingKey}`);
                });

                channel.consume(q.queue, async function(message) {
                    const routingKey = message.fields.routingKey;
                    const msgContent = JSON.parse(message.content.toString());
                    

                    console.log(`[x] Received message with routing key ${routingKey}:`, msgContent);

                    try {
                        switch (routingKey) {
                            case 'notification.create':
                                console.log("notif");
                                await NotificationController.createNotification(msgContent, channel, message);
                                break;
                            case 'notification.get':
                                await NotificationController.getNotifications(msgContent, channel, message);
                                break;
                            default:
                                console.log(`Unknown routing key: ${routingKey}`);
                        }
                    } catch (error) {
                        console.error(`Error processing message with routing key ${routingKey}:`, error);
                    }

                    channel.ack(message);
                }, { noAck: false });
            });
        });
    });
};

module.exports = startRabbitMQConsumer;