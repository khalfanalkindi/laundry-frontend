# Use Node.js base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Clear npm cache
RUN npm cache clean --force

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Set the command to start the app
CMD ["npm", "start"]
