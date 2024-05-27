

const amqp = require('amqplib');

class Producer {
    channel;
  
    async createChannel() {
      const connection = await amqp.connect(  'amqp://localhost');
      this.channel = await connection.createChannel(); // await ekleyerek kanalı oluşturma işleminin tamamlanmasını bekliyoruz
    }
  
    async publishMessage(routingKey, message) {
        console.log('burda teneke 2')
      if (!this.channel) {
        await this.createChannel();
      }
  
      await this.channel.assertExchange('direct_logs', 'direct', { durable: false });
      
      this.channel.publish(
        process.env.RABBITEXCHANGE,
        routingKey,
        Buffer.from(
          JSON.stringify({
            logType: routingKey,
            message: message,
            dateTime: new Date(),
          })
        )
      );
      console.log(
        The message "${message}" is sent to exchange ${process.env.RABBITEXCHANGE}
      );
    }

    async consumeMessages(queue,routingKey, callback){
      if (!this.channel) {
        await this.createChannel();
      }
      //console.log('consume edildi');
      await this.channel.assertExchange(process.env.RABBITEXCHANGE, 'direct');
      const q = await this.channel.assertQueue(queue, { durable: true });
      await this.channel.bindQueue(q.queue, process.env.RABBITEXCHANGE, routingKey);
      this.channel.consume(q.queue, (msg) => {
        if (msg !== null) {
          const content = JSON.parse(msg.content.toString());
          console.log(content);
          callback(content);
          this.channel.ack(msg);
        }
      }, { noAck: false });
    }
  }
  
  module.exports = Producer;