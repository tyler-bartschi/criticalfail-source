// imports
const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const uuid = require('uuid');
const DB = require('./database.js');
const utils = require('./index_utils.js');

const app = express();
const authCookieName = 'cookie_token';

// array for existing friend codes already in the system
// LATER - make a way for this list to persist between deployments. Maybe have a function automatically update this list from the DB?
const EXISTING_FRIEND_CODES = [];

async function initializeApp() {
    // tests the connection to the database
    await DB.testConnection();
    // DB.testData();
    console.log("success");
}

initializeApp();

const port = process.argv.length > 2 ? process.argv[2] : 5000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

var apiRouter = express.Router();
app.use('/api', apiRouter);

// NOTE - I can include next as part of the async parameters, which will tell express to move onto the next matching middleware

apiRouter.post('/auth/user/create', async (req, res) => {
    // creates a new user. Fails for random reasons, and if a user with the same email is found.
    // When successful, will set an authcookie and send the user object to the frontend
    // expects the request body to have an email
    const result = await findUser('email', req.body.email);
    if (result === "error") {
        sendError(res, 500, "An error occured, wait a moment and try again");
    } else if (result) {
        sendError(res, 409, "Email already in use");
    } else {
        const user = await createUser(req.body.email, req.body.username, req.body.password);

        if (!user) {
            sendError(res, 500, "Account creation failed. Please try again");
        } else {
            setAuthCookie(res, user.cookie_token);
            // NOTE - .json automatically stringifies the object and sets the appropriate header
            res.status(200).json(user);
        }
    }
});

app.use(function (err, req, res, next) {
    // general error handling, can be triggered by calling next(err)
    res.status(500).send({type: err.name, message: err.message});
});

app.use((_req, res) => {
    // generalized middleware, sends the index.html if no middleware is triggered before this
    res.sendFile('index.html', {root: 'public'});
});

app.listen(port, () => {
    // tells express to listen on the specified port
    console.log(`Listening on port ${port}`);
});


// HELPER FUNCTIONS DEALING WITH RES, REQ, OR DB HANDLING

function setAuthCookie(res, authToken) {
    // sets authentication cookie for the user
    res.cookie(authCookieName, authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}

function sendError(res, statusCode=500, message="An error occured") {
    // handles error sending
    res.status(statusCode).json({error: message});
}

async function findUser(field, value) {
    // finds a user by a specified field
    if (!value) return null;

    if (field === "email") {
        return await DB.findByEmail(value);
    }
}

async function createUser(email, username, password) {
    // creates a user account, calls DB to add it to the table
    const passwordHash = await bcrypt.hash(password, 10);
    const idNum = utils.getRandomInt();
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


// HELPER FUNCTIONS THAT DO NOT INTERFACE WITH REQ, RES, OR DB

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