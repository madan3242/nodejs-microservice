const express = require("express");
const cors = require("cors");

const connection =require("./config/connection");
const productRouter = require("./routes/productRoutes");

const app = express();

await connection();

app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({ extended: true, limit: '1mb'}));
app.use(cors());

app.use("/api/v1", productRouter);

export default app;