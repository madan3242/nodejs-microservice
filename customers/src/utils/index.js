const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");
const { MESSAGE_BROKER_URL, EXCHANGE_NAME, APP_SECRET, QUEUE_NAME, CUSTOMER_SERVICE } = require("../config");

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
        await channel.assertQueue(EXCHANGE_NAME, 'direct', { durable: true });
        return channel;
    } catch (error) {
        throw error
    }
}

//Publish message
module.exports.PublishMessage = async (channel, service, message) => {
    try {
        await channel.publish(EXCHANGE_NAME, service, Buffer.from(message));
        console.log(`Message has been sent ${message.toString()}`);
    } catch(error){
        throw error;
    }
}

//Subscribe message
module.exports.SubscribeMessage = async (channel, service) => {
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
    const q = await channel.assertQueue("", { exclusive: true });
    console.log(`Waiting for messages in queue: ${q.queue}`);

    channel.bindQueue(q.queue, EXCHANGE_NAME, CUSTOMER_SERVICE);

    channel.consume(q.queue, (msg) => {
        if (msg.content) {
            console.log("This message is : ", msg?.content?.toString());
            service.SubscribeEvents(msg?.content?.toString());
        }
        console.log("[X] recived");
    },
    {
        noAck: true,
    });
}