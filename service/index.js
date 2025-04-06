const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const uuid = require('uuid');
const DB = require('./database.js');

const app = express();
const authCookieName = 'token';

const port = process.argv.length > 2 ? process.argv[2] : 5000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.use(function (err, req, res, next) {
    res.status(500).send({type: err.name, message: err.message});
});

app.use((_req, res) => {
    res.sendFile('index.html', {root: 'public'});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});