// imports
import dotenv from 'dotenv';
dotenv.config()

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);

import express from "express";
import cookieParser from "cookie-parser";
import * as DB from "./database.js";
import * as utils from "./index_utils.js";
import {authRouter, updateFriendCodes} from "./routes/auth.js";


const app = express();

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

app.use('/api/auth', authRouter);

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


// each user requires: id, email, username, password(hashed), friend code, profile_picture url, tokens for edited data, cookie-token
// tokens for edited data should be a multiple lists of tokens, each one corresponding to an entry in a table for all the character sheets, stats, etc.
// lists of tokens: character sheets (bookmarked, custom, edited), monsters (custom, bookmarked), equipment (bookmarked, custom)


// NOTE - I can include next as part of the async parameters, which will tell express to move onto the next matching middleware