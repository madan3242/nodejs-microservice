const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");
const { MESSAGE_BROKER_URL, EXCHANGE_NAME, APP_SECRET, QUEUE_NAME, SHOPPING_BINDING_KEY } = require("../config");

//Utility functions

module.exports.GeneratePassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

module.exports.ValidatePassword = async (enteredPassword, savedPassword) => {
    return await bcrypt.compare(enteredPassword, savedPassword);
}

module.exports.GenerateSignature = async (payload) => {
    try {
        return jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports.ValidateSignature = async (req) => {
    try {
        const signature = req.get("Authorization");

        const payload = jwt.verify(signature.split(" ")[1], APP_SECRET);
        req.user = payload;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

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
module.exports.SubscribeMessage = async (channel, service) => {
    const appQueue = await channel.assertQueue(QUEUE_NAME);
    channel.bindQueue(appQueue, EXCHANGE_NAME, SHOPPING_BINDING_KEY);

    channel.consume(appQueue, data => {
        console.log('Recived data');
        console.log(data?.content?.toString());
        service.SubscribeEvent(data?.content?.toString());
        channel.ack(data);
    })
}