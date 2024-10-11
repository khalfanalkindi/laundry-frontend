# Use the appropriate base image (Node.js if applicable)
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if using npm)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your application code
COPY . .

# Run the application
CMD ["npm", "start"]  # or the appropriate command to start your app
