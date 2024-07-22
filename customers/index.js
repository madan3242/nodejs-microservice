const express = require("express");
const connection = require("./src/config/connection");
const expressApp = require("./src/app");

const StartServer = async () => {

    const app = express();

    await connection();

    await expressApp(app);

    app.listen(process.env.PORT, () => {
        console.log(`CUSTOMERS SERVER RUNNING ON PORT : ${process.env.PORT}`);
    })
    .on('error', (err) => {
        console.error(err);
        process.exit();
    });
}
StartServer();