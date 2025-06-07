export class UserType {
    static undefinedUser = new UserType("undefined");

    constructor(name) {
        this.username = name;
        this.profile_url = "/images/default-profile.png";
    }
}