// imports
const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const uuid = require('uuid');
const DB = require('./database.js');

const app = express();
const authCookieName = 'cookie_token';

// tests the connection to the database
DB.testConnection();
// DB.testData();

const port = process.argv.length > 2 ? process.argv[2] : 5000;

// array for existing friend codes already in the system
const EXISTING_FRIEND_CODES = [];

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

var apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.post('/auth/user/create', async (req, res) => {
    // creates a new user. Fails for random reasons, and if a user with the same email is found.
    // When successful, will set an authcookie and send the user object to the frontend
    // expects the request body to have an email
    const result = await findUser('email', req.body.email);
    if (result === "error") {
        res.status(500).send({msg: "An error occured, wait a moment and try again"});
    } else if (result) {
        res.status(409).send({msg: "Email already in use"});
    } else {
        const user = await createUser(req.body.email, req.body.username, req.body.password);

        if (!user) {
            res.status(500).send({msg: "Account creation failed. Please try again"});
        } else {
            setAuthCookie(res, user.cookie_token);
            // .json automatically stringifies the object and sets the appropriate header
            res.status(200).json(user);
        }
    }
});

async function findUser(field, value) {
    if (!value) return null;

    if (field === "email") {
        return await DB.findByEmail(value);
    }
}

async function createUser(email, username, password) {
    // creates a user account, calls DB to add it to the table
    const passwordHash = await bcrypt.hash(password, 10);
    const idNum = getRandomInt();
    const friend = getFriendCode();

    const user = {
        id: idNum,
        email: email,
        username: username,
        password: passwordHash,
        friend_code: friend, 
        profile_url: "default",
        tokens: {},
        cookie_token: uuid.v4(),
    };

    if (await DB.createUser(user)) {
        return user;
    }
    return false;
}

function setAuthCookie(res, authToken) {
    // sets authentication cookie for the user
    res.cookie(authCookieName, authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
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


function getRandomInt() {
    // Generates random integer for use in user id field
    let min = 7000;
    let max = 100000;
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getFriendCode() {
    // Generates a random, unique friend code. Keep in index.js for access to EXISTING_FRIEND_CODES
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


// each user requires: id, email, username, password(hashed), friend code, profile_picture url, tokens for edited data, cookie-token
// tokens for edited data should be a multiple lists of tokens, each one corresponding to an entry in a table for all the character sheets, stats, etc.
// lists of tokens: character sheets (bookmarked, custom, edited), monsters (custom, bookmarked), equipment (bookmarked, custom)