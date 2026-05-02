import pino from 'pino'

// pino pretty causes issue with edge runtime that's why we will not use pino pretty for edge and in production
const isEdge = process.env.NEXT_RUNTIME === "edge";
const isProduction = process.env.NODE_ENV === "production";

const logger = pino({
    level : process.env.LOG_LEVEL || "info",
    transport : !isEdge && !isProduction ? {
        target : "pino-pretty",
        options : {
            colorize : true, 
            ignore : "pid, hostname",
            translateTime : "SYS:standard"
        }
    } : undefined,
    formatters : {
        level : (label) => ({level : label.toUpperCase()})
    },
    timestamp : pino.stdTimeFunctions.isoTime
})

export default logger