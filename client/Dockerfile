# Build stage
FROM node:22-alpine3.19 as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine3.19

WORKDIR /app

# Install 'serve' globally to serve static files
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist .

# Expose port 1573 for the static server
EXPOSE 1573

# Serve using 'serve'
CMD ["serve", "-s", ".", "-l", "1573"]
