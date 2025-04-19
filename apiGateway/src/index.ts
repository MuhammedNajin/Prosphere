import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { setupAuth } from "./auth/auth";
import { ROUTES } from "./routes/routes";
import { setupProxies } from "./proxy/proxy";
import { errorHandler } from '@muhammednajinnprosphere/common';
import loggerMiddleware, { customLogger } from './logger/morgan';
import { createProxyMiddleware } from "http-proxy-middleware";
import { createServer } from 'http';
import { Socket } from 'net';
import { GrpcPaymentClient } from "./grpc/grpcPaymentClient";
import ratelimitRouter from './ratelimit';

dotenv.config();

const app = express();
const server = createServer(app);
const port = process.env.PORT || 6002;

// Frontend domains for CORS
const frontendDomain = process.env.DEV_FRONTEND_DOMAIN || process.env.PROD_FRONTEND_DOMAIN;

app.use(
  cors({
    origin: [frontendDomain!],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(loggerMiddleware);
app.use('/api/v1', ratelimitRouter);

// WebSocket & Auth Proxy Configuration
const authServiceUrl = process.env.authDomain || 'http://localhost:7000';
const chatServiceUrl = process.env.chatDomain || 'http://localhost:8080';
const notificationServiceUrl = process.env.notificationDomain || 'http://localhost:4000';

// Auth Proxy (for login, signup, etc.)
const authProxy = createProxyMiddleware({
  target: authServiceUrl,
  ws: true,
  changeOrigin: true,
});


// WebSocket Proxy for Chat & Notifications
const wsChatConnectionProxy = createProxyMiddleware({
  target: chatServiceUrl,
  ws: true,
  changeOrigin: true,
});

const wsNotificationConnectionProxy = createProxyMiddleware({
  target: notificationServiceUrl,
  ws: true,
  changeOrigin: true,
});

app.use('/socket.io/auth', authProxy);
app.use('/socket.io/chat', wsChatConnectionProxy);
app.use('/socket.io/notification', wsNotificationConnectionProxy);

// Handle WebSocket Upgrades
server.on('upgrade', (req, socket, head) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  console.log("Upgrading WebSocket request:", url.pathname);

  if (url.pathname.startsWith('/socket.io')) {
    if (url.pathname.includes('/chat')) {
      wsChatConnectionProxy.upgrade(req, socket as Socket, head);
    } else if (url.pathname.includes('/notification')) {
      wsNotificationConnectionProxy.upgrade(req, socket as Socket, head);
    }
  }
});

// Setup Authentication and API Gateway Proxy Routes
setupAuth(app, ROUTES);
setupProxies(app, ROUTES);

try {
  const grpc = new GrpcPaymentClient();
} catch (error) {
  customLogger.error('GRPC Client Error:', error);
}

app.use(errorHandler);

// Start API Gateway
server.listen(port, () => {
  console.log(`API Gateway running at http://localhost:${port}`);
});


