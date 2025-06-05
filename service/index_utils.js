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
        return getFriendCode();
    }
    EXISTING_FRIEND_CODES.push(generated);
    return generated;
}