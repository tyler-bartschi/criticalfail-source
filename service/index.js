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
const EXISTING_FRIEND_CODES = [];

async function initializeApp() {
    // tests the connection to the database and updates the EXISTING_FRIEND_CODES array
    await DB.testConnection();
    // DB.testData();
    await updateFriendCodes();
    // console.log(EXISTING_FRIEND_CODES);
    console.log("Server Intialized.");
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
            sendData(res, 200, user);
        }
    }
});

apiRouter.post('/auth/user/login', async (req, res) => {
    // middleware for handling login
    const user = await findUser('email', req.body.email);

    if (user === "error") {
        // findUser returns "error", means a problem occured with database
        sendError(res, 500, "An error occured, wait a moment and try again");
    } else if (user) {
        // findUser properly returns the user, login here
        if (await bcrypt.compare(req.body.password, user.password)) {
            // updates the cookie_token
            user.cookie_token = uuid.v4();
            let result = await DB.updateUserSingleItem(user.id, "cookie_token", user.cookie_token)
            if (!result) {
                sendError(res, 500, "An error occured, wait a moment and try again");
            } else {
                setAuthCookie(res, user.cookie_token);
                sendData(res, 200, user);
            }
        } else {
            // password was incorrect
            sendError(res, 401, "Incorrect password");
        }
    } else {
        // findUser did not find the user
        sendError(res, 404, "Account does not exist");
    }
});

const verifyAuth = async (req, res, next) => {
    // verifies that the cookie in the request matches a current user cookie_token
    // this is why the cookie_token is updated in the database upon login
    const user = await findUser("cookie_token", req.cookies[authCookieName]);
    if (user === "error") {
        sendError(res, 500);
    } else if (user) {
        next();
    } else {
        sendError(res, 401, "Unauthorized");
    }
};


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

function sendData(res, statusCode=200, data) {
    // handles sending data back to the frontend
    res.status(statusCode).json(data);
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
    } else if (field === "cookie_token") {
        return await DB.findByCookieToken(value);
    }
}

async function createUser(email, username, password) {
    // creates a user account, calls DB to add it to the table
    const passwordHash = await bcrypt.hash(password, 10);
    const idNum = utils.getRandomInt();
    const friend = utils.getFriendCode(EXISTING_FRIEND_CODES);

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

async function updateFriendCodes() {
    // updates EXISTING_FRIEND_CODES with all the friend codes currently in the database
    const data = await DB.getAllFriendCodes();
    if (!Array.isArray(data)) {
        return;
    }
    data.forEach(item => EXISTING_FRIEND_CODES.push(item.friend_code));
}

// each user requires: id, email, username, password(hashed), friend code, profile_picture url, tokens for edited data, cookie-token
// tokens for edited data should be a multiple lists of tokens, each one corresponding to an entry in a table for all the character sheets, stats, etc.
// lists of tokens: character sheets (bookmarked, custom, edited), monsters (custom, bookmarked), equipment (bookmarked, custom)