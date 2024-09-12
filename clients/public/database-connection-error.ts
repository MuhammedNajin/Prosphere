import { CustomError } from "./custom-error";


export class DatabaseConnectionError extends CustomError {
  reason = "Error connecting with database";
  statusCode =500;
  constructor() {
    super('Error connecting with database');
    // By using Object.setPrototypeOf, you explicitly set the prototype of your
    // custom error instance to DatabaseConnectionError.prototype. This corrects the
    // prototype chain and ensures that instanceof DatabaseConnectionError works as intended.
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
     // set all error result in one structure for eg in client(frontedn it get like)  {
    //     errors: [
    //         message:
    //     ]
    // }
  serializeError() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
