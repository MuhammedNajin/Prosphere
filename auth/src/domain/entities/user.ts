import { IUser } from "./interfaces"


export class User implements IUser {

    username: string
    email: string
    phone: string
    password: string
    jobRole: string

    constructor({ username, email, phone, password, jobRole, location, gender }: IUser) {
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.jobRole = jobRole;
        this.location = location;
        this.gender = gender;
    }

}

