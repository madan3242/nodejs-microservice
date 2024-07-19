const mongoose = require("mongoose");
const { MONGODB_URL } = require(".");

module.exports = async() => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log(`DATABASE CONNECTED`);
    } catch (error) {
        console.log(`Error -------`);
        console.log(error);
        process.exit(1);
    }
}