export default class AppError extends Error {
    constructor(message, statusCode, innerError = null) {
        super(message);
        this.statusCode = statusCode;
        this.innerError = innerError;
        Error.captureStackTrace(this, this.constructor);
    }
}
