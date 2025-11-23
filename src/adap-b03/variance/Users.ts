export class User {

    constructor(source?: User) {
        // if applicable, copy fields
    }

    public clone(): User {
        return new User(this);
    }

    public use(): void {
        // do something
        console.log("User.use() called");
    }

}

export class Moderator extends User {

    public clone(): Moderator {
        return new Moderator(this);
    }

    public moderate(): void {
        // do something
        console.log("Moderator.moderate() called");
    }

}

export class Administrator extends Moderator {

    public clone(): Administrator {
        return new Administrator(this);
    }

    public administer(): void {
        console.log("Administrator.administer() called");
        // do something
    }

}
