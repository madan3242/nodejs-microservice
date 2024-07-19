const dotEnv = require("dotenv");
dotEnv.config();

module.exports = {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
    EXCHANGE_NAME: 'ONLINE_SHOPPING',
}