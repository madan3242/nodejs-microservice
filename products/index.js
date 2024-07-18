const app = require( "./src/app");

app
.listen(process.env.PORT, () => {
    console.log(`PRODUCTS SERVER RUNNING ON PORT : ${process.env.PORT}`);
})
.on('error', (err) => {
    console.error(err);
    process.exit();
})
