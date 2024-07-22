const express = require("express");
const cors = require("cors");

const connection =require("./config/connection");
const customerRouter = require("./routes/customerRoutes");

const app = express();

connection();

app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({ extended: true, limit: '1mb'}));
app.use(cors());

app.use("/api/v1", customerRouter);

module.exports = app;