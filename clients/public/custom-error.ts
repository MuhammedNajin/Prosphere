export abstract class CustomError extends Error {
    abstract statusCode: number;
    // Constructor accepting an optional error message
    constructor(message: string) {
        super(message); // Pass the message to the built-in Error class
        // Set the prototype explicitly to maintain prototype chain
        Object.setPrototypeOf(this, CustomError.prototype);
    }
    //should implemetme in ingerited class becuase setted abstracted in abstaract we dont have t
    // if we want implemted here we can do here 
    abstract serializeError(): { message: string }[]
}
