export function getRandomInt() {
    // generates a random integer
    let min = 7000;
    let max = 100000;
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function displayError(name, error) {
    console.error("ERROR--" + name + ": ", JSON.stringify(error));
}