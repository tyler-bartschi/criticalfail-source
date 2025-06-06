import express from "express";
import bcrypt from "bcryptjs";
import {v4 as uuidv4} from "uuid";
import * as DB from '../database.js';
import * as utils from "../index_utils.js";

// global variables
const EXISTING_FRIEND_CODES = [];
const authCookieName = "cookie_token";

// creates the verifyAuth middleware from the factory in utils
const verifyAuth = utils.createVerifyAuth(findUser, authCookieName);

// exports authRouter to be used in index.js
export const authRouter = express.Router();

// AUTHROUTER FUNCTIONS

authRouter.post('/user/create', async (req, res) => {
    // creates a new user. Fails for random reasons, and if a user with the same email is found.
    // When successful, will set an authcookie and send the user object to the frontend
    // expects the request body to have an email
    const result = await findUser('email', req.body.email);
    if (result === "error") {
        utils.sendError(res, 500, "An error occured, wait a moment and try again");
    } else if (result) {
        utils.sendError(res, 409, "Email already in use");
    } else {
        const user = await createUser(req.body.email, req.body.username, req.body.password);

        if (!user) {
            utils.sendError(res, 500, "Account creation failed. Please try again");
        } else {
            setAuthCookie(res, user.cookie_token);
            // NOTE - .json automatically stringifies the object and sets the appropriate header
            utils.sendData(res, user, 200);
        }
    }
});

authRouter.post('/user/login', async (req, res) => {
    // middleware for handling login
    const user = await findUser('email', req.body.email);

    if (user === "error") {
        // findUser returns "error", means a problem occured with database
        utils.sendError(res, 500, "An error occured, wait a moment and try again");
    } else if (user) {
        // findUser properly returns the user, login here
        if (await bcrypt.compare(req.body.password, user.password)) {
            // updates the cookie_token
            user.cookie_token = uuidv4();
            let result = await DB.updateUserSingleItem(user.id, "cookie_token", user.cookie_token)
            if (!result) {
                utils.sendError(res, 500, "An error occured, wait a moment and try again");
            } else {
                setAuthCookie(res, user.cookie_token);
                utils.sendData(res, user);
            }
        } else {
            // password was incorrect
            utils.sendError(res, 401, "Incorrect password");
        }
    } else {
        // findUser did not find the user
        utils.sendError(res, 404, "Account does not exist");
    }
});

authRouter.delete('/user/logout', verifyAuth, async (req, res) => {
    const user = await findUser("cookie_token", req.cookies[authCookieName]);
    if (user === "error") {
        utils.sendError(res, 500, "An error occured. Wait a moment and try again.");
    } else if (user) {
        // user.cookie_token = null;
        await DB.updateUserSingleItem(user.id, 'cookie_token', process.env.INVALID_COOKIE);
        res.clearCookie(authCookieName);
        res.status(204).end();
    }
});

authRouter.put('/user/update', verifyAuth, async (req, res) => {
    // used for updating the user's email, username, or password
    const user = await findUser(authCookieName, req.cookies[authCookieName]);
    const allowed_fields = ["username", "password", "email"];

    if (user === "error") {
        return utils.sendError(res, 500, "An error occured, wait a moment and try again");
    } else if (user && allowed_fields.includes(req.body.field) && typeof req.body.new_value === 'string') {
        if (req.body.field === "username") {
            // user wants to change their username, allow without password authentication
            return updateUser(res, req, user, req.body.field, req.body.new_value);
        } else {
            // user wants to change password or email, get password authentication
            if (await bcrypt.compare(req.body.password, user.password)) {
                // password correct, allow change
                const new_value = req.body.field === "password" ? await bcrypt.hash(req.body.new_value, 10) : req.body.new_value;
                return updateUser(res, req, user, req.body.field, new_value);
            } else {
                // password incorrect, do not allow change
                utils.sendError(res, 401, "Incorrect password");
            }
        }
    } else {
        utils.sendError(res, 400, "Invalid field");
    }
});

// HELPER FUNCTIONS FOR THE AUTHROUTER

function setAuthCookie(res, authToken) {
    // sets authentication cookie for the user
    res.cookie(authCookieName, authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
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
    const url = await DB.getDefaultProfileUrl();

    const user = {
        id: idNum,
        email: email,
        username: username,
        password: passwordHash,
        friend_code: friend, 
        profile_url: url,
        tokens: {},
        cookie_token: uuidv4(),
    };

    if (await DB.createUser(user)) {
        return user;
    }
    return false;
}

async function updateUser(res, req, user, field, value) {
    const result = await DB.updateUserSingleItem(user.id, field, value);
    if (result) {
        // change successful
        const new_user = await findUser(authCookieName, req.cookies[authCookieName]);
        return utils.sendData(res, new_user);
    } else {
        return utils.sendError(res, 500);
    }
}

export async function updateFriendCodes() {
    // updates EXISTING_FRIEND_CODES with all the friend codes currently in the database
    const data = await DB.getAllFriendCodes();
    if (!Array.isArray(data)) {
        return;
    }
    data.forEach(item => EXISTING_FRIEND_CODES.push(item.friend_code));
}