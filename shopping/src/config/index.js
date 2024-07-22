const dotEnv = require("dotenv");
dotEnv.config();

module.exports = {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    APP_SECRET: process.env.APP_SECRET,
    MESSAGE_QUEUE_URL: process.env.MESSAGE_QUEUE_URL,
    EXCHANGE_NAME: 'ONLINE_SHOPPING',
    CUSTOMER_SERVICE: 'CUSTOMER_SERVICE',
    SHOPPING_SERVICE: 'SHOPPING_SERVICE',
}