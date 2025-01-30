# Use Node 20.9.0 as the base image
FROM node:22-alpine3.19

# Set the working directory in the container
WORKDIR  /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 1573

# Command to run the application
CMD ["npm", "run", "dev"]
