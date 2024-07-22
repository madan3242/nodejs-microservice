const amqplib = require("amqplib");
const { MESSAGE_BROKER_URL, EXCHANGE_NAME } = require("../config");

class MessageBroker {
    constructor(){
        this.channel = null;
    }

    async createChannel(){
        console.log("Connecting to RabbitMQ");
        try {
            const connection = await amqplib.connect(MESSAGE_BROKER_URL);
            this.channel = await connection.createChannel();
            await this.channel.assertExchange(EXCHANGE_NAME, 'direct', false);
            // return channel;
            console.log("RabbitMQ Connected");
            console.log(this.channel);
        } catch (error) {
            throw error;
        }
    }

    async publishMessage(binding_key, message){
        try {
            this.channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
            console.log(`Message has been sent ${message.toString()}`);
        } catch (error) {
            throw error
        }
    }

    async subscribeMessage(channel, service, binding_key){
        try {
            const appQueue = await channel.assertQueue(QUEUE_NAME);
            channel.bindQueue(appQueue, EXCHANGE_NAME, binding_key);

            channel.consume(appQueue, data => {
                console.log('Recived data');
                console.log(data?.content?.toString());
                channel.ack(data);
            })
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new MessageBroker();

// /* ----------- Message Broker ----------- */
// //Create channel
// module.exports.CreateChannel = async () => {
//     try {
//         const connection = await amqplib.connect(MESSAGE_BROKER_URL);
//         const channel = await connection.createChannel();
//         await channel.assertExchange(EXCHANGE_NAME, 'direct', false);
//         return channel;
//     } catch (error) {
//         throw error
//     }
// }

// //Publish message
// module.exports.PublishMessage = async (channel, binding_key, message) => {
//     try {
//         await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
//         console.log(`Message has been sent ${message.toString()}`);
//     } catch(error){
//         throw error;
//     }
// }

// //Subscribe message
// module.exports.SubscribeMessage = async (channel, service, binding_key) => {
//     const appQueue = await channel.assertQueue(QUEUE_NAME);
//     channel.bindQueue(appQueue, EXCHANGE_NAME, binding_key);

//     channel.consume(appQueue, data => {
//         console.log('Recived data');
//         console.log(data?.content?.toString());
//         channel.ack(data);
//     })
// }