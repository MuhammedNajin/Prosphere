import morgan from "morgan";
import { createCustomLogger, customTimestampFormat } from "@muhammednajinnprosphere/common";
import winston from "winston";
import path from "node:path";

const customLogger = createCustomLogger("api-gateway", __dirname);

const logFormat = `
{
    "httpMethod": ":method",
    "requestUrl": ":url",
    "responseStatus": ":status",
    "responseTime": ":response-time ms"
}`;

function logMessageHandler(message: any) {
  customLogger.info("HTTP request received", JSON.parse(message.trim()));
}

const loggingMiddleware = morgan(logFormat, {
  stream: { write: logMessageHandler },
});

// Optional: Add error handling
customLogger.exceptions.handle(
  new winston.transports.File({
    filename: path.join(__dirname, "logs", "exceptions.log"),
    format: winston.format.combine(
      winston.format.timestamp({ format: customTimestampFormat }),
      winston.format.json()
    ),
  })
);


process.on("unhandledRejection", (error) => {
  customLogger.error("Unhandled Rejection:", error);
});

export default loggingMiddleware;
