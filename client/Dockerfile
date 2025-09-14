# Build stage
FROM node:22-alpine3.19 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Build the app (no TS check, only transpile/build)
RUN npm run build

# Production stage
FROM node:22-alpine3.19

WORKDIR /app

# Install 'serve' globally to serve static files
RUN npm install -g serve

# Copy only built files from builder
COPY --from=builder /app/dist .

# Expose port 1573 for the static server
EXPOSE 1573

# Serve the build output
CMD ["serve", "-s", ".", "-l", "1573"]
