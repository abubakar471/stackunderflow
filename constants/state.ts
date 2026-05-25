import ROUTES from "./routes";

export const DEFAULT_EMPTY = {
    title : "No Data Found",
    message : "Looks like the database is taking a nap. Wake it up with some new questions!",
    button: {
        text :"Add Data",
        href : ROUTES.HOME
    }
}

export const DEFAULT_ERROR = {
    title : "Oops! Something went wrong",
    message : "Our servers are having a bad day. Please try again later.",  
    button: {
        text :"Try Again",
        href : ROUTES.HOME
    }
}

export const EMPTY_QUESTIONS = {
    title : "Ahh, No Questions Yet!",
    message : "It seems there are no questions here. Be the first to ask and share your knowledge with the community!",
    button: {   
        text :"Ask a Question",
        href : ROUTES.ASK_QUESTION
    }
}