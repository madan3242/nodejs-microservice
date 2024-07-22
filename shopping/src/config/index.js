const dotEnv = require("dotenv");
dotEnv.config();

module.exports = {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
    APP_SECRET: process.env.APP_SECRET,
    CUSTOMER_SERVICE: 'CUSTOMER_SERVICE',
    SHOPPING_SERVICE: 'SHOPPING_SERVICE',
    EXCHANGE_NAME: 'ONLINE_SHOPPING',
    QUEUE_NAME: 'SHOPPING_QUEUE'
}