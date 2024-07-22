const app = require( "./src/app");

app
    .listen(process.env.PORT, () => {
        console.log(`SHOPPING SERVER RUNNING ON PORT : ${process.env.PORT}`);
    })
    .on('error', (err) => {
        console.error(err);
        process.exit();
    });
