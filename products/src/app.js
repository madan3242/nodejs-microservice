const express = require("express");
const cors = require("cors");

const ErrorHandler = require("./utils/errorHandler");
const { CreateChannel } = require("./utils");
const products = require("./controllers/productController");

module.exports = async (app) => {
    app.use(express.json({limit: '1mb'}));
    app.use(express.urlencoded({ extended: true, limit: '1mb'}));
    app.use(cors());

    const channel = await CreateChannel();

    products(app, channel);
    
    app.use(ErrorHandler);
};