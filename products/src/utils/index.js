const amqplib = require("amqplib");
const { MESSAGE_BROKER_URL, EXCHANGE_NAME } = require("../config");

module.exports.FormateData = data => {
    if (data) {
        return { data };
    } else {
        throw new Error("Data not found!");
    }
}

/* ----------- Message Broker ----------- */
//Create channel
module.exports.CreateChannel = async () => {
    try {
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);
        const channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, 'direct', false);
        return channel;
    } catch (error) {
        throw error
    }
}

//Publish message
module.exports.PublishMessage = async (channel, binding_key, message) => {
    try {
        await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
        console.log(`Message has been sent ${message.toString()}`);
    } catch(error){
        throw error;
    }
}

//Subscribe message
module.exports.SubscribeMessage = async (channel, service, binding_key) => {
    const appQueue = await channel.assertQueue(QUEUE_NAME);
    channel.bindQueue(appQueue, EXCHANGE_NAME, binding_key);

    channel.consume(appQueue, data => {
        console.log('Recived data');
        console.log(data?.content?.toString());
        channel.ack(data);
    })
}