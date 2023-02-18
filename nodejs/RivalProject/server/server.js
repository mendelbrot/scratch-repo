const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require('multer');
require('dotenv').config();
const db = require('./db');
const auth = require('./auth');
const routes = require("./routes");
const app = express();
const port = process.env.PORT || 4000;
const env = process.env.NODE_ENV;
const secret = process.env.SECRET;

// app.use(cors({credentials:true}))
if(env != 'development' && env != 'production')
    throw new ReferenceError('Missing or invalid environment variable: NODE_ENV');

// To enable CORS
if(env == 'development') {
    app.use(function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
        res.setHeader("Access-Control-Allow-Credentials", "true")
        next();
})};

// Set static folder
app.use(express.static(path.join(__dirname, '../build')));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", routes);

// wildcard to send react client
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});


app.listen(port, function () {
    console.log("Server started on port " + port)
});
