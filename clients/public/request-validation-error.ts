import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";


export class RequestValidationError extends CustomError  {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');
    //this beacuse we are extending  a build  in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeError() {
    return this.errors.map((err) => {
      return {
        message: err.msg,
      };
    });
  }
}
