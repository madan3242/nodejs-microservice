const STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
};

class AppError extends Error {
    constructor(name, statusCode, description, isOperational, errorStack, loginingErrorResponse){
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errorStack = errorStack;
        this.logError = loginingErrorResponse;
        Error.captureStackTrace(this);
    }
}


// api specific errors
class ApiError extends AppError {
    constructor(name, statusCode = STATUS_CODES.INTERNAL_ERROR, description = "Internal Server Error", isOperational = true){
        super(name, statusCode, description, isOperational);
    }
}

module.exports = {
    STATUS_CODES,
    AppError,
    ApiError
}