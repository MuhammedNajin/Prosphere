import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { setupAuth } from "./auth/auth";
import { ROUTES } from "./routes/routes";
import { setupProxies } from "./proxy/proxy";
import { errorHandler } from '@muhammednajinnprosphere/common'
import loggerMiddleware, { customLogger } from './logger/morgan'
import { createProxyMiddleware } from "http-proxy-middleware";
import { createServer, IncomingMessage } from 'http'
import { Socket } from 'net';
import { GrpcPaymentClient } from "./grpc/grpcPaymentClient";
import ratelimitRouter from './ratelimit'
dotenv.config();

const app = express();
const server = createServer(app);
const port = 6002;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

// app.use((req,_, next) => {
//    console.log(req.url, req.method);
//    next();
// })

app.use(loggerMiddleware);


app.use('/api/v1', ratelimitRouter);

const wsChatConnectionProxy = createProxyMiddleware({
  target: 'http://localhost:8080',
  ws: true,
});

const wsNotificationConnectionProxy = createProxyMiddleware({
  target: 'http://localhost:4000',
  ws: true,
});


app.use('/socket.io/chat', wsChatConnectionProxy);
app.use('/socket.io/notification', wsNotificationConnectionProxy);


server.on('upgrade', (req, socket, head) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  console.log("url", url)
  if (url.pathname.startsWith('/socket.io')) {
    if (url.pathname.includes('/chat')) {
      wsChatConnectionProxy.upgrade(req, socket as Socket, head);
    } else if (url.pathname.includes('/notification')) {
      wsNotificationConnectionProxy.upgrade(req, socket as Socket, head);
    }
  }
});

setupAuth(app, ROUTES);
setupProxies(app, ROUTES);

try {
  const grpc = new GrpcPaymentClient()
} catch (error) {
  customLogger.error('error', error)
}

app.use(errorHandler)
app.listen(port, () => {
  console.log(`API-Gateway running at http://localhost:${port}`);
});
