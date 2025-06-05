export function getRandomInt() {
    // Generates random integer for use in user id field
    let min = 7000;
    let max = 100000;
    return Math.floor(Math.random() * (max - min + 1) + min);
}