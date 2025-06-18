export class AuthState {
    static Authenticated = new AuthState('authenticated');
    static Unauthenticated = new AuthState('unauthenticated');
    static Admin = new AuthState('admin');

    constructor(name) {
        this.name = name;
    }
}