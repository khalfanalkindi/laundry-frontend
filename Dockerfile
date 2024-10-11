FROM node:14

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your application code
COPY . .

# Expose port and define the command to run your app
EXPOSE 3000
CMD ["npm", "start"]
