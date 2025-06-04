const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const uuid = require('uuid');
const DB = require('./database.js');

const app = express();
const authCookieName = 'cookie-token';

DB.testConnection();

const port = process.argv.length > 2 ? process.argv[2] : 5000;

const EXISTING_FRIEND_CODES = [];

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

var apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.post('/auth/user/create', async (req, res) => {
    // expects the request body to have an email
    const result = await findUser('email', req.body.email);
    if (result === "error") {
        res.status(500).send({msg: "An error occured, wait a moment and try again"});
    } else if (result) {
        res.status(409).send({msg: "Email already in use"});
    } else {
        const user = await createUser(req.body.email, req.body.username, req.body.password);
    }
});

async function findUser(field, value) {
    if (!value) return null;

    if (field === "email") {
        return await DB.findByEmail(value);
    }
}

function getRandomInt() {
    let min = 7000;
    let max = 100000;
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getFriendCode() {
    var alphabet = "ABCDEFGHIJKLMNOP";
    var generated = "";
    
    let nums = Math.floor(Math.random() * (9000) + 1000);
    let selectors = Math.floor(Math.random() * (9000) + 1000);

    for (let i = 0; i < 4; i++) {
        generated += (nums % 10).toString();
        nums = Math.floor(nums / 10);
        generated += alphabet[selectors % 10];
        selectors = Math.floor(selectors / 10);
    }

    if (EXISTING_FRIEND_CODES.includes(generated)) {
        return getFriendCode();
    }
    EXISTING_FRIEND_CODES.push(generated);
    return generated;
}

async function createUser(email, username, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const idNum = getRandomInt();
    const friend = getFriendCode();

    const user = {
        id: idNum,
        email: email,
        password: passwordHash,
        friend_code: friend, 
        profile_url: "default",
        tokens: {},
        cookie_token: uuid.v4(),        
    }

    // call database to add the user, then return user.
}

app.use(function (err, req, res, next) {
    res.status(500).send({type: err.name, message: err.message});
});

app.use((_req, res) => {
    res.sendFile('index.html', {root: 'public'});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


// each user requires: id, email, username, password(hashed), friend code, profile_picture url, tokens for edited data, cookie-token
// tokens for edited data should be a multiple lists of tokens, each one corresponding to an entry in a table for all the character sheets, stats, etc.
// lists of tokens: character sheets (bookmarked, custom, edited), monsters (custom, bookmarked), equipment (bookmarked, custom)