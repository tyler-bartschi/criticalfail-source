export class UserType {
    static undefinedUser = new UserType("undefined");

    constructor(name) {
        this.username = name;
    }
}