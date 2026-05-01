// RequestError will be the base class
export class RequestError extends Error{
    statusCode : number;
    errors?: Record<string, string[]>;

    constructor(statusCode : number, message : string, errors?: Record<string, string[]>){
        // we are passing the message to the parent class 'Error' and super is needed for derived class

        // this just set a message to the Error instance and starts up the error functionality from here.
        super(message);

        this.statusCode = statusCode;
        this.errors = errors;
        this.name = "RequestError" // we will change the name later to be a more spcefic whehter it is a validation error or NotFoundError or something else
    }
};

// the 4 classes below are the derived class from RequestError base class
export class ValidationError extends RequestError{
    constructor(fieldErrors : Record<string, string[]>){
        const message = ValidationError.formatFieldErrors(fieldErrors);
        super(400, message, fieldErrors);
        
        this.name = "ValidationError"
        this.errors = fieldErrors;
    }

    static formatFieldErrors(errors : Record<string, string[]>) : string{
        const formattedMessages = Object.entries(errors).map(([field, messages]) => {
            const fieldName = field.charAt(0).toUpperCase() + field.slice(1)

            if(messages[0] === 'Required'){
                return `${fieldName} is required`
            } else{
                return messages.join(" and ");
            }
        });

        return formattedMessages.join(", ");
    }
};

export class NotFoundError extends RequestError{
    constructor(resource : string){
        super(404,`${resource} not found`);

        this.name = "NotFoundError";

    }
};

export class ForbiddenError extends RequestError{
    constructor(message : string = "Forbidden"){
        super(403,message);

        this.name = "ForbiddenError";

    }
};

export class UnauthorizedError extends RequestError{
    constructor(message : string = "Unauthorized"){
        super(401,message);

        this.name = "UnauthorizedError";

    }
};