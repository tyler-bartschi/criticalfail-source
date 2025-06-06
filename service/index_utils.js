export function getRandomInt() {
    // Generates random integer for use in user id field
    let min = 7000;
    let max = 100000;
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getFriendCode(EXISTING_FRIEND_CODES) {
    // Generates a random, unique friend code
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
        return getFriendCode(EXISTING_FRIEND_CODES);
    }
    EXISTING_FRIEND_CODES.push(generated);
    return generated;
}

export function createVerifyAuth(findUser, authCookieName) {
    return async function verifyAuth(req, res, next) {
        const user = await findUser('cookie_token', req.cookies[authCookieName]);

        if (user === "error") {
            return sendError(res, 500);
        } else if (user) {
            return next();
        } else {
            return sendError(res, 401, "Unauthorized");
        }
    }
}

export function sendData(res, statusCode=200, data) {
    // handles sending data back to the frontend
    res.status(statusCode).json(data);
}

export function sendError(res, statusCode=500, message="An error occured") {
    // handles error sending
    res.status(statusCode).json({error: message});
}