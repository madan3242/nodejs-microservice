const express = require("express");
const cors = require("cors");

const connection =require("./config/connection");
const shoppingRouter = require("./routes/shoppingRoutes");
const ErrorHandler = require("./utils/errorHandler");

const app = express();

connection();

app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({ extended: true, limit: '1mb'}));
app.use(cors());

app.use("/api/v1", shoppingRouter);

app.use(ErrorHandler);

module.exports =  app;