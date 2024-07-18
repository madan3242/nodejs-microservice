const express = require("express");
const cors = require("cors");

const connection =require("./config/connection");

const app = express();

await connection();

app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({ extended: true, limit: '1mb'}));
app.use(cors());

export default app;